import { google } from 'googleapis';
import { createAdminClient } from '@/lib/supabase/admin';
import { encryptToken, decryptToken } from './crypto';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
];

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl(state: string) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getConnectedEmail(accessToken: string): Promise<string | null> {
  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({ version: 'v2', auth: client });
  const { data } = await oauth2.userinfo.get();
  return data.email ?? null;
}

export async function saveConnection(adminId: string, tokens: { access_token?: string | null; refresh_token?: string | null; expiry_date?: number | null }, email: string | null) {
  if (!tokens.refresh_token) {
    throw new Error('Google did not return a refresh token. Revoke access at myaccount.google.com/permissions and try connecting again.');
  }
  const admin = createAdminClient();
  await admin.from('google_oauth_connections').upsert({
    admin_id: adminId,
    google_email: email,
    refresh_token_encrypted: encryptToken(tokens.refresh_token),
    access_token_encrypted: tokens.access_token ? encryptToken(tokens.access_token) : null,
    access_token_expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
  }, { onConflict: 'admin_id' });
}

export async function getValidAccessTokenForAdmin(adminId: string): Promise<string> {
  const admin = createAdminClient();
  const { data: connection, error } = await admin
    .from('google_oauth_connections')
    .select('*')
    .eq('admin_id', adminId)
    .single();
  if (error || !connection) throw new Error('Google Calendar is not connected yet.');

  const stillValid = connection.access_token_encrypted && connection.access_token_expires_at &&
    new Date(connection.access_token_expires_at).getTime() - Date.now() > 60_000;
  if (stillValid) return decryptToken(connection.access_token_encrypted);

  const client = getOAuthClient();
  client.setCredentials({ refresh_token: decryptToken(connection.refresh_token_encrypted) });
  const { credentials } = await client.refreshAccessToken();
  if (!credentials.access_token) throw new Error('Failed to refresh Google access token.');

  await admin.from('google_oauth_connections').update({
    access_token_encrypted: encryptToken(credentials.access_token),
    access_token_expires_at: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
  }).eq('admin_id', adminId);

  return credentials.access_token;
}

export async function createMeetEvent(params: {
  accessToken: string; title: string; description?: string | null;
  startTime: string; endTime: string; attendeeEmails?: string[];
}): Promise<{ eventId: string; meetLink: string | null }> {
  const client = getOAuthClient();
  client.setCredentials({ access_token: params.accessToken });
  const calendar = google.calendar({ version: 'v3', auth: client });

  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    sendUpdates: params.attendeeEmails?.length ? 'all' : 'none',
    requestBody: {
      summary: params.title,
      description: params.description ?? undefined,
      start: { dateTime: params.startTime },
      end: { dateTime: params.endTime },
      attendees: params.attendeeEmails?.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  });

  return {
    eventId: data.id ?? '',
    meetLink: data.hangoutLink ?? null,
  };
}

export async function deleteMeetEvent(accessToken: string, eventId: string) {
  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: client });
  await calendar.events.delete({ calendarId: 'primary', eventId, sendUpdates: 'all' });
}

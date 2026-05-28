-- Better Auth tables
-- Generated from schema: user, session, account, verification
-- Admin plugin adds: role, banned, banReason, banExpires to user

CREATE TABLE IF NOT EXISTS "user" (
  "id"             TEXT PRIMARY KEY,
  "name"           TEXT NOT NULL,
  "email"          TEXT NOT NULL UNIQUE,
  "emailVerified"  BOOLEAN NOT NULL DEFAULT FALSE,
  "image"          TEXT,
  "role"           TEXT DEFAULT 'guest',
  "banned"         BOOLEAN,
  "banReason"      TEXT,
  "banExpires"     TIMESTAMPTZ,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id"              TEXT PRIMARY KEY,
  "expiresAt"       TIMESTAMPTZ NOT NULL,
  "token"           TEXT NOT NULL UNIQUE,
  "ipAddress"       TEXT,
  "userAgent"       TEXT,
  "userId"          TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "impersonatedBy"  TEXT,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "account" (
  "id"                     TEXT PRIMARY KEY,
  "accountId"              TEXT NOT NULL,
  "providerId"             TEXT NOT NULL,
  "userId"                 TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken"            TEXT,
  "refreshToken"           TEXT,
  "idToken"                TEXT,
  "accessTokenExpiresAt"   TIMESTAMPTZ,
  "refreshTokenExpiresAt"  TIMESTAMPTZ,
  "scope"                  TEXT,
  "password"               TEXT,
  "createdAt"              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id"          TEXT PRIMARY KEY,
  "identifier"  TEXT NOT NULL,
  "value"       TEXT NOT NULL,
  "expiresAt"   TIMESTAMPTZ NOT NULL,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "account_providerId_accountId_idx" ON "account"("providerId", "accountId");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier");

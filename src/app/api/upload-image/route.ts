import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = 'nnamdi-obi-r2';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const form   = await req.formData();
    const file   = form.get('file') as File | null;
    const folder = (form.get('folder') as string | null) ?? 'media';
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Max file size is 10MB' }, { status: 400 });

    const ext    = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const key    = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await r2.send(new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: file.type,
    }));

    return NextResponse.json({ url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}` });
  } catch (err) {
    console.error('[upload-image]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 });
  }
}

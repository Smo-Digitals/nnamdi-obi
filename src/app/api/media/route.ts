import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

const BUCKET     = 'nnamdi-obi-r2';
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!;

function fileType(key: string): 'image' | 'video' | 'pdf' | 'other' {
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg','jpeg','png','webp','gif','svg','avif','heic','heif','tiff','tif','bmp','ico'].includes(ext)) return 'image';
  if (['mp4','mov','webm','avi'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  return 'other';
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const folder = new URL(req.url).searchParams.get('folder') ?? '';
  const prefix = folder && folder !== 'all' ? `${folder}/` : undefined;

  const { Contents = [] } = await r2.send(new ListObjectsV2Command({
    Bucket: BUCKET, Prefix: prefix, MaxKeys: 1000,
  }));

  const files = (Contents ?? [])
    .filter((obj) => obj.Key && !obj.Key.endsWith('/'))
    .map((obj) => {
      const key    = obj.Key!;
      const parts  = key.split('/');
      const name   = parts[parts.length - 1];
      const folderName = parts.length > 1 ? parts[0] : 'root';
      return {
        key,
        name,
        folder:       folderName,
        size:         obj.Size ?? 0,
        lastModified: obj.LastModified?.toISOString() ?? '',
        url:          `${PUBLIC_URL}/${key}`,
        type:         fileType(key),
      };
    })
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified));

  return NextResponse.json(files);
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });

  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  return NextResponse.json({ ok: true });
}

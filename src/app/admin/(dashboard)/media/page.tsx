import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { MediaLibraryClient } from '@/components/dashboard/media/MediaLibraryClient';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!;

function fileType(key: string): 'image' | 'video' | 'pdf' | 'other' {
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg','jpeg','png','webp','gif','svg'].includes(ext)) return 'image';
  if (['mp4','mov','webm','avi'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  return 'other';
}

export default async function MediaPage() {
  const { Contents = [] } = await r2.send(new ListObjectsV2Command({ Bucket: 'nnamdi-obi-r2', MaxKeys: 1000 }));

  const files = (Contents ?? [])
    .filter((obj) => obj.Key && !obj.Key.endsWith('/'))
    .map((obj) => {
      const key    = obj.Key!;
      const parts  = key.split('/');
      const name   = parts[parts.length - 1];
      const folder = parts.length > 1 ? parts[0] : 'root';
      return {
        key, name, folder,
        size:         obj.Size ?? 0,
        lastModified: obj.LastModified?.toISOString() ?? '',
        url:          `${PUBLIC_URL}/${key}`,
        type:         fileType(key),
      };
    })
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 px-6 py-5 border-b" style={{ borderColor: 'var(--adm-border)' }}>
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Media Library</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--adm-muted)' }}>Images, videos and all uploaded files</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <MediaLibraryClient initialFiles={files as never} />
      </div>
    </div>
  );
}

'use client';

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}
function driveId(url: string): string | null {
  const m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}
function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}
function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

export function PortalVideoEmbed({ url }: { url: string }) {
  const ytId = youtubeId(url);
  const gdId = !ytId ? driveId(url) : null;
  const vmId = !ytId && !gdId ? vimeoId(url) : null;
  const directFile = !ytId && !gdId && !vmId && isDirectVideoFile(url);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--adm-border)', backgroundColor: '#000' }}>
      {ytId && <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen />}
      {gdId && <iframe src={`https://drive.google.com/file/d/${gdId}/preview`} className="w-full h-full border-0" allow="autoplay" />}
      {vmId && <iframe src={`https://player.vimeo.com/video/${vmId}`} className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen />}
      {directFile && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={url} controls className="w-full h-full" />
      )}
      {!ytId && !gdId && !vmId && !directFile && (
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white/80 hover:text-white">
          Open video
        </a>
      )}
    </div>
  );
}

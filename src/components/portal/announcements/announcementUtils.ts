export type Announcement = {
  id:              string;
  title:           string;
  body:            string;
  pinned:          boolean;
  created_at:      string;
  cover_image_url: string | null;
  cover_video_url: string | null;
};

export type ViewMode = 'grid' | 'list';

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export function getYoutubeThumbnail(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export type BlockType = 'text' | 'video' | 'image' | 'document' | 'ebook' | 'link';

export type Block = {
  id: string;
  type: BlockType;
  title?: string;
  content?: string;
  url?: string;
  caption?: string;
  author?: string;
  label?: string;
  downloadable?: boolean;
};

export type Step = {
  id: string;
  roadmap_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  blocks: Block[];
  created_at: string;
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  text: 'Text',
  video: 'Video',
  image: 'Image',
  document: 'Document',
  ebook: 'Ebook',
  link: 'Link',
};

export function uid() { return Math.random().toString(36).slice(2, 10); }

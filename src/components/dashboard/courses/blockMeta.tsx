import { TextAa, VideoCamera, Image as ImageIcon, FileText, BookOpen, LinkSimple } from 'phosphor-react';
import type { BlockType } from './roadmapTypes';

export const BLOCK_META: Record<BlockType, { label: string; icon: typeof TextAa; color: string }> = {
  text:     { label: 'Text',     icon: TextAa,      color: '#60a5fa' },
  video:    { label: 'Video',    icon: VideoCamera, color: '#f472b6' },
  image:    { label: 'Image',    icon: ImageIcon,   color: '#34d399' },
  document: { label: 'Document', icon: FileText,    color: '#fbbf24' },
  ebook:    { label: 'Ebook',    icon: BookOpen,     color: '#a78bfa' },
  link:     { label: 'Link',     icon: LinkSimple,  color: '#38bdf8' },
};

export function blockSummary(block: { type: BlockType; title?: string; content?: string; url?: string; label?: string }) {
  if (block.title) return block.title;
  if (block.type === 'text') return block.content?.slice(0, 60) || 'Empty text block';
  if (block.type === 'link') return block.label || block.url || 'Untitled link';
  return block.url || `Untitled ${BLOCK_META[block.type].label.toLowerCase()}`;
}

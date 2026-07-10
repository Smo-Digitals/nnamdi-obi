export type Category = { id: string; label: string; children: { id: string; label: string }[] };

export const CATEGORIES: Category[] = [
  { id: 'community',        label: 'Community',        children: [] },
  { id: 'building-public',  label: 'Building in Public', children: [
    { id: 'founder-diaries',  label: 'Founder Diaries' },
    { id: 'product-updates',  label: 'Product Updates' },
  ]},
  { id: 'entrepreneurship', label: 'Entrepreneurship', children: [] },
  { id: 'courses',          label: 'Courses',          children: [
    { id: 'course-reviews', label: 'Course Reviews' },
    { id: 'learning-tips',  label: 'Learning Tips' },
  ]},
  { id: 'tech',             label: 'Tech',             children: [
    { id: 'web-dev',        label: 'Web Development' },
    { id: 'tools',          label: 'Tools & Resources' },
  ]},
  { id: 'marketing',        label: 'Marketing',        children: [] },
  { id: 'personal',         label: 'Personal',         children: [] },
  { id: 'finance',          label: 'Finance',          children: [] },
  { id: 'productivity',     label: 'Productivity',     children: [] },
  { id: 'industry',         label: 'Industry',         children: [] },
];

const LABEL_BY_ID = new Map<string, string>(
  CATEGORIES.flatMap((c) => [[c.id, c.label] as const, ...c.children.map((ch) => [ch.id, ch.label] as const)])
);

export function categoryLabel(id: string | null): string | null {
  if (!id) return null;
  return LABEL_BY_ID.get(id) ?? id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

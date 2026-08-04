import type { Metadata } from 'next';
import { ResourcesBody } from '@/components/marketing/ResourcesBody';

export const metadata: Metadata = {
  title: 'Resources — Nnamdi Obi',
  description: 'Writing, guides, and downloadable resources from Nnamdi Obi.',
};

export default function ResourcesPage() {
  return <ResourcesBody />;
}

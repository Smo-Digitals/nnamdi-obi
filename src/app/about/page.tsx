import type { Metadata } from 'next';
import { AboutBody } from '@/components/marketing/AboutBody';

export const metadata: Metadata = {
  title: 'About — Nnamdi Obi',
  description: 'The story and mission behind Nnamdi Obi and the community.',
};

export default function AboutPage() {
  return <AboutBody />;
}

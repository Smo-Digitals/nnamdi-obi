import type { Metadata } from 'next';
import { AcademyBody } from '@/components/marketing/AcademyBody';

export const metadata: Metadata = {
  title: 'Academy — Nnamdi Obi',
  description: 'Courses and structured learning tracks from Nnamdi Obi.',
};

export default function AcademyPage() {
  return <AcademyBody />;
}

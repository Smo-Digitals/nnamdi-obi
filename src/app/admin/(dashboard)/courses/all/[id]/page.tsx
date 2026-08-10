import { Suspense } from 'react';
import { CourseWizard } from '@/components/dashboard/courses/CourseWizard';

export default async function CourseBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <CourseWizard initialCourseId={id} />
    </Suspense>
  );
}

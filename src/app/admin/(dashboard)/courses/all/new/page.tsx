import { Suspense } from 'react';
import { CourseWizard } from '@/components/dashboard/courses/CourseWizard';

export default function NewCoursePage() {
  return (
    <Suspense>
      <CourseWizard initialCourseId={null} />
    </Suspense>
  );
}

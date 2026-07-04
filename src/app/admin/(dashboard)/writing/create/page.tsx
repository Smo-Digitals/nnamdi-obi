import { Suspense } from 'react';
import { CreatePostClient } from '@/components/dashboard/writing/CreatePostClient';
export default function CreatePostPage() {
  return (
    <Suspense>
      <CreatePostClient />
    </Suspense>
  );
}

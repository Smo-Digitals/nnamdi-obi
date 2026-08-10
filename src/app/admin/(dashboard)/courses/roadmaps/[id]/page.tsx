import { RoadmapBuilderClient } from '@/components/dashboard/courses/RoadmapBuilderClient';

export default async function RoadmapBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RoadmapBuilderClient roadmapId={id} />;
}

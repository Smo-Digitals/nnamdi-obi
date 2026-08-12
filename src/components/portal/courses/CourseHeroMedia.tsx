import Link from 'next/link';
import { Play, Lock } from 'phosphor-react';
import { PortalVideoEmbed } from './PortalVideoEmbed';

interface Props {
  courseId: string;
  introVideoUrl: string | null;
  coverImageUrl: string | null;
  title: string;
  isEnrolled: boolean;
  firstLessonId: string | null;
}

export function CourseHeroMedia({ courseId, introVideoUrl, coverImageUrl, title, isEnrolled, firstLessonId }: Props) {
  if (introVideoUrl) {
    return <PortalVideoEmbed url={introVideoUrl} />;
  }

  const image = coverImageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={coverImageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
  ) : (
    <div className="absolute inset-0" style={{ backgroundColor: 'var(--adm-card)' }} />
  );

  const overlay = isEnrolled && firstLessonId ? (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors">
      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
        <Play size={26} weight="fill" style={{ color: '#111' }} />
      </div>
    </div>
  ) : (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
        <Lock size={22} weight="bold" style={{ color: '#111' }} />
      </div>
      <span className="text-xs font-semibold text-white">Enroll to watch</span>
    </div>
  );

  const media = (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--adm-border)' }}>
      {image}
      {overlay}
    </div>
  );

  return isEnrolled && firstLessonId
    ? <Link href={`/home/courses/${courseId}/lessons/${firstLessonId}`}>{media}</Link>
    : media;
}

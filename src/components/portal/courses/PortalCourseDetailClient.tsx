'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { ArrowLeft, CaretRight, Browser, PlayCircle, BookOpen, Medal } from 'phosphor-react';
import { EnrollButton } from './EnrollButton';
import { ShareButton } from './ShareButton';
import { LiveSessionsSection } from './LiveSessionsSection';
import { CurriculumSection } from './CurriculumSection';
import { CourseHeroMedia } from './CourseHeroMedia';
import { CourseTabs } from './CourseTabs';
import { CourseInstructorCard } from './CourseInstructorCard';
import { CourseAssignmentsList } from './CourseAssignmentsList';
import type { Lesson } from '@/components/dashboard/courses/courseTypes';

type Assignment = ComponentProps<typeof CourseAssignmentsList>['assignments'][number];
type Session = ComponentProps<typeof LiveSessionsSection>['sessions'][number];
type Topic = { id: string; title: string; description: string | null; sort_order: number; lessons: Lesson[] };

type Course = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  intro_video_url: string | null;
  category: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string | null;
  what_youd_get: string;
  materials_needed: string;
  certification: boolean;
};

interface Props {
  course: Course;
  assignments: Assignment[];
  sessions: Session[];
  topics: Topic[];
  isLoggedIn: boolean;
  isEnrolled: boolean;
  completedLessonIds: string[];
}

export function PortalCourseDetailClient({ course, assignments, sessions, topics, isLoggedIn, isEnrolled, completedLessonIds }: Props) {
  const lessonCount = topics.reduce((n, t) => n + t.lessons.length, 0);
  const firstLessonId = topics[0]?.lessons[0]?.id ?? null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-1.5 text-xs mb-5" style={{ color: 'var(--adm-muted)' }}>
        <Browser size={14} />
        <Link href="/home/courses" className="hover:underline">Courses</Link>
        {course.category && <><CaretRight size={9} /><span>{course.category}</span></>}
        <CaretRight size={9} />
        <span style={{ color: 'var(--adm-text)' }}>{course.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <Link href="/home/courses" className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
            style={{ borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
            <ArrowLeft size={15} weight="bold" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>{course.title}</h1>
              {course.category && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: 'var(--adm-pill)', color: 'var(--adm-muted)' }}>
                  {course.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--adm-muted)' }}>
              <span className="flex items-center gap-1"><PlayCircle size={14} />{lessonCount} lessons</span>
              <span className="flex items-center gap-1"><BookOpen size={14} />{topics.length} topics</span>
              <span className="capitalize">{course.difficulty}</span>
              {course.certification && <span className="flex items-center gap-1"><Medal size={14} weight="fill" className="text-amber-400" />Certificate</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <ShareButton />
          {isLoggedIn ? (
            <EnrollButton courseId={course.id} initiallyEnrolled={isEnrolled} />
          ) : (
            <Link href="/login" className="inline-block px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
              Log in to enroll
            </Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <CourseHeroMedia courseId={course.id} introVideoUrl={course.intro_video_url} coverImageUrl={course.cover_image_url}
          title={course.title} isEnrolled={isEnrolled} firstLessonId={firstLessonId} />

        <div className="flex flex-col gap-4">
          <CurriculumSection courseId={course.id} topics={topics} isEnrolled={isEnrolled} completedLessonIds={completedLessonIds} />
          <CourseInstructorCard instructor={course.instructor} />
        </div>
      </div>

      <CourseTabs description={course.description} whatYoudGet={course.what_youd_get}
        materialsNeeded={course.materials_needed} instructor={course.instructor} />

      {isEnrolled && <div className="mt-8"><LiveSessionsSection sessions={sessions} /></div>}

      <div className="mt-8">
        <CourseAssignmentsList courseId={course.id} assignments={assignments} />
      </div>
    </div>
  );
}

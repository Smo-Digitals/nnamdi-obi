export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type SessionType = 'live' | 'pre_recorded' | 'recording';

export type Course = {
  id: string; title: string; description: string | null; cover_image_url: string | null;
  intro_video_url?: string | null; price: number | null; sale_price?: number | null;
  status: 'draft' | 'published' | 'archived'; created_at: string;
  difficulty: Difficulty;
  category: string | null;
  tags: string[];
  session_type: SessionType;
  what_youd_get: string;
  materials_needed: string;
  instructor: string | null;
  certification: boolean;
  coupon_code: string | null;
  group_buy: boolean;
};

export type LessonType = 'text' | 'video' | 'pdf' | 'assignment' | 'link' | 'quiz';

export type QuizOption = { id: string; text: string; correct: boolean };
export type QuizQuestion = { id: string; question: string; type: 'single' | 'multiple'; options: QuizOption[] };

export type Lesson = {
  id: string;
  type: LessonType;
  title: string;
  content?: string;
  video_url?: string;
  caption?: string;
  pdf_url?: string;
  link_url?: string;
  link_title?: string;
  assignment_instructions?: string;
  questions?: QuizQuestion[];
};

export type Resource = { id: string; title: string; url: string };

export type Topic = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  lessons: Lesson[];
  resources: Resource[];
  created_at: string;
};

export function uid() { return Math.random().toString(36).slice(2, 10); }

export function emptyCourse(): Course {
  return {
    id: '', title: '', description: '', cover_image_url: null, intro_video_url: null,
    price: 0, sale_price: null, status: 'draft', created_at: '',
    difficulty: 'beginner', category: null, tags: [], session_type: 'pre_recorded',
    what_youd_get: '', materials_needed: '', instructor: null, certification: false,
    coupon_code: null, group_buy: false,
  };
}

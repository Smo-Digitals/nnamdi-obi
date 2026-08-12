import { Rocket, TrendUp, ClipboardText, Megaphone, UsersThree, BookOpen } from 'phosphor-react';

export type CourseCardData = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  price: number;
  sale_price: number | null;
  category: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  certification: boolean;
  lessonCount: number;
  topicCount: number;
  enrolledCount: number;
  isEnrolled: boolean;
  progressPct: number;
  isLoggedIn: boolean;
};

const CATEGORY_META: Record<string, { color: string; icon: typeof Rocket }> = {
  Entrepreneurship: { color: '#DC5B17', icon: Rocket },
  Growth:           { color: '#34d399', icon: TrendUp },
  Planning:         { color: '#60a5fa', icon: ClipboardText },
  Marketing:        { color: '#f472b6', icon: Megaphone },
  Community:        { color: '#a78bfa', icon: UsersThree },
};

export function categoryMeta(category: string | null) {
  return (category && CATEGORY_META[category]) || { color: '#DC5B17', icon: BookOpen };
}

export function ctaLabel(card: CourseCardData): string {
  if (!card.isLoggedIn) return 'View course';
  if (!card.isEnrolled) return 'Enroll';
  return card.progressPct > 0 ? 'Continue' : 'Start course';
}

const PASTELS = ['#FADCE9', '#D7EBFB', '#FBF0B2', '#D7F5DE'];

export function pastelFor(index: number) {
  return PASTELS[index % PASTELS.length];
}

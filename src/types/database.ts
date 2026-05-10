export type UserRole = 'admin' | 'member' | 'guest';

export type ProjectStatus = 'active' | 'archived' | 'stealth';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  tags: string[];
  read_time_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  cover_image_url: string | null;
  url: string | null;
  github_url: string | null;
  status: ProjectStatus;
  tags: string[];
  sort_order: number;
  featured: boolean;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author_id: string | null;
  published: boolean;
  pinned: boolean;
  tags: string[];
  likes: number;
  created_at: string;
  updated_at: string;
}

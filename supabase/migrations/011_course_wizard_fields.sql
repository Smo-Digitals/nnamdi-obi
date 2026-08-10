alter table public.courses
  add column if not exists difficulty text not null default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  add column if not exists category text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists session_type text not null default 'pre_recorded' check (session_type in ('live','pre_recorded','recording')),
  add column if not exists what_youd_get text[] not null default '{}',
  add column if not exists materials_needed text[] not null default '{}',
  add column if not exists instructor text,
  add column if not exists certification boolean not null default false,
  add column if not exists coupon_code text,
  add column if not exists group_buy boolean not null default false;

alter table public.course_topics
  add column if not exists resources jsonb not null default '[]';

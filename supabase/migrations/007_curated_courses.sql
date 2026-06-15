create table if not exists public.curated_courses (
  id        uuid        default gen_random_uuid() primary key,
  course_id uuid        not null references public.courses(id) on delete cascade,
  position  integer     not null default 0,
  added_at  timestamptz not null default now(),
  unique(course_id)
);

alter table public.curated_courses enable row level security;

create policy "Admins manage curated courses"
  on public.curated_courses
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

create policy "Anyone can read curated courses"
  on public.curated_courses for select
  using (true);

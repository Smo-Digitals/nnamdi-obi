create table if not exists public.curated_links (
  id          uuid        default gen_random_uuid() primary key,
  url         text        not null,
  title       text        not null,
  description text,
  image_url   text,
  source_name text,
  author      text,
  position    integer     not null default 0,
  active      boolean     not null default true,
  added_at    timestamptz not null default now()
);

alter table public.curated_links enable row level security;

-- Admins can do everything
create policy "Admins manage curated links"
  on public.curated_links
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

-- Public can read active links
create policy "Anyone can read active curated links"
  on public.curated_links for select
  using (active = true);

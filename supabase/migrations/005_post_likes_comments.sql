alter table public.posts
  add column if not exists likes         integer not null default 0,
  add column if not exists comment_count integer not null default 0;

-- Atomic like increment
create or replace function increment_post_likes(post_id uuid)
returns void language sql security definer as $$
  update posts set likes = coalesce(likes, 0) + 1 where id = post_id;
$$;

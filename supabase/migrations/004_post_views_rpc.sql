-- Atomic increment for post view counter
create or replace function increment_post_views(post_id uuid)
returns void
language sql
security definer
as $$
  update posts
  set views = coalesce(views, 0) + 1
  where id = post_id;
$$;

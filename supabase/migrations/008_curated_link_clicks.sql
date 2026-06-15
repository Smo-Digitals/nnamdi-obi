alter table public.curated_links
  add column if not exists click_count integer not null default 0;

create or replace function increment_curated_click(link_id uuid)
returns void language sql security definer as $$
  update curated_links set click_count = coalesce(click_count, 0) + 1 where id = link_id;
$$;

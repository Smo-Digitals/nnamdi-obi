-- Extend posts table with blog-editor fields
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS subtitle          TEXT,
  ADD COLUMN IF NOT EXISTS body              TEXT,
  ADD COLUMN IF NOT EXISTS category          TEXT,
  ADD COLUMN IF NOT EXISTS categories        TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS access            TEXT    NOT NULL DEFAULT 'Free',
  ADD COLUMN IF NOT EXISTS seo_keyword       TEXT,
  ADD COLUMN IF NOT EXISTS meta_title        TEXT,
  ADD COLUMN IF NOT EXISTS meta_description  TEXT,
  ADD COLUMN IF NOT EXISTS status            TEXT    NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS views             INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured          BOOLEAN NOT NULL DEFAULT FALSE;

-- Back-fill status from existing published boolean
UPDATE public.posts SET status = CASE WHEN published THEN 'published' ELSE 'draft' END;

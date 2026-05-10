-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'guest'
                CHECK (role IN ('admin', 'member', 'guest')),
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────
-- POSTS (Blog Articles)
-- ─────────────────────────────────────────────────────────
CREATE TABLE public.posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  content           TEXT,
  excerpt           TEXT,
  cover_image_url   TEXT,
  published         BOOLEAN NOT NULL DEFAULT FALSE,
  published_at      TIMESTAMPTZ,
  author_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tags              TEXT[] NOT NULL DEFAULT '{}',
  read_time_minutes INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT USING (published = TRUE);

CREATE POLICY "Admins can manage posts"
  ON public.posts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─────────────────────────────────────────────────────────
-- PROJECTS (Portfolio)
-- ─────────────────────────────────────────────────────────
CREATE TABLE public.projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  tagline           TEXT,
  description       TEXT,
  long_description  TEXT,
  cover_image_url   TEXT,
  url               TEXT,
  github_url        TEXT,
  status            TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'archived', 'stealth')),
  tags              TEXT[] NOT NULL DEFAULT '{}',
  sort_order        INTEGER NOT NULL DEFAULT 0,
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

INSERT INTO public.projects (name, slug, tagline, description, status, sort_order, featured) VALUES
  ('Manaa',       'manaa',       'Financial infrastructure for Africa', 'A financial platform built for the African market.', 'active', 1, TRUE),
  ('Prataa',      'prataa',      'Communication platform',              'Redefining how Africans communicate online.',         'active', 2, FALSE),
  ('Craftly',     'craftly',     'Creative tools for African builders', 'Tools for the next generation of African creators.',   'active', 3, FALSE),
  ('SMO Digitals','smo-digitals','Digital marketing agency',            'Growth and digital marketing for African brands.',     'active', 4, FALSE);

-- ─────────────────────────────────────────────────────────
-- COMMUNITY POSTS
-- ─────────────────────────────────────────────────────────
CREATE TABLE public.community_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  author_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published   BOOLEAN NOT NULL DEFAULT TRUE,
  pinned      BOOLEAN NOT NULL DEFAULT FALSE,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  likes       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community posts viewable by members"
  ON public.community_posts FOR SELECT USING (
    published = TRUE
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'member')
    )
  );

CREATE POLICY "Members can create community posts"
  ON public.community_posts FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'member')
    )
  );

CREATE POLICY "Users can update own community posts"
  ON public.community_posts FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all community posts"
  ON public.community_posts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

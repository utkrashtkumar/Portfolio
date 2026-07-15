-- ============================================================
-- UTKRASHT KUMAR PORTFOLIO — CYBER NEWS SYSTEM
-- SAFE / IDEMPOTENT VERSION — Run even if tables already exist
-- Run in: Supabase Dashboard -> SQL Editor
-- ============================================================


-- ─── DROP EXISTING POLICIES (safe to re-run) ─────────────────
DROP POLICY IF EXISTS "Public can read published news"   ON cyber_news;
DROP POLICY IF EXISTS "Admin has full access to news"    ON cyber_news;
DROP POLICY IF EXISTS "Anyone can read reactions"        ON news_reactions;
DROP POLICY IF EXISTS "Anyone can add reactions"         ON news_reactions;
DROP POLICY IF EXISTS "Anyone can delete own reactions"  ON news_reactions;
DROP POLICY IF EXISTS "Anyone can read comments"         ON news_comments;
DROP POLICY IF EXISTS "Anyone can post comments"         ON news_comments;


-- ─── DROP EXISTING TRIGGER (safe to re-run) ──────────────────
DROP TRIGGER IF EXISTS cyber_news_updated_at ON cyber_news;


-- ─── 1. TABLES (IF NOT EXISTS = safe to re-run) ──────────────

CREATE TABLE IF NOT EXISTS cyber_news (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title          text NOT NULL,
  summary        text,
  content        text NOT NULL,
  content_type   text DEFAULT 'html',
  category       text DEFAULT 'General',
  thumbnail_url  text,
  tags           text[],
  author         text DEFAULT 'Utkrasht Kumar',
  published      boolean DEFAULT false,
  views          integer DEFAULT 0,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news_reactions (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id          uuid REFERENCES cyber_news(id) ON DELETE CASCADE,
  user_identifier  text NOT NULL,
  reaction         text NOT NULL,
  created_at       timestamptz DEFAULT now(),
  UNIQUE(news_id, user_identifier, reaction)
);

CREATE TABLE IF NOT EXISTS news_comments (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id     uuid REFERENCES cyber_news(id) ON DELETE CASCADE,
  parent_id   uuid REFERENCES news_comments(id) ON DELETE CASCADE,
  user_email  text NOT NULL,
  user_name   text,
  content     text NOT NULL,
  created_at  timestamptz DEFAULT now()
);


-- ─── ADD ANY MISSING COLUMNS (safe if columns already exist) ──

ALTER TABLE cyber_news ADD COLUMN IF NOT EXISTS content_type  text DEFAULT 'html';
ALTER TABLE cyber_news ADD COLUMN IF NOT EXISTS summary       text;
ALTER TABLE cyber_news ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE cyber_news ADD COLUMN IF NOT EXISTS tags          text[];
ALTER TABLE cyber_news ADD COLUMN IF NOT EXISTS author        text DEFAULT 'Utkrasht Kumar';
ALTER TABLE cyber_news ADD COLUMN IF NOT EXISTS views         integer DEFAULT 0;
ALTER TABLE cyber_news ADD COLUMN IF NOT EXISTS updated_at    timestamptz DEFAULT now();


-- ─── 2. ENABLE ROW LEVEL SECURITY ────────────────────────────

ALTER TABLE cyber_news      ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_reactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments   ENABLE ROW LEVEL SECURITY;


-- ─── 3. POLICIES (fresh — dropped safely above) ──────────────

CREATE POLICY "Public can read published news"
  ON cyber_news FOR SELECT
  USING (published = true);

CREATE POLICY "Admin has full access to news"
  ON cyber_news FOR ALL
  USING (true);

CREATE POLICY "Anyone can read reactions"
  ON news_reactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add reactions"
  ON news_reactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete own reactions"
  ON news_reactions FOR DELETE
  USING (true);

CREATE POLICY "Anyone can read comments"
  ON news_comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can post comments"
  ON news_comments FOR INSERT
  WITH CHECK (true);


-- ─── 4. AUTO-UPDATE updated_at TRIGGER ───────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cyber_news_updated_at
  BEFORE UPDATE ON cyber_news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- VERIFY — run this block separately to confirm setup:
-- ============================================================
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN ('cyber_news', 'news_reactions', 'news_comments', 'profiles');
-- ============================================================


-- ─── 5. USER PROFILES & UNIQUE CREDENTIALS SYNC ───────────────

-- Create public.profiles table to enforce uniqueness on mobile numbers and cache emails
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  mobile text UNIQUE,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Allow users to read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to synchronize auth.users metadata into public.profiles
CREATE OR REPLACE FUNCTION public.handle_user_sync()
RETURNS trigger AS $$
DECLARE
  m_phone text;
BEGIN
  m_phone := NULLIF(TRIM(new.raw_user_meta_data->>'mobile'), '');
  
  INSERT INTO public.profiles (id, email, mobile, name)
  VALUES (
    new.id,
    new.email,
    m_phone,
    COALESCE(new.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    mobile = EXCLUDED.mobile,
    name = EXCLUDED.name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute sync on insert/update in auth.users
DROP TRIGGER IF EXISTS sync_profiles ON auth.users;
CREATE TRIGGER sync_profiles
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_sync();

-- Pre-populate existing users into the profiles table
INSERT INTO public.profiles (id, email, mobile, name)
SELECT 
  id, 
  email, 
  NULLIF(TRIM(raw_user_meta_data->>'mobile'), ''),
  COALESCE(raw_user_meta_data->>'name', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Secure SECURITY DEFINER function to check if credentials exist (avoids data harvesting)
CREATE OR REPLACE FUNCTION public.check_credentials_exist(p_email text, p_mobile text)
RETURNS TABLE (email_exists boolean, mobile_exists boolean)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(email) = LOWER(TRIM(p_email))) AS email_exists,
    EXISTS (SELECT 1 FROM public.profiles WHERE mobile IS NOT NULL AND mobile = TRIM(p_mobile)) AS mobile_exists;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- STORAGE BUCKETS SETUP (Automatic initialization & RLS)
-- Run this in Supabase -> SQL Editor to enable admin file uploads
-- ============================================================

-- 1. Create buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('news-images', 'news-images', true),
  ('news-videos', 'news-videos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Allow public read access to news-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin insert access to news-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update access to news-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete access to news-images" ON storage.objects;

DROP POLICY IF EXISTS "Allow public read access to news-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin insert access to news-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update access to news-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete access to news-videos" ON storage.objects;

-- 3. Create policies for news-images bucket
CREATE POLICY "Allow public read access to news-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Allow admin insert access to news-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'utkrashtkumar@gmail.com');

CREATE POLICY "Allow admin update access to news-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'utkrashtkumar@gmail.com');

CREATE POLICY "Allow admin delete access to news-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'utkrashtkumar@gmail.com');

-- 4. Create policies for news-videos bucket
CREATE POLICY "Allow public read access to news-videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-videos');

CREATE POLICY "Allow admin insert access to news-videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'news-videos' AND (auth.jwt() ->> 'email') = 'utkrashtkumar@gmail.com');

CREATE POLICY "Allow admin update access to news-videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'news-videos' AND (auth.jwt() ->> 'email') = 'utkrashtkumar@gmail.com');

CREATE POLICY "Allow admin delete access to news-videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'news-videos' AND (auth.jwt() ->> 'email') = 'utkrashtkumar@gmail.com');


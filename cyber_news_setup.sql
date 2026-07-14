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
--   AND table_name IN ('cyber_news', 'news_reactions', 'news_comments');
-- ============================================================


-- ============================================================
-- STORAGE BUCKETS (do this in Supabase -> Storage -> New Bucket)
-- ============================================================
-- Bucket: news-images  | Public: YES
-- Bucket: news-videos  | Public: YES
-- ============================================================

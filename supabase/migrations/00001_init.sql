-- ===== FrameX Supabase Schema =====
-- Run this in your Supabase SQL Editor

-- 1. CHANNELS TABLE
CREATE TABLE IF NOT EXISTS channels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'fa-hashtag',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  channel_id BIGINT REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES TABLE (syncs with auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'offline',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Channels: all authenticated users can view
DROP POLICY IF EXISTS "Channels are viewable by all authenticated users" ON channels;
CREATE POLICY "Channels are viewable by all authenticated users" ON channels
  FOR SELECT USING (auth.role() = 'authenticated');

-- Messages: all authenticated users can view
DROP POLICY IF EXISTS "Messages are viewable by all authenticated users" ON messages;
CREATE POLICY "Messages are viewable by all authenticated users" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Messages: authenticated users can insert their own
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON messages;
CREATE POLICY "Authenticated users can insert messages" ON messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Messages: users can delete their own messages
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
CREATE POLICY "Users can delete their own messages" ON messages
  FOR DELETE USING (user_id = auth.uid());

-- Profiles: all authenticated users can view
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Profiles: users can upsert their own profile
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
CREATE POLICY "Users can manage own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- 5. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1)),
    SPLIT_PART(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. DEFAULT CHANNELS
INSERT INTO channels (name, label, icon)
SELECT * FROM (VALUES
  ('general', 'General', 'fa-hashtag'),
  ('design', 'Design', 'fa-palette'),
  ('dev', 'Development', 'fa-code'),
  ('random', 'Random', 'fa-comments'),
  ('announcements', 'Announcements', 'fa-bullhorn')
) AS data(name, label, icon)
WHERE NOT EXISTS (SELECT 1 FROM channels);

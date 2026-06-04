-- 1. Table `user_designs`
CREATE TABLE user_designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Thiết kế không tên',
  canvas_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE user_designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own designs" 
  ON user_designs FOR ALL USING (auth.uid() = user_id);

-- 2. Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('studio_assets', 'studio_assets', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('studio_exports', 'studio_exports', true) ON CONFLICT DO NOTHING;

-- Policies for studio_assets
CREATE POLICY "Public read for assets" ON storage.objects FOR SELECT USING (bucket_id = 'studio_assets');
CREATE POLICY "Users can upload their assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'studio_assets' AND auth.uid() = owner);
CREATE POLICY "Users can update their assets" ON storage.objects FOR UPDATE USING (bucket_id = 'studio_assets' AND auth.uid() = owner);
CREATE POLICY "Users can delete their assets" ON storage.objects FOR DELETE USING (bucket_id = 'studio_assets' AND auth.uid() = owner);

-- Policies for studio_exports
CREATE POLICY "Public read for exports" ON storage.objects FOR SELECT USING (bucket_id = 'studio_exports');
CREATE POLICY "Users can upload their exports" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'studio_exports' AND auth.uid() = owner);
CREATE POLICY "Users can update their exports" ON storage.objects FOR UPDATE USING (bucket_id = 'studio_exports' AND auth.uid() = owner);
CREATE POLICY "Users can delete their exports" ON storage.objects FOR DELETE USING (bucket_id = 'studio_exports' AND auth.uid() = owner);

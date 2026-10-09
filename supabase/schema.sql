-- Create references table
CREATE TABLE IF NOT EXISTS public.references (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  anatomy TEXT NOT NULL,
  principle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON public.references
  FOR SELECT
  USING (true);

-- Storage bucket creation SQL (to run in Supabase SQL editor if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('reference-captures', 'reference-captures', true);

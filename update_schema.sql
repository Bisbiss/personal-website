-- Run this in your Supabase SQL Editor to update the profiles table

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS about_content text,
ADD COLUMN IF NOT EXISTS skills jsonb DEFAULT '[
  {"category": "Frontend", "items": ["React", "Tailwind CSS", "Framer Motion"]},
  {"category": "Backend", "items": ["Node.js", "Supabase", "PostgreSQL"]},
  {"category": "Tools", "items": ["Git", "VS Code", "Figma"]}
]'::jsonb;

-- Example update to ensure data exists for testing (optional)
UPDATE public.profiles 
SET 
  tagline = 'Building digital experiences with code and creativity.',
  about_content = 'I am a passionate developer...'
WHERE tagline IS NULL;

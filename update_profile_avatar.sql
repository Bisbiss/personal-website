-- Add avatar_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Ensure storage policy allows public access to 'portfolio' bucket (already done, but good to double check mentally)
-- We will store avatar images in 'portfolio' bucket under 'profile/' folder.

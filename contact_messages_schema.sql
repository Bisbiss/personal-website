-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create index for faster queries
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (send message)
CREATE POLICY "Anyone can send contact message"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can view messages (admin only)
CREATE POLICY "Only authenticated users can view messages"
ON contact_messages FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users can update messages (mark as read)
CREATE POLICY "Only authenticated users can update messages"
ON contact_messages FOR UPDATE
TO authenticated
USING (true);

-- Optional: Create a function to send email notification (requires Supabase Edge Functions or external service)
-- This is a placeholder - you'll need to set up email notifications separately
COMMENT ON TABLE contact_messages IS 'Stores contact form submissions from the website';

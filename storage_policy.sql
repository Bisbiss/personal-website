-- Enable the storage extension if not already enabled (usually enabled by default)
-- Create a new storage bucket called 'portfolio'
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Policy: Allow public read access to all files in the 'portfolio' bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

-- Policy: Allow authenticated users to upload files to 'portfolio' bucket
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

-- Policy: Allow authenticated users to update their own files (optional, for replacing)
create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

-- Policy: Allow authenticated users to delete files
create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

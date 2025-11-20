-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Personal Data)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  bio text,
  avatar_url text,
  email text,
  phone text,
  location text,
  social_links jsonb, -- { "github": "...", "linkedin": "..." }
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- POLICIES for Profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- PROJECTS TABLE
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  content text, -- Markdown or HTML
  image_url text,
  tech_stack text[], -- Array of strings: ['React', 'Node']
  demo_url text,
  github_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid references auth.users not null
);

alter table public.projects enable row level security;

create policy "Projects are viewable by everyone."
  on public.projects for select
  using ( true );

create policy "Users can insert their own projects."
  on public.projects for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own projects."
  on public.projects for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own projects."
  on public.projects for delete
  using ( auth.uid() = user_id );

-- ARTICLES TABLE
create table public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text, -- Markdown
  cover_image text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid references auth.users not null
);

alter table public.articles enable row level security;

create policy "Published articles are viewable by everyone."
  on public.articles for select
  using ( is_published = true );

create policy "Users can see all their own articles."
  on public.articles for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own articles."
  on public.articles for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own articles."
  on public.articles for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own articles."
  on public.articles for delete
  using ( auth.uid() = user_id );

-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10, 2),
  image_url text,
  buy_link text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid references auth.users not null
);

alter table public.products enable row level security;

create policy "Active products are viewable by everyone."
  on public.products for select
  using ( is_active = true );

create policy "Users can insert their own products."
  on public.products for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own products."
  on public.products for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own products."
  on public.products for delete
  using ( auth.uid() = user_id );

-- STORAGE BUCKETS (You need to create these in Supabase Dashboard Storage)
-- 'portfolio-images' (public)

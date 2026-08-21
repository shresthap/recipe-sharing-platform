-- Recipe Sharing Platform — initial schema
-- Run this in the Supabase SQL Editor (or via the CLI).
-- Assumes Auth is enabled with Email provider only.

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint display_name_length check (char_length(display_name) between 1 and 80)
);

-- ---------------------------------------------------------------------------
-- Recipes
-- ---------------------------------------------------------------------------

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  ingredients text[] not null default '{}',
  steps text[] not null default '{}',
  image_url text,
  prep_time_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint title_length check (char_length(title) between 1 and 120),
  constraint description_length check (description is null or char_length(description) <= 1000),
  constraint category_allowed check (
    category in ('Appetizers', 'Main Courses', 'Desserts', 'Breakfast', 'Soups')
  ),
  constraint ingredients_not_empty check (cardinality(ingredients) >= 1),
  constraint steps_not_empty check (cardinality(steps) >= 1),
  constraint prep_time_positive check (prep_time_minutes is null or prep_time_minutes > 0)
);

create index recipes_user_id_idx on public.recipes (user_id);
create index recipes_category_idx on public.recipes (category);
create index recipes_created_at_idx on public.recipes (created_at desc);

-- Keyword search on title + description
alter table public.recipes
  add column search_vector tsvector
    generated always as (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) stored;

create index recipes_search_idx on public.recipes using gin (search_vector);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile when a user signs up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;

-- Profiles: anyone can read; owners can update their own row
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Recipes: public browse; authenticated create; owners edit/delete
create policy "Recipes are viewable by everyone"
  on public.recipes for select
  using (true);

create policy "Authenticated users can insert recipes"
  on public.recipes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own recipes"
  on public.recipes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own recipes"
  on public.recipes for delete
  to authenticated
  using (auth.uid() = user_id);

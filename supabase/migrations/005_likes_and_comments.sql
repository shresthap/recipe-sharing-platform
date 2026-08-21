-- Likes and comments on recipes.
-- Run this in the Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Recipe likes (one like per user per recipe)
-- ---------------------------------------------------------------------------

create table public.recipe_likes (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),

  primary key (recipe_id, user_id)
);

create index recipe_likes_user_id_idx on public.recipe_likes (user_id);
create index recipe_likes_recipe_id_idx on public.recipe_likes (recipe_id);

-- ---------------------------------------------------------------------------
-- Recipe comments
-- ---------------------------------------------------------------------------

create table public.recipe_comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint comment_body_length check (char_length(trim(body)) between 1 and 1000)
);

create index recipe_comments_recipe_id_idx
  on public.recipe_comments (recipe_id, created_at desc);

create index recipe_comments_user_id_idx on public.recipe_comments (user_id);

create trigger recipe_comments_set_updated_at
  before update on public.recipe_comments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.recipe_likes enable row level security;
alter table public.recipe_comments enable row level security;

-- Likes: anyone can see them; signed-in users can add/remove their own
create policy "Likes are viewable by everyone"
  on public.recipe_likes for select
  using (true);

create policy "Authenticated users can like recipes"
  on public.recipe_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can unlike their own likes"
  on public.recipe_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- Comments: anyone can read; signed-in users create; authors edit/delete
create policy "Comments are viewable by everyone"
  on public.recipe_comments for select
  using (true);

create policy "Authenticated users can insert comments"
  on public.recipe_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.recipe_comments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.recipe_comments for delete
  to authenticated
  using (auth.uid() = user_id);

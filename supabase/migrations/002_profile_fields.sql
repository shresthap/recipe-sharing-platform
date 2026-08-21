-- Add username, full_name, and bio to profiles.
-- Run this in the Supabase SQL Editor.

alter table public.profiles
  add column if not exists username text,
  add column if not exists full_name text,
  add column if not exists bio text;

update public.profiles
set
  full_name = coalesce(nullif(full_name, ''), display_name),
  username = coalesce(
    nullif(username, ''),
    'u' || left(replace(id::text, '-', ''), 29)
  )
where username is null or full_name is null;

alter table public.profiles
  alter column username set not null,
  alter column full_name set not null;

alter table public.profiles
  drop constraint if exists username_format,
  drop constraint if exists username_length,
  drop constraint if exists full_name_length,
  drop constraint if exists bio_length;

alter table public.profiles
  add constraint username_format check (username ~ '^[A-Za-z0-9]{1,30}$'),
  add constraint full_name_length check (char_length(full_name) between 1 and 80),
  add constraint bio_length check (bio is null or char_length(bio) <= 300);

drop index if exists profiles_username_idx;
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  new_username text;
  new_full_name text;
begin
  new_full_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    split_part(new.email, '@', 1)
  );

  base_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '', 'g'));
  if char_length(base_username) < 3 then
    base_username := 'user';
  end if;

  new_username := left(base_username, 22) || left(replace(new.id::text, '-', ''), 8);

  insert into public.profiles (id, display_name, username, full_name)
  values (new.id, new_full_name, new_username, new_full_name);

  return new;
end;
$$;

-- Allow periods and underscores in usernames.
-- Set new accounts' username and full_name from the email prefix (before @).
-- Run this in the Supabase SQL Editor.

alter table public.profiles
  drop constraint if exists username_format;

alter table public.profiles
  add constraint username_format check (
    username ~ '^[A-Za-z0-9._]{1,64}$'
    and username ~ '[A-Za-z0-9]'
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  email_local text;
  new_username text;
  new_full_name text;
begin
  email_local := split_part(new.email, '@', 1);
  new_full_name := left(email_local, 80);

  new_username := left(regexp_replace(email_local, '[^A-Za-z0-9._]', '', 'g'), 64);
  if new_username is null or new_username = '' or new_username !~ '[A-Za-z0-9]' then
    new_username := 'user' || left(replace(new.id::text, '-', ''), 8);
  end if;

  if exists (
    select 1 from public.profiles where lower(username) = lower(new_username)
  ) then
    new_username := left(new_username, 56) || left(replace(new.id::text, '-', ''), 8);
  end if;

  insert into public.profiles (id, display_name, username, full_name)
  values (new.id, new_full_name, new_username, new_full_name);

  return new;
end;
$$;

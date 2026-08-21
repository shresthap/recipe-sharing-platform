-- Allow usernames to be any unique alphanumeric name.
-- Run this in the Supabase SQL Editor if you already ran 002_profile_fields.sql.

update public.profiles
set username = left(regexp_replace(username, '[^A-Za-z0-9]', '', 'g'), 30)
where username !~ '^[A-Za-z0-9]{1,30}$';

update public.profiles
set username = 'u' || left(replace(id::text, '-', ''), 29)
where username is null or username = '';

alter table public.profiles
  drop constraint if exists username_format;

alter table public.profiles
  add constraint username_format check (username ~ '^[A-Za-z0-9]{1,30}$');

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

  base_username := regexp_replace(split_part(new.email, '@', 1), '[^A-Za-z0-9]', '', 'g');
  if char_length(base_username) < 1 then
    base_username := 'user';
  end if;

  new_username := left(base_username, 22) || left(replace(new.id::text, '-', ''), 8);

  insert into public.profiles (id, display_name, username, full_name)
  values (new.id, new_full_name, new_username, new_full_name);

  return new;
end;
$$;

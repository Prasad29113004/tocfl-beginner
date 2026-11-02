-- Run once in Supabase Dashboard > SQL Editor for this project.
-- This table stores one study snapshot per authenticated user.
create table if not exists public.study_progress (
  user_id uuid primary key references auth.users (id) on delete cascade default auth.uid(),
  progress jsonb not null default '{}'::jsonb,
  official_vocabulary jsonb not null default '[]'::jsonb,
  official_known jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  revision integer not null default 1 check (revision >= 1),
  constraint study_progress_shape check (
    jsonb_typeof(progress) = 'object'
    and jsonb_typeof(official_vocabulary) = 'array'
    and jsonb_typeof(official_known) = 'array'
  )
);

alter table public.study_progress enable row level security;
revoke all on table public.study_progress from anon, authenticated;
grant select, insert, update on table public.study_progress to authenticated;

drop policy if exists "read own TOCFL progress" on public.study_progress;
create policy "read own TOCFL progress"
  on public.study_progress for select to authenticated
  using (auth.uid() is not null and user_id = (select auth.uid()));

drop policy if exists "insert own TOCFL progress" on public.study_progress;
create policy "insert own TOCFL progress"
  on public.study_progress for insert to authenticated
  with check (auth.uid() is not null and user_id = (select auth.uid()));

drop policy if exists "update own TOCFL progress" on public.study_progress;
create policy "update own TOCFL progress"
  on public.study_progress for update to authenticated
  using (auth.uid() is not null and user_id = (select auth.uid()))
  with check (auth.uid() is not null and user_id = (select auth.uid()));

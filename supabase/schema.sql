-- Rhetoric progress sync
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
--
-- Each signed-in user owns exactly one row containing the whole progress
-- document: the current studio draft, the structure checklists and the practice
-- record. Row-level security makes the public anon key safe to ship in the web
-- bundle: clients can only read and write their own row.

create table if not exists public.rhetoric_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.rhetoric_progress enable row level security;

drop policy if exists "rhetoric_progress_select_own" on public.rhetoric_progress;
create policy "rhetoric_progress_select_own"
  on public.rhetoric_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "rhetoric_progress_insert_own" on public.rhetoric_progress;
create policy "rhetoric_progress_insert_own"
  on public.rhetoric_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "rhetoric_progress_update_own" on public.rhetoric_progress;
create policy "rhetoric_progress_update_own"
  on public.rhetoric_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "rhetoric_progress_delete_own" on public.rhetoric_progress;
create policy "rhetoric_progress_delete_own"
  on public.rhetoric_progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at accurate even if a client forgets to send it.
create or replace function public.touch_rhetoric_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rhetoric_progress_touch_updated_at on public.rhetoric_progress;
create trigger rhetoric_progress_touch_updated_at
  before update on public.rhetoric_progress
  for each row
  execute function public.touch_rhetoric_progress_updated_at();

-- Optional LLM connection for signed-in accounts.
-- The API key is stored server-side with the same row-level security as the
-- progress document. It is never written to the browser's localStorage.
create table if not exists public.rhetoric_llm_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  api_url text not null default '',
  api_key text not null default '',
  model text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.rhetoric_llm_settings enable row level security;

drop policy if exists "rhetoric_llm_select_own" on public.rhetoric_llm_settings;
create policy "rhetoric_llm_select_own"
  on public.rhetoric_llm_settings for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "rhetoric_llm_insert_own" on public.rhetoric_llm_settings;
create policy "rhetoric_llm_insert_own"
  on public.rhetoric_llm_settings for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "rhetoric_llm_update_own" on public.rhetoric_llm_settings;
create policy "rhetoric_llm_update_own"
  on public.rhetoric_llm_settings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "rhetoric_llm_delete_own" on public.rhetoric_llm_settings;
create policy "rhetoric_llm_delete_own"
  on public.rhetoric_llm_settings for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.touch_rhetoric_llm_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rhetoric_llm_touch_updated_at on public.rhetoric_llm_settings;
create trigger rhetoric_llm_touch_updated_at
  before update on public.rhetoric_llm_settings
  for each row
  execute function public.touch_rhetoric_llm_settings_updated_at();

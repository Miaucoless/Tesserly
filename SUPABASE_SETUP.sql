-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Creates a table to store one sync blob per user and restricts access with RLS.

-- Table: one row per user, state = JSON blob (notes, folders, settings, etc.)
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Only authenticated users can read/write their own row
alter table public.user_data enable row level security;

drop policy if exists "Users can read own data" on public.user_data;
create policy "Users can read own data"
  on public.user_data for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own data" on public.user_data;
create policy "Users can insert own data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own data" on public.user_data;
create policy "Users can update own data"
  on public.user_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

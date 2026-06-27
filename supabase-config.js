/* =============================================================
   SUPABASE CONFIG  —  fill these two values in to enable
   player accounts (email/password), cloud save, and online PvP.

   The game works fully offline without this (saves stay in this
   browser via localStorage). Once you add your keys below, sign-in
   + cloud save + online PvP matchmaking all turn on automatically.

   ----------------------------------------------------------------
   HOW TO SET UP (one time, ~5 min, free):
   1. Go to https://supabase.com  ->  create a free project.
   2. Project Settings -> API:
        - copy "Project URL"        into  url
        - copy the "anon public" key into  anonKey
      (The anon key is safe to ship in a static site — it only allows
       what your Row Level Security policies allow.)
   3. In the Supabase "SQL Editor", run the SQL block printed at the
      bottom of this file to create the player-save table + policies.
   4. Deploy to Netlify as usual. Done.
   ============================================================= */
window.SUPABASE_CONFIG = {
	url: 'https://rbzssysunbhuheimaztx.supabase.co',
	anonKey: 'sb_publishable_l57GSg2A3FrGPRGYY60LsA_Z2yq1s0T',
};

/* =============================================================
   RUN THIS ONCE IN THE SUPABASE SQL EDITOR
   -------------------------------------------------------------
   -- Player profile + full save blob (spells, loadouts, stats…)
   create table if not exists public.profiles (
     id uuid primary key references auth.users(id) on delete cascade,
     email text,
     save_data jsonb default '{}'::jsonb,
     updated_at timestamptz default now()
   );
   alter table public.profiles enable row level security;

   create policy "own profile - read"
     on public.profiles for select using (auth.uid() = id);
   create policy "own profile - insert"
     on public.profiles for insert with check (auth.uid() = id);
   create policy "own profile - update"
     on public.profiles for update using (auth.uid() = id);

   -- PvP matchmaking queue (for casual 1v1)
   create table if not exists public.pvp_queue (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade,
     display_name text,
     match_id uuid,
     created_at timestamptz default now()
   );
   alter table public.pvp_queue enable row level security;
   create policy "queue - all read"  on public.pvp_queue for select using (true);
   create policy "queue - self write" on public.pvp_queue for insert with check (auth.uid() = user_id);
   create policy "queue - self update" on public.pvp_queue for update using (true);
   create policy "queue - self delete" on public.pvp_queue for delete using (auth.uid() = user_id);
   ============================================================= */

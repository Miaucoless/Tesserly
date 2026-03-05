# Supabase setup for Tesserly (cross-device sync)

1. **Create a Supabase project**  
   [supabase.com](https://supabase.com) → New project → pick org, name, password, region.

2. **Run the SQL**  
   In the dashboard: **SQL Editor** → New query → paste the contents of `SUPABASE_SETUP.sql` → Run.  
   This creates the `user_data` table and RLS so each user can only read/write their own row.

3. **Get URL and anon key**  
   **Project Settings** → **API** → copy **Project URL** and **anon public** key.

4. **Configure the app**  
   Edit `src/supabase-config.js` and set:
   - `window.SUPABASE_URL` = your Project URL  
   - `window.SUPABASE_ANON_KEY` = your anon key  

5. **Auth (optional)**  
   In Supabase: **Authentication** → **Providers** → enable **Email**.  
   If you want “Confirm email” off for testing: **Authentication** → **Providers** → Email → disable “Confirm email”.

After that, sign up / sign in in Tesserly uses Supabase Auth, and notes, folders, calendar, pads, and settings sync to Supabase and load on other devices when the same user signs in.

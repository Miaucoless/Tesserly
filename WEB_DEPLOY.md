# Deploy Tesserly web version to Vercel

The same Tesserly app runs in the browser. Auth and sync use Supabase (configure `src/supabase-config.js`). Auto-update and some desktop-only features are no-ops on the web.

## Deploy to Vercel

1. **Push your repo to GitHub** (if not already).

2. **Sign in at [vercel.com](https://vercel.com)** and click **Add New** → **Project**.

3. **Import** your GitHub repo (e.g. `Miaucoless/Tesserly`).

4. **Leave the defaults:**
   - Build Command: `npm run build:web`
   - Output Directory: `public`
   (Or set them if Vercel didn’t pick them up from `vercel.json`.)

5. **Supabase on Vercel (recommended):** In the project **Settings → Environment Variables**, add:
   - `SUPABASE_URL` = your Supabase project URL (e.g. `https://xxxx.supabase.co`)
   - `SUPABASE_ANON_KEY` = your Supabase anon (publishable) key  
   The build will inject these into the page so sync works even if `supabase-config.js` isn’t cached. Redeploy after adding them.

6. **Deploy.** Vercel runs `npm run build:web` (copies `src/Tesserly.html` → `public/index.html`, copies `src/supabase-config.js` when present, and injects env config when `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set), then serves the `public` folder.

7. Your app will be at `https://your-project.vercel.app`.

## Local web build

To test the web build locally:

```bash
npm run build:web
npx serve public
```

Then open http://localhost:3000 (or the URL `serve` prints).

## Supabase

Ensure Supabase is set up (see `SUPABASE.md`). For the web app you can either:
- Set **Vercel env vars** `SUPABASE_URL` and `SUPABASE_ANON_KEY` (recommended for production), or
- Use `src/supabase-config.js` with your project URL and anon key (and ensure it’s committed so the build can copy it).

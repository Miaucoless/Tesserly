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

5. **Deploy.** Vercel will run `npm run build:web` (copying `src/Tesserly.html` → `public/index.html` and `src/supabase-config.js` → `public/supabase-config.js`), then serve the `public` folder.

6. Your app will be at `https://your-project.vercel.app`.

## Local web build

To test the web build locally:

```bash
npm run build:web
npx serve public
```

Then open http://localhost:3000 (or the URL `serve` prints).

## Supabase

Ensure Supabase is set up (see `SUPABASE.md`) and that `src/supabase-config.js` has your project URL and anon key. The web app uses the same Supabase project for auth and sync.

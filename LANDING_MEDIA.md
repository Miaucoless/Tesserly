# Landing page: videos and images

You can use **videos** or **images** instead of (or with) the SVG graphics in each feature block on the home page.

## Where to put files

- **Option A:** In your repo, e.g. `src/landing-media/` or `public/landing/`, then reference them by path.
- **Option B:** Host on a CDN (e.g. Vercel blob, Cloudinary, S3) and use the full URL in `src`.

For the **web build**, anything under `public/` is copied as-is when you deploy. So if you add `public/landing/notes-demo.mp4`, the path in HTML would be `landing/notes-demo.mp4` (or `/landing/notes-demo.mp4`).

## Use a video

Inside the `<div class="landing-feature-visual reveal">` for that feature, **replace the SVG** with:

```html
<video src="landing/your-video.mp4" muted loop playsinline autoplay></video>
```

- **muted** and **playsinline** are required for autoplay in most browsers.
- Optional: **poster="landing/poster.jpg"** for a thumbnail before play.
- Keep the file short (e.g. 5–15 seconds) and small so the page stays fast.

## Use an image

Replace the SVG with:

```html
<img src="landing/your-image.png" alt="Short description of the feature">
```

- Use **WebP** or **PNG**; max width ~800px is enough for the layout.
- **alt** text is good for accessibility and SEO.

## Which feature block to edit

In `src/Tesserly.html`, search for `data-feature="notes"`, `data-feature="questions"`, `data-feature="anki"`, `data-feature="summarize"`, or `data-feature="calendar"`. The `.landing-feature-visual` div for that block is where you put the `<video>` or `<img>` (and remove the `<svg>...</svg>` if you’re not keeping it).

After editing, run `npm run build:web` so `public/` gets the updated HTML. If your media files are in `public/landing/`, they’ll be deployed with the site.

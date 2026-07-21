# TideSpool Studios Website

Professional portfolio website for TideSpool Studios with an admin dashboard for managing portfolio content and contact messages.

## Features

- Cinematic landing page with About, Services, Portfolio, Process, and Contact sections
- Portfolio showcase with video embeds and photography
- Contact form with admin inbox
- Secure admin login and content dashboard
- Vercel-ready deployment

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Vercel Blob (production content storage)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default local admin password: `tidespool2026`

## Replace Your About Photo

Replace this file with your own camera photo:

`public/images/about-camera.jpg`

Recommended size: at least 1200px on the longest edge.

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Recommended | Admin login password |
| `SESSION_SECRET` | Recommended | Secret used to sign admin sessions |
| `BLOB_READ_WRITE_TOKEN` | Production writes | Automatically provided when Vercel Blob is connected |

## Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
4. In Vercel, open **Storage** and create a **Blob** store for the project
5. Deploy

The public site works immediately with seeded portfolio content. After Blob storage is connected, admin changes and contact messages persist across deployments.

## Admin Usage

1. Visit `/admin/login`
2. Sign in with your admin password
3. Add, edit, or delete portfolio items
4. Review contact form submissions in the dashboard

### Portfolio item tips

- **Videos:** use a YouTube embed URL, e.g. `https://www.youtube.com/embed/VIDEO_ID`
- **Photos:** use a direct image URL
- **Thumbnail:** optional image used on portfolio cards

## Project Structure

```text
src/
  app/              Pages and API routes
  components/       Public site components
  lib/              Auth, storage, and shared types
data/
  portfolio.json    Seed portfolio content
public/
  images/           Static assets
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — run production server locally
- `npm run lint` — lint the project

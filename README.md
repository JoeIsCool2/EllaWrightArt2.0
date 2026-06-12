# EllaWrightArt

A professional online art portfolio for Ella Wright — view artwork, learn about the artist, contact her, and request commissions.

Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**, **Supabase**, and **Resend**.

## Features

- Beautiful, responsive gallery with category filtering
- Individual artwork detail pages with SEO metadata
- Working contact and commission forms (email via Resend)
- Password-protected admin dashboard at `/admin`
- Supabase-powered artwork management (upload, edit, delete, reorder)
- Image protection (no right-click, no drag, subtle watermark)
- Sample artwork data fallback when Supabase is not connected

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, production URL on Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL only (no `/rest/v1`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** — required for admin image uploads |
| `RESEND_API_KEY` | Resend API key for contact & commission forms |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `CONTACT_EMAIL` | Where form submissions are delivered |

**Important:**
- `NEXT_PUBLIC_*` variables are available in the browser.
- `SUPABASE_SERVICE_ROLE_KEY` must **never** be exposed to client code or `NEXT_PUBLIC_*` vars.
- Restart the dev server after changing `.env.local`.

The public site works without Supabase using bundled sample artwork. Once Supabase is connected, upload real artwork at `/admin` — the sample gallery is replaced automatically.

## Supabase Setup

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run Migrations

Open the **SQL Editor** in your Supabase dashboard and run these files **in order**:

1. `supabase/migrations/001_artworks.sql` — artworks table + RLS
2. `supabase/migrations/002_object_position.sql` — safe if already in 001
3. `supabase/migrations/004_storage_bucket.sql` — `artwork-images` bucket + storage policies

Optionally run `003_seed_sample_artworks.sql` to import bundled sample artworks (uses local `/artwork/` paths until re-uploaded via admin). **Warning:** this deletes existing rows in `artworks`.

### 3. Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter Ella's email and a secure password
4. Use these credentials at `/admin/login`

### 4. Configure Auth URLs

In **Authentication** → **URL Configuration**:

- **Site URL:** `https://ella-wright-art2-0.vercel.app` (or `http://localhost:3000` for local)
- **Redirect URLs:**
  - `https://ella-wright-art2-0.vercel.app/**`
  - `http://localhost:3000/**`
  - `http://localhost:3001/**`

### 5. Add Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

Use the **Project URL** from Supabase → Project Settings → API. Do **not** include `/rest/v1`.

## Admin Dashboard

Ella can manage artwork at `/admin` without touching code.

### Login

1. Visit `/admin/login`
2. Sign in with the Supabase user created above
3. You'll land on the artwork dashboard

### What Ella Can Do

| Action | How |
|---|---|
| **Add artwork** | Add Artwork → upload image, fill details, preview, save |
| **Edit** | Edit icon on any artwork row |
| **Replace image** | Edit → Replace Image (old storage file removed when safe) |
| **Adjust card crop** | Focal point presets + live gallery card preview |
| **Reorder** | Up/down arrows on the dashboard list |
| **Delete** | Trash icon → confirmation modal |
| **Featured / home** | Toggles on the artwork form |

### Image Uploads

- Uploads go to Supabase Storage bucket `artwork-images`
- Path format: `artworks/{slug}/{slug}-{timestamp}.jpg`
- Accepted: JPG, JPEG, PNG, WebP · Max 10 MB
- Uploads use a **server API route** with `SUPABASE_SERVICE_ROLE_KEY` (never sent to the browser)
- Public gallery images use the storage public URL

### If Admin Shows Setup Instructions

Missing variables are listed by name on `/admin` (no secret values shown). Common fixes:

1. Add all env vars in Vercel → Settings → Environment Variables
2. Run migration `004_storage_bucket.sql`
3. **Redeploy** after adding env vars
4. Confirm Supabase Auth URLs are configured

## Resend Setup (Contact & Commission Forms)

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain (or use the sandbox for testing)
3. Create an API key
4. Add to `.env.local`:

```
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=EllaWrightArt <hello@yourdomain.com>
CONTACT_EMAIL=ellawright.artist@gmail.com
```

Forms send emails to `CONTACT_EMAIL` (defaults to `ellawright.artist@gmail.com`).

## Deploy on Vercel

Live site: [https://ella-wright-art2-0.vercel.app](https://ella-wright-art2-0.vercel.app)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in **Vercel → Settings → Environment Variables** (Production + Preview):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ella-wright-art2-0.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yourproject.supabase.co` (no `/rest/v1`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender |
| `CONTACT_EMAIL` | `ellawright.artist@gmail.com` |

4. **Redeploy** after adding env vars (Deployments → … → Redeploy)
5. Run Supabase migrations if not already done
6. Create admin user and configure Auth URLs (see above)
7. Test `/admin` → login → upload → confirm public gallery updates

Gallery and artwork pages revalidate every 60 seconds so new uploads appear without a full redeploy.

## Sample vs. Live Artwork

| State | Public gallery | Admin dashboard |
|---|---|---|
| No Supabase env vars | Shows bundled sample artworks | Shows setup instructions |
| Supabase connected, empty table | Empty gallery | Prompts to add first artwork |
| Supabase connected with uploads | Shows uploaded artwork only | Full CRUD management |

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard + login
│   └── api/
│       ├── admin/          # Artwork CRUD + image upload
│       ├── contact/
│       └── commission/
├── components/admin/       # Admin UI components
└── lib/
    ├── artworks/           # Data layer + sample data
    ├── storage/            # Storage helpers (server-only)
    └── supabase/           # Supabase clients
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

Private — All artwork © Ella Wright.

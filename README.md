# EllaWrightsArt

A professional online art portfolio for Ella Wright — view artwork, learn about the artist, contact her, and request commissions.

Built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**, **Supabase**, and **Resend**.

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
| `NEXT_PUBLIC_SITE_URL` | Your site URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `RESEND_API_KEY` | Resend API key for email |
| `RESEND_FROM_EMAIL` | Verified sender email in Resend |

The public site works without Supabase using bundled sample artwork in `src/lib/artworks/sample-data.ts`. Once Supabase is connected, upload real artwork at `/admin` — the sample gallery is replaced automatically. Contact and commission forms require Resend to send email.

### Sample vs. Live Artwork

| State | Public gallery | Admin dashboard |
|---|---|---|
| No Supabase env vars | Shows 8 sample artworks | Shows setup instructions |
| Supabase connected, empty table | Shows empty gallery | Prompts to add first artwork |
| Supabase connected with uploads | Shows uploaded artwork only | Full CRUD management |

## Supabase Setup

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the Artworks Migration

Open the **SQL Editor** in your Supabase dashboard and run the migration file:

```
supabase/migrations/001_artworks.sql
```

This creates the `artworks` table with Row Level Security policies.

Optionally run `supabase/migrations/003_seed_sample_artworks.sql` to import all 34 bundled artworks (uses local `/artwork/` image paths until re-uploaded via admin).

### 3. Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `artwork-images`
3. Enable **Public bucket**
4. Add storage policies (see comments at bottom of migration SQL file):
   - Public read access for all users
   - Authenticated users can upload, update, and delete

### 4. Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter Ella's email and a secure password
4. She will use these credentials to log in at `/admin/login`

### 5. Add Environment Variables

Add your Supabase URL and anon key to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

Use the **Project URL** from Supabase → Project Settings → API. Do **not** include `/rest/v1` or a trailing slash.

## Resend Setup (Contact & Commission Forms)

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain (or use the sandbox for testing)
3. Create an API key
4. Add to `.env.local`:

```
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=EllaWrightsArt <hello@yourdomain.com>
```

Forms send emails to `ellawright.artist@gmail.com`. Commission reference photos are uploaded to Supabase Storage when configured.

## Admin Dashboard

Ella can manage artwork at `/admin`:

1. Log in at `/admin/login` with Supabase credentials
2. View all artwork in a sortable list
3. **Add Artwork** — upload image, fill details, preview, save
4. **Edit** — update any artwork field
5. **Delete** — remove artwork with confirmation
6. **Reorder** — use up/down controls to change display order

### Artwork Fields

- Title, slug, category, medium, size, year
- Description and image alt text
- Available for purchase toggle
- Featured artwork toggle
- Show on homepage toggle
- Display order

## Deploy on Vercel

Live site: [https://ella-wright-art2-0.vercel.app](https://ella-wright-art2-0.vercel.app)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add these environment variables in **Vercel → Settings → Environment Variables** (Production + Preview):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ella-wright-art2-0.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL only: `https://yourproject.supabase.co` (no `/rest/v1`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon **public** key (Project Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional server-only secret (not used by the app today; never expose to client code) |
| `RESEND_API_KEY` | Resend API key for contact & commission forms |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `EllaWrightsArt <hello@yourdomain.com>` |

Contact form emails go to `ellawright.artist@gmail.com` (set in `src/lib/constants.ts`).

4. **Redeploy** after adding env vars (Deployments → … → Redeploy)

### Supabase Auth URLs (required for `/admin/login`)

In Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** `https://ella-wright-art2-0.vercel.app`
- **Redirect URLs:**
  - `https://ella-wright-art2-0.vercel.app/**`
  - `http://localhost:3000/**`
  - `http://localhost:3001/**`

### If `/admin` shows setup instructions

The public site works with bundled sample artwork when Supabase is not configured. Admin requires Supabase. Check that both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set on Vercel, then redeploy.

Vercel will automatically detect Next.js and configure the build. Gallery and artwork pages revalidate every 60 seconds so new uploads appear without a full redeploy.

## Adding Payments Later (Stripe)

Payments are intentionally not implemented yet. Here is where to add Stripe when ready:

### Commission Deposits

- **File:** `src/components/forms/CommissionForm.tsx`
- After form submission success, redirect to a Stripe Checkout session
- Create API route: `src/app/api/stripe/checkout/route.ts`
- Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Artwork Purchases

- **File:** `src/components/artwork/ArtworkDetail.tsx`
- Replace the "Contact Ella to inquire" link with a "Purchase" button for `is_available` artworks
- Create checkout session with artwork metadata
- Handle webhook at `src/app/api/stripe/webhook/route.ts` to mark artwork as sold

### Recommended Stripe Flow

```
User clicks Purchase
  → POST /api/stripe/checkout { artworkId }
  → Create Stripe Checkout Session
  → Redirect to Stripe
  → Webhook confirms payment
  → Update artwork.is_available = false
  → Send confirmation email via Resend
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home
│   ├── gallery/            # Gallery + artwork detail
│   ├── commissions/        # Commission request
│   ├── about/              # About Ella
│   ├── contact/            # Contact form
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── components/
│   ├── layout/             # Navbar, Footer, etc.
│   ├── artwork/            # Gallery components
│   ├── forms/              # Contact & commission forms
│   ├── admin/              # Admin components
│   └── ui/                 # Shared UI components
└── lib/
    ├── artworks/           # Data layer + sample data
    ├── supabase/           # Supabase clients
    └── email.ts            # Resend email helper
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
# EllaWrightArt2.0

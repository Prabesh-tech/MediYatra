# MediYatra Website

The MediYatra website is the Next.js frontend in the Medibridge monorepo. It
helps patients and families learn about medical-travel coordination from Nepal
to India, request assistance, and explore nursing care at home.

The website provides coordination information and request flows. Medical
diagnosis, treatment plans, and clinical decisions are made by qualified
healthcare professionals and hospitals, not by MediYatra.

## Technology

- Next.js 14 with the App Router and React 18
- TypeScript and Tailwind CSS
- `next-intl` locale routing (English, `en`, is currently supported)
- Shared TypeScript and Zod contracts from `packages/shared`
- Same-origin API routes that proxy requests to the NestJS API
- A production service worker and web app manifest

## Requirements

- Node.js 20 or newer
- pnpm 9
- PostgreSQL and Redis for API-backed features
- Docker Compose, if using the local PostgreSQL and Redis services in the
  repository's `docker-compose.yml`

## Run locally

Run these commands from the monorepo root:

```powershell
pnpm install
Copy-Item .env.example .env
```

Edit `.env` with local configuration. Use unique JWT secrets of at least 32
characters and generate a 32-byte hexadecimal `PII_ENCRYPTION_KEY` for local
development. Do not commit `.env` or use example credentials in production.

Start PostgreSQL and Redis if they are not already running:

```powershell
docker compose up -d postgres redis
```

Prepare the database and shared package:

```powershell
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Start the development applications:

```powershell
pnpm dev
```

The website is normally available at <http://localhost:3000>. If that port is
already occupied, Next.js selects another port and prints its URL in the
terminal. The API listens on port 4000 by default. Its health endpoint is
`/api/v1/health`.

The root `.env.example` is the source for environment variable names and sample
values. The website's server-side API proxy uses `API_INTERNAL_URL`, which
defaults to `http://localhost:4000/api/v1`. Set `NEXT_PUBLIC_SITE_URL` to the
canonical site origin when configuring absolute metadata URLs for deployment.
API-backed requests require the API and its configured database and Redis
services.

## Available scripts

Run commands from the monorepo root unless noted:

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Build the shared package and start the monorepo apps in development mode |
| `pnpm build` | Build the monorepo apps |
| `pnpm lint` | Run the workspace lint tasks |
| `pnpm typecheck` | Run the workspace type-check tasks |

Website-only commands can be run with a workspace filter:

| Command | Purpose |
| --- | --- |
| `pnpm --filter @medibridge/web dev` | Start the Next.js development server |
| `pnpm --filter @medibridge/web build` | Build the website for production |
| `pnpm --filter @medibridge/web start` | Serve a production build |
| `pnpm --filter @medibridge/web typecheck` | Type-check the website |

## Website routes

Public pages use the `/en` locale prefix.

| Route | Page |
| --- | --- |
| `/en` | Homepage |
| `/en/about` | About MediYatra |
| `/en/medical-tourism` | Medical tourism and patient coordination |
| `/en/nursing-care` | Nursing care at home |
| `/en/clinic` | Clinic coordination |
| `/en/consultation` | Consultation information |
| `/en/travel-assistance` | Travel assistance |
| `/en/treatments` and `/en/treatments/[slug]` | Treatment directory and details |
| `/en/hospitals` and `/en/hospitals/[slug]` | Hospital directory and details |
| `/en/doctors` and `/en/doctors/[slug]` | Doctor directory and details |
| `/en/destinations` and `/en/destinations/[slug]` | Destination directory and details |
| `/en/packages` | Packages |
| `/en/team` | Team |
| `/en/success-stories` | Success stories |
| `/en/blog` and `/en/blog/[slug]` | Blog and article pages |
| `/en/faq` | Frequently asked questions |
| `/en/contact` | Contact form |
| `/en/quote` | Request a quote |
| `/en/login` and `/en/register` | Patient account access |
| `/en/verify-email` | Email verification |
| `/en/request-password-reset` and `/en/reset-password` | Password recovery |
| `/en/dashboard` | Patient dashboard |
| `/en/admin` | Admin inquiry workspace |
| `/en/legal/[slug]` | Privacy, terms, cookies, medical disclaimer, and refund policy |
| `/en/offline` | Offline fallback |

Some catalog, provider, legal, pricing, and contact information may remain
placeholder content until verified. Confirm all claims and details before
publishing.

## API and user flows

The catch-all route at `/api/[...path]` forwards supported API requests to the
NestJS service configured by `API_INTERNAL_URL`. It forwards relevant request
headers and session cookies, disables upstream caching, and passes upstream
status and response content through to the browser.

Website flows include account registration and login, patient dashboard
requests, inquiries and quote requests, nursing appointment requests, contact
messages, reviews, and private report-upload steps. Availability depends on
the corresponding API features and services being configured. Email delivery
requires a Resend API key and a verified sender; SMS requires Twilio
credentials. See the monorepo root README for backend setup and integration
notes.

## Project layout

```text
apps/web/
  public/                 Static assets, icons, and service worker
  src/app/                App Router pages, layouts, and API routes
  src/components/         Shared page and layout components
  src/i18n/               Locale routing and message configuration
  src/styles/             Global styles
```

The shared package lives at `packages/shared`. It contains contracts used by
both the website and API. The root `README.md` documents the complete monorepo
and backend architecture.

## Brand, accessibility, and content

- Use the MediYatra identity and existing shared layout and component patterns.
- The site supports light and dark themes. Use the semantic color variables in
  `src/styles/globals.css` (`--ink`, `--muted`, `--paper`, `--surface`,
  `--line`, `--soft-blue`, `--soft-teal`, `--blue`, and `--teal-text`) for new
  UI instead of hard-coded light or dark colors. Use `--teal-text` for small
  text; reserve the brighter `--teal` for icons, borders, and other non-text
  accents. Check text, controls, and cards in both themes.
- Keep layouts responsive and ensure controls are usable by keyboard and assistive
  technologies.
- The mobile navigation is a focus-trapped dialog with an in-drawer close
  control; Escape and closing the drawer return focus to its menu trigger.
- Keep focus indicators strongly contrasted in both themes, including over
  colored mobile call and WhatsApp actions.
- Shared motion helpers live in `src/lib/motion.ts`. Use `Reveal` or
  `StaggerGrid` for once-only section/card entrances, and `ImageReveal` for
  image frames. Keep easing gentle and durations between 0.4 and 0.8 seconds.
- The specialty marquee pauses on hover/focus and becomes static when reduced
  motion is requested. FAQ rows use keyboard-operable buttons and animated
  disclosure panels; route changes use a short fade and a thin progress line.
- Respect reduced-motion preferences for all animated content, including
  counters, marquees, page transitions, carousels, and decorative shapes. Do not
  add unsupported numeric claims just to create counter effects; animate only
  verified values already present in app data.
- Use only licensed or user-provided images from `public/images`; verify usage
  rights before publishing. Render image assets with `next/image`, write
  descriptive alt text for meaningful images, and use empty alt text for
  decorative backgrounds. Do not hotlink images from other websites.
- Describe MediYatra as a coordination and support service. Do not imply it
  provides diagnosis or treatment, or guarantee clinical outcomes.
- Keep clinical-responsibility notices clear wherever treatment areas are
  discussed.
- Verify phone numbers, email addresses, partner relationships, service
  availability, and legal text before launch. Legal pages are drafts and need
  qualified review.

## Production checklist

1. Configure the production database, Redis, and required API environment
   variables.
2. Set unique production JWT secrets and a securely managed PII encryption key.
   Back up the encryption key separately from the database.
3. Configure `API_INTERNAL_URL` to the production API and set
   `NEXT_PUBLIC_SITE_URL` to the canonical website URL.
4. Configure and test email, SMS, and storage integrations that the published
   flows depend on.
5. Replace or verify placeholder provider listings, pricing, contact details,
   service claims, and legal copy.
6. Build and type-check the workspace with `pnpm build` and `pnpm typecheck`.

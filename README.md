# Autoone website

Company website for Autoone: AI automation and smart systems. React + TypeScript + Tailwind CSS + Framer Motion, English and Arabic (RTL).
Hosted on **Cloudflare Pages**; the forms send email through **Cloudflare Pages Functions** (`/functions`) and the Resend API.

## Run it locally

```bash
npm install
npm run dev                                   # front end only, http://localhost:5173 (forms show "not connected")
npm run build && npx wrangler pages dev dist  # front end + /api functions (needs .dev.vars, see .dev.vars.example)
```

## Deploy on Cloudflare Pages (autoone.ps)

1. Cloudflare dashboard > **Workers & Pages** > **Create** > **Pages** > **Connect to Git** > choose this repository.
2. Build settings: Framework preset **Vite** (or none), Build command `npm run build`, Build output directory `dist`. Node 20 is picked up from `.node-version`.
3. **Settings > Variables and Secrets** (Production, and Preview if you use it):

   | Name | Type | Value |
   | --- | --- | --- |
   | `RESEND_API_KEY` | Secret | API key from resend.com |
   | `MAIL_FROM` | Text | `Autoone <no-reply@autoone.ps>` (the domain must be verified in Resend) |
   | `CONTACT_TO_EMAIL` | Text | `autoone.ps@gmail.com` |
   | `SUPPORT_TO_EMAIL` | Text (optional) | support inbox; falls back to `CONTACT_TO_EMAIL` |
   | `ALLOWED_ORIGIN` | Text (optional) | `https://autoone.ps` |

   Then redeploy once so the variables are picked up.
4. **Custom domains** > *Set up a custom domain* > `autoone.ps` (and `www.autoone.ps`). If the domain's DNS is already on Cloudflare this is automatic; otherwise move the domain's nameservers to Cloudflare first (the `.ps` registrar panel).
5. Resend: add `autoone.ps` under Domains and create the DNS records it shows (SPF, DKIM) in Cloudflare DNS, wait for "Verified".
6. Test: submit both forms on the live site and check the inbox.

Until `RESEND_API_KEY` and `MAIL_FROM` exist the API answers `503 not_configured` and the site shows an honest "not connected yet, email us at ..." message. It never pretends a message was sent.

What the functions do: validate every field again on the server, escape all text in the HTML email, set `Reply-To` to the visitor, drop bot submissions (hidden honeypot field),
rate-limit to 5 requests / 10 min per IP (best effort; add a Cloudflare rate-limiting rule for strict limits), accept one support attachment up to 3 MB (png, jpg, webp, gif, pdf, txt, log, csv).
To use another provider (SendGrid, Postmark, SMTP relay) only `sendMail()` in `functions/_lib/mail.ts` changes.

## Where to edit things

| Change | File |
| --- | --- |
| Email, WhatsApp, phone, Instagram, LinkedIn | `src/data/site.ts` (empty values show "Coming soon" instead of a dead link) |
| Team members | `src/data/team.ts` (placeholders for now; do not publish invented staff) |
| Services, icons, mascot pose | `src/data/services.ts` |
| English text / Arabic text | `src/i18n/en.ts` / `src/i18n/ar.ts` (Arabic is type-checked against English) |
| Colors and fonts | `tailwind.config.js` |

## The mascot

Images in `src/assets/mascot/` come from the supplied character renders. Each pose also has `-m` and `-s` smaller copies for faster loading and the site
picks the right size for the screen. `src/data/mascot-meta.json` stores the eye positions used for the blink. High-resolution poses currently in use: wave, point, think, celebrate.
The first pose (`main`) and the small faces (`f-*`) are older, lower-resolution cuts; replace them with the same file names when better renders are available.

## Notes

- `npm run build:preview` makes one self-contained HTML file in `dist-preview/` for quick sharing. Forms cannot reach `/api` there.
- Social links and phone are intentionally empty until the official details exist.

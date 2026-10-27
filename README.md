# cuckyouleet: prelaunch page

Practice the coding rounds LeetCode doesn't cover. This branch holds the early-access landing page.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Without the env vars below, sign-ups are logged to the terminal in dev and rejected in production.

## Waitlist → Google Sheets

Set these in Vercel (Production and Preview), or in `.env.local` for local work:

| Variable | Value |
| --- | --- |
| `WAITLIST_SHEET_URL` | Apps Script web app URL (ends in `/exec`) |
| `WAITLIST_SHEET_SECRET` | Shared secret, same as the script's `WAITLIST_SECRET` property |

Setup takes about 5 minutes: see [integrations/google-sheets/README.md](integrations/google-sheets/README.md).

## Layout

- `app/page.tsx`: the landing page
- `app/components/`: hero effects, session demo, bug hunt, waitlist form
- `app/api/waitlist/route.ts`: validates, rate-limits and forwards sign-ups
- `app/privacy/page.tsx`: privacy notice (contact email lives in `app/lib/site.ts`)
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/`: product and design-system notes used by the Impeccable design skill

# Waitlist → Google Sheets

The sign-up form posts to `/api/waitlist`. That route forwards each entry to a small Google Apps Script attached to your sheet, and the script appends a row (time, email, note, source). Duplicate emails are skipped.

## Setup (about 5 minutes)

1. Create a sheet at <https://sheets.new> and name it, e.g. "cuckyouleet waitlist".
2. In the sheet: **Extensions → Apps Script**. Replace the editor contents with [`waitlist.gs`](./waitlist.gs) and save.
3. In Apps Script: **Project Settings → Script Properties → Add property**
   - Property: `WAITLIST_SECRET`
   - Value: a long random string (e.g. run `openssl rand -hex 32`).
4. **Deploy → New deployment → type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy, approve the permissions, and copy the **Web app URL** (ends in `/exec`).
5. In Vercel: **Project → Settings → Environment Variables**, add for Production and Preview:
   - `WAITLIST_SHEET_URL` = the Web app URL
   - `WAITLIST_SHEET_SECRET` = the same secret as step 3
6. Redeploy. Submit a test email on the site and check that a row appears in the `Waitlist` tab.

"Anyone" access is needed because Vercel calls the script without a Google login. The secret is what keeps others from writing to the sheet. Never commit it.

If you change `waitlist.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Local development

Copy `.env.example` to `.env.local` and fill in both values. Without them, `npm run dev` logs entries to the terminal instead of saving them, and production returns an error rather than pretending to save.

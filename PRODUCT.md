# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript), deployed on Vercel. Chosen by the founder so the prelaunch page can grow into the real app. Waitlist: `/api/waitlist` → Google Apps Script → Google Sheet.

## Users

College students and early-career software engineers preparing for SWE interviews, India-first. They are in prep season, practicing on a laptop, and dread a newer interview format: being handed an unfamiliar multi-file repo with failing tests and asked to debug it, often with an AI assistant allowed.

## Product Purpose

cuckyouleet lets people practice the coding rounds LeetCode doesn't cover. You open a small broken repo, debug it with an AI helper beside you (run tests, ask questions, edit code), then read a report on *how* you worked, not just whether the tests passed. Success for the prelaunch page: early-access signups.

## Positioning

The practice is the real interview format (repos, not puzzles), AI use is part of the exercise rather than cheating, and scoring is on process: what you did, how you used the AI, and whether you checked what it told you.

## Operating Context

- Interview formats are shifting toward repo debugging and AI-allowed rounds.
- The workspace runs on a laptop; a visitor on a phone gets the link emailed for later.
- Rounds are timed (the demo shows a countdown).

## Capabilities and Constraints

- Prelaunch: no product is live; the only action is joining the early-access list (email + optional note), saved to a Google Sheet through an Apps Script web app.
- Free at early access. No pricing is decided; do not show any.
- Workflow: open a broken repo → debug with the AI helper → read your report.
- Undecided: launch date, number of challenges, supported languages.

## Brand Commitments

- Name: **cuckyouleet**, always lowercase. It's a jab at grinding LeetCode puzzles.
- Voice: plain, direct, a little irreverent toward DSA grinding; short sentences. Founder's draft copy is the source of truth for claims.
- Visual references from the founder: a green arcade cabinet with a glowing CRT and pixel type (reference-arcade.jpeg) for palette and type, and gitbybit.com for structure and tone ("dynamic, not too gamified; appeals to early devs and professionals").

## Evidence on Hand

- Founder's draft landing copy, including an interactive "tap the line with the bug" demo (`last_n` off-by-one in `repo/utils.py`).
- No users, testimonials, company partnerships, logos, signup counts, or benchmarks exist. Do not invent any.

## Product Principles

1. Real repos over puzzles: every example is multi-file, job-shaped code.
2. AI is a tool to use and to check; the product never treats it as cheating or as an oracle.
3. Show the process, not just the verdict.
4. Honest prelaunch: no fake numbers, no implied traction.

## Accessibility & Inclusion

WCAG 2.2 AA. The demo must work by keyboard and screen reader, and arcade effects (flicker, scanlines, glow motion) must respect `prefers-reduced-motion`.

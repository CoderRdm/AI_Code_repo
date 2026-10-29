# Repo-Debugging Practice Platform: Project Overview

Draft for co-founder review · 29 October 2026

## 1. The idea

Many online assessments now give candidates a small code repository with failing tests and ask them to find and fix the bugs, sometimes with an AI assistant on hand. Students rarely get to practise this format before the real assessment.

We are building a browser-based practice platform in the style of HackerRank’s assessments. A student sits a timed mock test made of repo-debugging questions, reads the failing tests, fixes the code, and gets a report on how they did. We start with our own college and widen from there.

## 2. Why now

- **The format is real.** HackerRank added code repository questions to its tests in October 2025 and has since added AI assistants, both guarded and unguarded, to them (HackerRank release notes).
- **It is spreading.** Interview-prep sources describe the “debugging round” moving from Stripe to companies such as Amazon, Retool, Meta and Google. We have not verified this directly.
- **Students are underserved.** Employer tools are built for hiring teams. Small practice products exist but are early: one we reviewed has nine challenges and another around 145 labs. Our review of them has not been independently verified.

## 3. What the product is

| Mode | What the student does |
| --- | --- |
| Practice | Opens one repo problem, untimed. Reads the visible tests, runs them, studies the errors and fixes the code. |
| Mock test | Sits 2 to 3 questions under one timer, with an instructions page, question tabs, auto-submit and a final report. |

How a problem works:

- **Visible tests teach.** Students can read them (read-only) and see the exact error, with expected versus actual values.
- **Hidden tests check.** They are released from the server only at submit, so answers cannot simply be hard-coded.
- **AI helper.** Optional, either guided (it asks questions) or free. It uses the student’s own API key, so our AI cost is zero.
- **Report.** Score per question, the errors met, and how the student worked: time to the first test run, number of runs, and how they used the AI.

Deliberately left out of version 1: leaderboards, live contests, college rankings and a server-side grader. Nothing is ranked yet, so none are needed.

## 4. The student’s journey

A mock test page is public and shareable. Pressing Start asks for Google sign-in. First-time users add college, branch and graduation year, which is cheap to collect now and useful for college pilots later.

&#91;embedded content: mock test flow · 6 steps\]

The timer runs from a start time saved on the server, so refreshing the page does not reset it. Code autosaves every 10 to 15 seconds, and reopening the test resumes where the student left off.

## 5. How it is built

Running code is the expensive part of most assessment platforms. We avoid that cost by running student code in the student’s own browser, and use the server only for records and for anything that must not be tampered with.

&#91;embedded content: backend architecture · browser, Supabase, AI provider\]

| Part | Role |
| --- | --- |
| Browser app | Next.js, the Monaco editor, and Python through Pyodide in a Web Worker. Runs code and visible tests on the student’s device, with a timeout that stops infinite loops. |
| Static hosting | Serves the app and each problem’s public files. Planned on Cloudflare Pages: the current Vercel free plan is non-commercial, so we move before charging anyone. |
| Auth | Supabase Google sign-in, which gives each student a secure token. |
| Edge Functions | Start test, submit, save result. The only route to the hidden tests. |
| Postgres | Profiles, attempts, events and reports. Row-level security lets a student read and write only their own rows. |
| AI provider | Called straight from the browser with the student’s key, kept in memory and never stored by us. |

Each problem is a folder in a Git repository holding starter files, visible tests, hidden tests and metadata. A publish script sends the public files to static hosting and the hidden tests to a private table.

## 6. What makes it different

- **Built for students.** Free or cheap practice and retakes, not employer licences.
- **Near-zero running cost.** Code runs on the student’s device, so one small backend serves many users.
- **Learning first.** Readable tests, a clear error panel, a guided AI helper, and a report on process as well as score.
- **College first.** We begin with our own college and collect college and branch for later pilots with placement cells.

Honest limits: browser execution suits logic-heavy repos rather than full-stack ones with databases; scores are for practice, not verified; and content (realistic repos with bugs that fail the tests) is the main work.

## 7. Cost and capacity

- **Free tiers cover the pilot.** Supabase’s free plan, as listed in July 2026, includes a 500 MB database, 50,000 monthly active users and 500,000 function calls a month, but pauses a project after a week of inactivity. Limits change, so recheck before launch.
- **100 students at once** is roughly 10 database writes a second by our estimate, which is light. We will load test before the pilot.
- **Optional insurance:** Supabase Pro at about $25 a month (around ₹2,400) for the pilot month.
- **Domain:** about ₹200 to ₹800 in the first year depending on the extension, higher at renewal.

## 8. Roadmap and open decisions

| Step | What | Rough timing |
| --- | --- | --- |
| 1 | Workspace: editor, test panel, Python runner | Weeks 1 to 2 |
| 2 | First 6 to 8 problems and the publish script | Weeks 1 to 6, in parallel |
| 3 | Google login, profiles, practice mode, autosave | Weeks 3 to 5 |
| 4 | Mock test mode: instructions, timer, question tabs, submit, report | Weeks 5 to 7 |
| 5 | AI helper, event log, process report | Weeks 6 to 8 |
| 6 | College pilot with about 100 students, then widen | After testing |

Timings are rough and depend on available hours.

Decisions still open:

1. **First language.** Python runs fully in the browser. Java and C++ need a server-side sandbox, and we have not verified cheap options for them.
2. **Product name.** The current working name is under review.
3. **API-key onboarding** for students who do not yet have a key.
4. **Mock test sets.** Fixed questions for everyone, or a random pick from a pool.

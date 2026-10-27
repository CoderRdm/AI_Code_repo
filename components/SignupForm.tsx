"use client";
import { useState, FormEvent } from "react";

// Set NEXT_PUBLIC_WAITLIST_URL (see .env.example) to a form endpoint that accepts JSON.
// Without it, the form only shows the thank-you message and stores nothing.
export default function SignupForm() {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMsg({ text: "Enter a valid email address.", ok: false });
      return;
    }
    const url = process.env.NEXT_PUBLIC_WAITLIST_URL;
    setBusy(true);
    try {
      if (url) {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            email,
            college: String(data.get("college") || ""),
            companies: String(data.get("companies") || ""),
            source: new URLSearchParams(window.location.search).get("utm_source") || "direct",
          }),
        });
        if (!res.ok) throw new Error("Request failed");
      }
      setMsg({ text: "You’re on the list. We’ll email you when early access opens.", ok: true });
      form.reset();
    } catch {
      setMsg({ text: "Something went wrong. Please try again.", ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <input name="email" type="email" placeholder="Your email" autoComplete="email" inputMode="email" aria-label="Email" />
        <details>
          <summary>Tell us more (optional)</summary>
          <input name="college" placeholder="College and year" aria-label="College and year" />
          <input name="companies" placeholder="Companies you’re preparing for" aria-label="Companies you’re preparing for" />
        </details>
        <button className="btn" type="submit" disabled={busy}>Join the early-access list</button>
      </form>
      <p className={"msg " + (msg ? (msg.ok ? "ok" : "err") : "")} role="status" aria-live="polite">{msg?.text}</p>
      <p className="note">Free. We’ll email you when it opens. The workspace runs on a laptop, so we’ll send the link there.</p>
    </>
  );
}

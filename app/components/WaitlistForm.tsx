"use client";

import { useId, useState, type FormEvent } from "react";
import { isEmail, joinWaitlist } from "../lib/waitlist";

type State = "idle" | "error" | "failed" | "sending" | "joined";

export default function WaitlistForm({
  withNote = false,
  source = "hero",
}: {
  withNote?: boolean;
  source?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEmail(email)) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      await joinWaitlist({ email: email.trim(), note: note.trim() || undefined, source, company });
      setState("joined");
    } catch {
      setState("failed");
    }
  }

  if (state === "joined") {
    return (
      <div className="waitlist-done" role="status">
        <p className="waitlist-done-title">You&rsquo;re on the list.</p>
        <p>
          We&rsquo;ll email <strong>{email.trim()}</strong> when it opens. The workspace runs on a
          laptop, so open the link there.
        </p>
      </div>
    );
  }

  const message =
    state === "error"
      ? "That doesn’t look like an email. Check it and try again."
      : state === "failed"
        ? "Couldn’t save that just now. Try again in a minute."
        : "Free. We’ll email you when it opens.";

  return (
    <form className="waitlist" onSubmit={onSubmit} noValidate>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          id={`${id}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <label htmlFor={`${id}-email`} className="sr-only">
        Your email
      </label>
      <div className="waitlist-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error" || state === "failed") setState("idle");
          }}
          aria-invalid={state === "error"}
          aria-describedby={`${id}-msg`}
          readOnly={state === "sending"}
        />
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Joining…" : "Join the early-access list"}
        </button>
      </div>
      <p
        id={`${id}-msg`}
        className={`waitlist-msg${state === "error" || state === "failed" ? " is-error" : ""}`}
      >
        {message}
      </p>
      <p className="waitlist-legal">
        We&rsquo;ll only use your email to tell you about cuckyouleet.{" "}
        <a href="/privacy">Privacy notice</a>
      </p>

      {withNote &&
        (noteOpen ? (
          <div className="waitlist-note">
            <label htmlFor={`${id}-note`}>Tell us more (optional)</label>
            <textarea
              id={`${id}-note`}
              name="note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Which round are you preparing for?"
            />
          </div>
        ) : (
          <button type="button" className="text-btn" onClick={() => setNoteOpen(true)}>
            Tell us more (optional)
          </button>
        ))}
    </form>
  );
}

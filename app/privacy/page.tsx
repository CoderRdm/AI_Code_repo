import type { Metadata } from "next";
import BugMark from "../components/BugMark";
import { CONTACT_EMAIL } from "../lib/site";

export const metadata: Metadata = {
  title: "Privacy notice · cuckyouleet",
  description: "What cuckyouleet collects on its early-access list, why, and how to have it deleted.",
};

export default function Privacy() {
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

  return (
    <>
      <header className="nav">
        <a className="brand" href="/" aria-label="cuckyouleet home">
          <BugMark />
          <span className="wordmark">cuckyouleet</span>
        </a>
        <a className="btn btn-small" href="/#join">
          Get early access
        </a>
      </header>

      <main className="legal">
        <h1>Privacy notice</h1>
        <p className="legal-date">Last updated 27 October 2026</p>

        <p>
          cuckyouleet is not open yet. The only personal data this site collects is what you type
          into the early-access form. This notice explains what that is, why we keep it, and how to
          get it removed.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Your email address.</li>
          <li>Anything you write in the optional &ldquo;Tell us more&rdquo; box.</li>
          <li>When you signed up, and which form you used.</li>
        </ul>
        <p>
          The site sets no cookies and runs no analytics or advertising trackers. Fonts are served
          from this site, not from a third party. Our host keeps standard server logs (such as IP
          address and browser type) for security and to keep the site running.
        </p>

        <h2>Why we collect it</h2>
        <p>
          To email you when early access opens and to send occasional updates about the launch. If
          you write a note, we read it to decide what to build first. We rely on your consent, which
          you give by submitting the form. You can withdraw it at any time.
        </p>

        <h2>Who handles it</h2>
        <p>
          Sign-ups are stored in a private Google Sheet (Google) and the site runs on Vercel. They
          process the data for us only to provide those services. We don&rsquo;t sell your data or
          share it with anyone else.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Until 12 months after launch, or until you ask us to delete it, whichever comes first.
          Every email we send includes a way to unsubscribe.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete your data, or withdraw consent, by emailing {mail}.
          We&rsquo;ll reply within 30 days. If you&rsquo;re unhappy with our answer, you can complain
          to your data protection authority: in India, the Data Protection Board of India.
        </p>

        <h2>Age</h2>
        <p>The early-access list is for people aged 18 and over. Please don&rsquo;t sign up if you&rsquo;re younger.</p>

        <h2>Changes</h2>
        <p>
          If this notice changes, we&rsquo;ll update the date above. If the change matters, we&rsquo;ll
          tell people on the list by email.
        </p>

        <p>
          <a href="/">Back to cuckyouleet</a>
        </p>
      </main>
    </>
  );
}

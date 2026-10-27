export function HowItWorks() {
  return (
    <section className="w">
      <h2>How it works</h2>
      <ol>
        <li><b>1</b><strong>Open a broken repo.</strong><span>A small project with failing tests.</span></li>
        <li><b>2</b><strong>Debug with an AI helper.</strong><span>Run tests, ask questions, edit the code.</span></li>
        <li><b>3</b><strong>Read your report.</strong><span>See how you debugged and how you used the AI.</span></li>
      </ol>
    </section>
  );
}

export function Differences() {
  return (
    <section className="w">
      <h2>What’s different</h2>
      <p className="pt"><strong>Real repos, not puzzles.</strong><br /><span>You work across several files, as you would on the job.</span></p>
      <p className="pt"><strong>AI allowed.</strong><br /><span>Practice the rounds where you’re expected to use it, and learn to check what it tells you.</span></p>
      <p className="pt"><strong>Scored on process.</strong><br /><span>We show what you did, not only pass or fail.</span></p>
    </section>
  );
}

const FAQ = [
  ["Is it free?", "Early access is free."],
  ["Do I need to install anything?", "No. It runs in your browser, on a laptop or desktop."],
  ["Do I need an AI key?", "Yes, you’ll bring your own. We’ll show you how to get one, and many providers have free plans."],
  ["Is this connected to any company?", "No. We’re independent and not affiliated with any company whose interview format inspires a practice round."],
];

export function Faq() {
  return (
    <section className="w faq">
      <h2>Questions</h2>
      {FAQ.map(([q, a]) => (
        <details key={q}><summary>{q}</summary><p>{a}</p></details>
      ))}
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="cta">
      <div className="w">
        <h2>Be first in when it opens.</h2>
        <a href="#join" className="btn">Get early access</a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="w">
        Early access. Independent, and not affiliated with any company.<br />
        Contact: hello@yourdomain.dev
      </div>
    </footer>
  );
}

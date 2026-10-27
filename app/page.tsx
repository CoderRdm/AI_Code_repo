import BugHunt from "./components/BugHunt";
import BugMark from "./components/BugMark";
import HeroFX from "./components/HeroFX";
import HeroTitle from "./components/HeroTitle";
import SessionDemo from "./components/SessionDemo";
import WaitlistForm from "./components/WaitlistForm";

const TAGS = ["Real repos", "Failing tests", "AI helper", "Process report"];

const STEPS = [
  ["Open a broken repo.", "A small project with failing tests."],
  ["Debug with an AI helper.", "Run tests, ask questions, edit the code."],
  ["Read your report.", "See how you debugged and how you used the AI."],
];

const COMPARE = [
  ["What you work on", "One function, one input", "A small repo with failing tests, across several files"],
  ["AI", "Usually off-limits", "Allowed. You learn to check what it tells you"],
  ["What gets scored", "Pass or fail", "How you worked: what you ran, read, asked and changed"],
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <a className="brand" href="#top" aria-label="cuckyouleet home">
          <BugMark />
          <span className="wordmark">cuckyouleet</span>
        </a>
        <nav aria-label="Sections">
          <a href="#how">How it works</a>
          <a href="#try">Try one</a>
          <a href="#different">What&rsquo;s different</a>
        </nav>
        <a className="btn btn-small" href="#join">
          Get early access
        </a>
      </header>

      <main id="top">
        <section className="hero-stage" aria-labelledby="hero-title">
          <HeroFX />
          <div className="hero">
            <HeroTitle />
            <p className="lede">
              Fix real bugs in a real repo, with an AI helper beside you. Then get a report on how
              you worked, not just whether the tests passed.
            </p>
            <WaitlistForm />
            <ul className="tags" aria-label="What a round includes">
              {TAGS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="demo" aria-label="A sample debugging session">
          <p className="sr-only">
            A sample session: the test for a shopping cart fails with an IndexError. The player
            follows the traceback from the test to cart.py to utils.py, asks the AI helper where to
            look, checks its answer in the code, removes the off-by-one in the range on line 3, and
            reruns the tests, which pass. A report then shows the time, test runs, files read and AI
            questions.
          </p>
          <SessionDemo />
        </section>

        <section className="how" id="how" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="steps">
            {STEPS.map(([title, body], i) => (
              <li key={title}>
                <span className="step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="try" id="try" aria-labelledby="try-title">
          <div className="try-copy">
            <h2 id="try-title">Try one.</h2>
            <p>
              Five lines, one bug, a failing test. Your time, wrong guesses and AI hints go into the
              report. Real repos hide bugs like this across several files.
            </p>
          </div>
          <BugHunt />
        </section>

        <section className="different" id="different" aria-labelledby="different-title">
          <h2 id="different-title">What&rsquo;s different</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <td />
                  <th scope="col">Puzzle practice</th>
                  <th scope="col">cuckyouleet</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([row, them, us]) => (
                  <tr key={row}>
                    <th scope="row">{row}</th>
                    <td>{them}</td>
                    <td>{us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="join" id="join" aria-labelledby="join-title">
          <h2 id="join-title">Get in before it opens.</h2>
          <p>
            Early access is free. The workspace runs on a laptop, so we&rsquo;ll send the link
            there.
          </p>
          <WaitlistForm withNote source="footer" />
        </section>
      </main>

      <footer className="footer">
        <p className="footer-brand">
          <BugMark size={22} />
          cuckyouleet
        </p>
        <p>
          &copy; 2026 cuckyouleet. Not affiliated with LeetCode.{" "}
          <a href="/privacy">Privacy</a>
        </p>
      </footer>
    </>
  );
}

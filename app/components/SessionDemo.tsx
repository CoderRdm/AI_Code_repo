"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type FileName = "tests/test_cart.py" | "cart.py" | "utils.py";

const FILES: Record<FileName, string[]> = {
  "tests/test_cart.py": [
    "from cart import Cart",
    "",
    "def test_recent_items():",
    '    cart = Cart(["mug", "pen", "cap"])',
    '    assert cart.recent(2) == ["pen", "cap"]',
  ],
  "cart.py": [
    "from utils import last_n",
    "",
    "class Cart:",
    "    def __init__(self, items):",
    "        self.items = items",
    "",
    "    def recent(self, k):",
    "        return last_n(self.items, k)",
  ],
  "utils.py": [
    "def last_n(items, n):",
    "    result = []",
    "    for i in range(len(items) - n, len(items) + 1):",
    "        result.append(items[i])",
    "    return result",
  ],
};

const TREE: FileName[] = ["cart.py", "utils.py", "tests/test_cart.py"];
const OPEN_ORDER: FileName[] = ["tests/test_cart.py", "cart.py", "utils.py"];

const STEPS = [
  { ms: 1500, caption: "Open a broken repo. A test is failing." },
  { ms: 2600, caption: "Run the tests and read the traceback." },
  { ms: 1900, caption: "Follow it across files." },
  { ms: 1500, caption: "Ask the AI helper." },
  { ms: 3000, caption: "Ask the AI helper." },
  { ms: 1900, caption: "Check its answer against the code." },
  { ms: 1700, caption: "Make the fix." },
  { ms: 2000, caption: "Run the tests again." },
  { ms: 7000, caption: "Read your report: how you worked, not just pass or fail." },
];

const CHAPTERS = [
  { label: "Run tests", step: 0 },
  { label: "Trace", step: 2 },
  { label: "Ask AI", step: 3 },
  { label: "Verify", step: 5 },
  { label: "Fix", step: 6 },
  { label: "Report", step: 8 },
];

const LAST = STEPS.length - 1;
const REMOVED = " + 1";

const KEYWORDS = /\b(def|return|for|in|from|import|class|assert|self)\b/;

function highlight(line: string): ReactNode[] {
  const parts = line.split(/("[^"]*"|\b(?:def|return|for|in|from|import|class|assert|self)\b|\b\d+\b)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith('"')) return <span key={i} className="tok-str">{p}</span>;
    if (/^\d+$/.test(p)) return <span key={i} className="tok-num">{p}</span>;
    if (KEYWORDS.test(p) && p.match(KEYWORDS)?.[0] === p) return <span key={i} className="tok-kw">{p}</span>;
    return p;
  });
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function fileFor(step: number): FileName {
  if (step <= 1) return "tests/test_cart.py";
  if (step <= 4) return "cart.py";
  return "utils.py";
}

export default function SessionDemo() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [clock, setClock] = useState(24 * 60 + 10);
  const started = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  // Start when the demo scrolls into view; reduced motion lands on the finished session instead.
  useEffect(() => {
    if (reducedMotion()) {
      setStep(LAST);
      setDeleted(REMOVED.length);
      return;
    }
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setStep((s) => (s === LAST ? 0 : s + 1));
    }, STEPS[step].ms);
    return () => window.clearTimeout(id);
  }, [playing, step]);

  useEffect(() => {
    if (step === 0) {
      setDeleted(0);
      setClock(24 * 60 + 10);
    }
    if (step < 6) setDeleted(0);
    if (step > 6) setDeleted(REMOVED.length);
    if (step !== 6 || !playing) return;
    const id = window.setInterval(() => {
      setDeleted((d) => (d >= REMOVED.length ? d : d + 1));
    }, 170);
    return () => window.clearInterval(id);
  }, [step, playing]);

  useEffect(() => {
    if (!playing || step === LAST) return;
    const id = window.setInterval(() => setClock((c) => c - 1), 1000);
    return () => window.clearInterval(id);
  }, [playing, step]);

  const file = fileFor(step);
  const opened = OPEN_ORDER.slice(0, step >= 5 ? 3 : step >= 2 ? 2 : 1);
  const passed = step >= 7;

  function lineState(n: number): string {
    if (file === "tests/test_cart.py" && n === 5 && step === 1) return " is-fail";
    if (file === "cart.py" && n === 8 && step >= 2) return " is-trace";
    if (file === "utils.py" && n === 3) return passed ? " is-pass" : " is-suspect";
    return "";
  }

  function renderLine(text: string, n: number) {
    if (file === "utils.py" && n === 3) {
      const keep = REMOVED.length - deleted;
      const head = "    for i in range(len(items) - n, len(items)";
      return (
        <>
          {highlight(head)}
          {keep > 0 && <span className="tok-removed">{REMOVED.slice(0, keep)}</span>}
          {step === 6 && <span className="caret" aria-hidden="true" />}
          {"):"}
        </>
      );
    }
    return highlight(text);
  }

  const mm = Math.floor(clock / 60);
  const ss = String(clock % 60).padStart(2, "0");

  return (
    <figure className="session" ref={root}>
      <div
        className="window"
        aria-hidden="true"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || reducedMotion()) return;
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          e.currentTarget.style.setProperty("--ry", `${(px * 4).toFixed(2)}deg`);
          e.currentTarget.style.setProperty("--rx", `${(-py * 3).toFixed(2)}deg`);
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty("--ry", "0deg");
          e.currentTarget.style.setProperty("--rx", "0deg");
        }}
      >
        <div className="titlebar">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
          <span className="titlebar-name">cart-shop</span>
          <span className="titlebar-timer">
            {mm}:{ss} left
          </span>
        </div>

        <div className="workspace">
          <nav className="tree">
            <p className="pane-label">Repo</p>
            <ul>
              {TREE.map((f) => (
                <li key={f} className={f === file ? "is-open" : ""}>
                  {f}
                </li>
              ))}
            </ul>
          </nav>

          <div className="editor">
            <div className="tabs">
              {opened.map((f) => (
                <span key={f} className={`tab${f === file ? " is-active" : ""}`}>
                  {f.split("/").pop()}
                </span>
              ))}
            </div>
            <ol key={file} className="code">
              {FILES[file].map((text, i) => (
                <li key={i} className={`code-line${lineState(i + 1)}`}>
                  <span className="gutter">{i + 1}</span>
                  <code>{renderLine(text, i + 1)}</code>
                </li>
              ))}
            </ol>

            <div className="terminal">
              <p className="pane-label">Terminal</p>
              <p>
                <span className="prompt-sign">$</span> pytest
              </p>
              {step >= 1 && !passed && (
                <div className="term-out">
                  <p>tests/test_cart.py:5: in test_recent_items</p>
                  <p className={step >= 2 ? "is-followed" : ""}>cart.py:8: in recent</p>
                  <p className={step >= 5 ? "is-followed" : ""}>utils.py:4: in last_n</p>
                  <p className="term-err">E   IndexError: list index out of range</p>
                  <p className="term-err">FAILED tests/test_cart.py::test_recent_items</p>
                </div>
              )}
              {passed && (
                <div className="term-out">
                  <p className="term-ok">1 passed in 0.03s</p>
                </div>
              )}
            </div>
          </div>

          <aside className="assistant">
            <p className="pane-label">AI helper</p>
            {step >= 3 && (
              <p className="msg msg-you">
                test_recent_items fails with IndexError. Where should I look?
              </p>
            )}
            {step === 3 && (
              <p className="msg msg-ai msg-typing">
                <i />
                <i />
                <i />
              </p>
            )}
            {step >= 4 && (
              <p className="msg msg-ai">
                The traceback ends in <b>utils.py</b> line 4. The index comes from the range on
                line 3, which stops at <b>len(items) + 1</b>. Check it yourself: with 3 items, does
                the loop reach i = 3?
              </p>
            )}
            {step >= 5 && <p className="msg msg-note">You opened utils.py to check.</p>}
          </aside>
        </div>

        <div className={`report${step === LAST ? " is-in" : ""}`}>
          <p className="report-head">
            Session report <span>Sample</span>
          </p>
          <dl>
            <div>
              <dt>Solved in</dt>
              <dd>6:42</dd>
            </div>
            <div>
              <dt>Test runs</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>Files read</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>AI questions</dt>
              <dd>1</dd>
            </div>
          </dl>
          <p className="report-line">
            Followed the traceback from the test to <b>utils.py</b>. Checked the AI&rsquo;s claim
            in the code before editing.
          </p>
        </div>
      </div>

      <figcaption className="session-bar">
        <button
          type="button"
          className="play"
          onClick={() => {
            started.current = true;
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause the demo" : "Play the demo"}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <rect x="3" y="2" width="3.5" height="12" rx="1" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5Z" />
            </svg>
          )}
        </button>
        <ol className="chapters">
          {CHAPTERS.map((c, i) => {
            const next = CHAPTERS[i + 1]?.step ?? STEPS.length;
            const active = step >= c.step && step < next;
            return (
              <li key={c.label}>
                <button
                  type="button"
                  className={`chapter${active ? " is-active" : ""}${step >= next ? " is-done" : ""}`}
                  aria-current={active ? "step" : undefined}
                  onClick={() => setStep(c.step)}
                >
                  {c.label}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="caption">
          {STEPS[step].caption}
        </p>
      </figcaption>
    </figure>
  );
}

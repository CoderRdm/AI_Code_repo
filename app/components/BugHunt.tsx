"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const BUG_LINE = 3;

const LINES = [
  "def last_n(items, n):",
  "    result = []",
  "    for i in range(len(items) - n, len(items) + 1):",
  "        result.append(items[i])",
  "    return result",
];

const MISS_HINTS: Record<number, string> = {
  1: "Line 1 is just the signature. Keep reading.",
  2: "Line 2 sets up the result. Not it.",
  4: "Line 4 is where it crashes, not why. Which index reaches it?",
  5: "Line 5 never runs. The loop crashes first.",
};

const AI_HINT =
  "Look at where the range on line 3 stops. Don’t take my word for it: what’s the last valid index of a 3-item list?";

const FOUND =
  "range() stops at len(items) + 1, so the last pass reads items[len(items)], one past the end. Stop at len(items).";

type Log = { kind: "fail" | "miss" | "ai" | "pass"; text: string };

const TAGS: Record<Log["kind"], string> = { fail: "Fail", miss: "Miss", ai: "AI", pass: "Pass" };
const START: Log[] = [{ kind: "fail", text: "test_last_n: IndexError" }];

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function BugHunt() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [solvedIn, setSolvedIn] = useState<number | null>(null);
  const [misses, setMisses] = useState<number[]>([]);
  const [aiHints, setAiHints] = useState(0);
  const [log, setLog] = useState<Log[]>(START);
  const [elapsed, setElapsed] = useState(0);
  const lineRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const screen = useRef<HTMLDivElement>(null);

  const solved = solvedIn !== null;

  useEffect(() => {
    if (startedAt === null || solved) return;
    const id = window.setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [startedAt, solved]);

  function begin() {
    const t0 = startedAt ?? Date.now();
    if (startedAt === null) setStartedAt(t0);
    return t0;
  }

  function pick(line: number) {
    if (solved) return;
    const t0 = begin();
    if (line === BUG_LINE) {
      setSolvedIn(Math.max(1, Math.round((Date.now() - t0) / 1000)));
      setLog((l) => [...l, { kind: "pass", text: FOUND }]);
      return;
    }
    setMisses((m) => (m.includes(line) ? m : [...m, line]));
    setLog((l) => [...l, { kind: "miss", text: MISS_HINTS[line] }]);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      screen.current?.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(-2px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    }
  }

  function askAI() {
    if (solved) return;
    begin();
    setAiHints((n) => n + 1);
    setLog((l) => [...l, { kind: "ai", text: AI_HINT }]);
  }

  function reset() {
    setStartedAt(null);
    setSolvedIn(null);
    setMisses([]);
    setAiHints(0);
    setElapsed(0);
    setLog(START);
    lineRefs.current[0]?.focus();
  }

  function onLineKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    lineRefs.current[(index + step + LINES.length) % LINES.length]?.focus();
  }

  const shown = log.slice(-3);
  const offset = log.length - shown.length;

  return (
    <div className="crt-frame">
      <div ref={screen} className="crt">
        <div className="crt-top">
          <span>repo/utils.py</span>
          <span className="crt-clock">{clock(solvedIn ?? elapsed)}</span>
        </div>

        <div className="crt-body">
          <div className="listing">
            <p className="listing-head" id="hunt-prompt">
              {solved ? "Found it. Line 3." : "Tap the line with the bug."}
            </p>
            <ol aria-labelledby="hunt-prompt">
              {LINES.map((code, i) => {
                const n = i + 1;
                const isBug = solved && n === BUG_LINE;
                const missed = misses.includes(n);
                return (
                  <li key={n}>
                    <button
                      type="button"
                      ref={(el) => {
                        lineRefs.current[i] = el;
                      }}
                      className={`hunt-line${isBug ? " is-bug" : ""}${missed ? " is-miss" : ""}`}
                      aria-label={`Line ${n}: ${code.trim()}${missed ? " (not the bug)" : ""}${isBug ? " (the bug)" : ""}`}
                      aria-disabled={solved || undefined}
                      onClick={() => pick(n)}
                      onKeyDown={(e) => onLineKey(e, i)}
                    >
                      <span className="ln">{n}</span>
                      <code>
                        {isBug ? (
                          <>
                            {"    for i in range(len(items) - n, len(items)"}
                            <del> + 1</del>
                            {"):"}
                          </>
                        ) : (
                          code
                        )}
                      </code>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="hunt-side">
            <div className="hunt-log" aria-live="polite">
              {shown.map((entry, i) => (
                <p key={offset + i} className={`hunt-entry hunt-${entry.kind}`}>
                  <span className="tag">{TAGS[entry.kind]}</span>
                  <span>{entry.text}</span>
                </p>
              ))}
            </div>

            {solved && (
              <dl className="hunt-report">
                <div>
                  <dt>Time</dt>
                  <dd>{clock(solvedIn ?? 0)}</dd>
                </div>
                <div>
                  <dt>Wrong lines</dt>
                  <dd>{misses.length}</dd>
                </div>
                <div>
                  <dt>AI hints</dt>
                  <dd>{aiHints}</dd>
                </div>
              </dl>
            )}

            <div className="hunt-actions">
              {solved ? (
                <button type="button" className="crt-btn" onClick={reset}>
                  Play again
                </button>
              ) : (
                <button type="button" className="crt-btn" onClick={askAI}>
                  Ask the AI for a hint
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

const BUG = 3;
const LINES = [
  "1  def last_n(items, n):",
  "2      result = []",
  "3      for i in range(len(items) - n, len(items) + 1):",
  "4          result.append(items[i])",
  "5      return result",
];
const FIXED = "3      for i in range(len(items) - n, len(items)):";

export default function BugDemo() {
  const [picked, setPicked] = useState<number | null>(null);
  const fixed = picked === BUG;
  const msg =
    picked === null
      ? "Real repos hide bugs like this across several files."
      : fixed
      ? "Fixed. The loop ran one index too far. Real repos hide bugs like this across several files."
      : "Not that line. Which line reads past the end of the list?";

  return (
    <section className="w" style={{ paddingTop: 8 }}>
      <h2>Try one. Tap the line with the bug.</h2>
      <div className="code">
        <div className="top"><span>repo/utils.py</span><span>timer 24:10</span></div>
        {LINES.map((text, i) => {
          const n = i + 1;
          const cls = "line" + (picked === n ? (n === BUG ? " yes" : " no") : "");
          return (
            <button key={n} className={cls} onClick={() => !fixed && setPicked(n)}>
              {n === BUG && fixed ? FIXED : text}
            </button>
          );
        })}
        <div className={"t " + (fixed ? "p" : "f")}>
          {fixed ? "✓ test_last_n: passed" : "✗ test_last_n: IndexError"}
        </div>
      </div>
      <p className="res" aria-live="polite">{msg}</p>
    </section>
  );
}

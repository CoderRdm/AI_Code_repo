"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { burst } from "./HeroFX";

const PLAIN = "Practice the coding rounds";
const BOXED = "LeetCode doesn’t cover.";

const ANIMS = ["is-hop", "is-jump", "is-twitch"];

function play(el: HTMLElement, cls: string) {
  if (ANIMS.some((c) => el.classList.contains(c))) return;
  el.classList.add(cls);
  el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
}

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w, words) => (
        <span key={w}>
          <span className="word">
            {[...word].map((ch, i) => (
              <span key={i} className="ch">
                {ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export default function HeroTitle() {
  const ref = useRef<HTMLHeadingElement>(null);

  // Every few seconds one letter twitches, like a stuck pixel shaking loose.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const letters = ref.current?.querySelectorAll<HTMLElement>(".ch");
      if (!letters?.length || document.hidden) return;
      play(letters[Math.floor(Math.random() * letters.length)], "is-twitch");
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  function letterFrom(e: PointerEvent) {
    const el = (e.target as HTMLElement).closest<HTMLElement>(".ch");
    return el && ref.current?.contains(el) ? el : null;
  }

  function onOver(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const el = letterFrom(e);
    if (el) play(el, "is-hop");
  }

  function onDown(e: PointerEvent) {
    const el = letterFrom(e);
    if (!el) return;
    el.classList.remove("is-hop", "is-twitch");
    play(el, "is-jump");
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.85, 12);
  }

  return (
    <h1
      id="hero-title"
      ref={ref}
      aria-label={`${PLAIN} ${BOXED}`}
      onPointerOver={onOver}
      onPointerDown={onDown}
    >
      <span aria-hidden="true">
        <Letters text={PLAIN} />{" "}
        <span className="boxed">
          <Letters text={BOXED} />
          <svg className="sparkle sparkle-a" viewBox="0 0 5 5">
            <path d="M2 0h1v2h2v1H3v2H2V3H0V2h2z" />
          </svg>
          <svg className="sparkle sparkle-b" viewBox="0 0 5 5">
            <path d="M2 0h1v2h2v1H3v2H2V3H0V2h2z" />
          </svg>
          <svg className="sparkle sparkle-c" viewBox="0 0 5 5">
            <path d="M2 0h1v2h2v1H3v2H2V3H0V2h2z" />
          </svg>
        </span>
      </span>
    </h1>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const BURST_EVENT = "cyl:burst";

// Fire a burst of pixel bits at a viewport point. Any hero component can call this.
export function burst(x: number, y: number, count = 12) {
  window.dispatchEvent(new CustomEvent(BURST_EVENT, { detail: { x, y, count } }));
}

type Bit = { id: number; x: number; y: number; dx: number; dy: number; rot: number; size: number; tone: number; dur: number };
type Ring = { id: number; x: number; y: number };

const BUG = [
  ".X.....X.",
  "..X...X..",
  "...XXX...",
  "..XXXXX..",
  ".XXX.XXX.",
  "..XX.XX..",
  ".XXX.XXX.",
  "..XX.XX..",
  "..XX.XX..",
];
// Tripod gait: each group lifts while the other plants.
const LEGS_A = [
  [0, 3],
  [8, 5],
  [0, 7],
];
const LEGS_B = [
  [8, 3],
  [0, 5],
  [8, 7],
];

function cells(rows: string[]) {
  return rows.flatMap((row, y) => [...row].flatMap((c, x) => (c === "X" ? [[x, y]] : [])));
}

const BODY = cells(BUG);
const GRID = 22;

let nextId = 0;

export default function HeroFX() {
  const layer = useRef<HTMLDivElement>(null);
  const bug = useRef<HTMLDivElement>(null);
  const [bits, setBits] = useState<Bit[]>([]);
  const [rings, setRings] = useState<Ring[]>([]);
  const [alive, setAlive] = useState(false);

  // Particle bursts, positioned relative to the hero stage.
  useEffect(() => {
    function onBurst(e: Event) {
      const stage = layer.current?.parentElement;
      if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const { x, y, count } = (e as CustomEvent<{ x: number; y: number; count: number }>).detail;
      const r = stage.getBoundingClientRect();
      const ox = x - r.left;
      const oy = y - r.top;
      const fresh: Bit[] = Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.7;
        const dist = 38 + Math.random() * 54;
        return {
          id: nextId++,
          x: ox,
          y: oy,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 18,
          rot: (Math.random() - 0.5) * 540,
          size: 5 + Math.round(Math.random() * 5),
          tone: i % 3,
          dur: 650 + Math.random() * 450,
        };
      });
      const ring: Ring = { id: nextId++, x: ox, y: oy };
      setBits((b) => [...b.slice(-60), ...fresh]);
      setRings((rs) => [...rs.slice(-4), ring]);
      window.setTimeout(() => {
        const ids = new Set(fresh.map((f) => f.id));
        setBits((b) => b.filter((f) => !ids.has(f.id)));
        setRings((rs) => rs.filter((x) => x.id !== ring.id));
      }, 1200);
    }
    window.addEventListener(BURST_EVENT, onBurst);
    return () => window.removeEventListener(BURST_EVENT, onBurst);
  }, []);

  // Pointer spotlight on the dot grid, plus the bug that follows the cursor.
  useEffect(() => {
    const stage = layer.current?.parentElement;
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) return;
    setAlive(true);

    const alignGrid = () => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty("--gx", `${-((r.left + window.scrollX) % GRID)}px`);
      stage.style.setProperty("--gy", `${-((r.top + window.scrollY) % GRID)}px`);
    };
    alignGrid();

    const pointer = { x: 0, y: 0, inside: false, last: 0 };
    const pos = { x: stage.clientWidth * 0.86, y: stage.clientHeight * 0.72, angle: -90 };
    let target = { x: pos.x, y: pos.y };
    let wanderAt = 0;
    let fleeUntil = 0;
    let visible = true;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = true;
      pointer.last = performance.now();
      stage.style.setProperty("--mx", `${pointer.x}px`);
      stage.style.setProperty("--my", `${pointer.y}px`);
      stage.classList.add("is-lit");
    };
    const onLeave = () => {
      pointer.inside = false;
      stage.classList.remove("is-lit");
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden || !bug.current) return;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const fleeing = now < fleeUntil;
      const chasing = !fleeing && pointer.inside && now - pointer.last < 2500;

      if (chasing) {
        target = { x: pointer.x, y: pointer.y };
      } else if (!fleeing && now > wanderAt) {
        target = { x: 40 + Math.random() * (w - 80), y: 40 + Math.random() * (h - 80) };
        wanderAt = now + 2800 + Math.random() * 2400;
      }

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy);
      const stopAt = chasing ? 44 : 6;
      const max = fleeing ? 9 : chasing ? 3.4 : 1.3;
      const speed = dist > stopAt ? Math.min((dist - stopAt) * 0.08, max) : 0;

      if (speed > 0.05) {
        pos.x += (dx / dist) * speed;
        pos.y += (dy / dist) * speed;
        const want = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        let turn = want - pos.angle;
        turn = ((turn + 540) % 360) - 180;
        pos.angle += turn * 0.18;
      }
      pos.x = Math.max(12, Math.min(w - 12, pos.x));
      pos.y = Math.max(12, Math.min(h - 12, pos.y));

      const el = bug.current;
      el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${pos.angle}deg)`;
      el.classList.toggle("is-walking", speed > 0.25);
    };
    frame = requestAnimationFrame(tick);

    const catchBug = (e: PointerEvent) => {
      e.stopPropagation();
      const r = stage.getBoundingClientRect();
      burst(r.left + pos.x, r.top + pos.y, 16);
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      target = { x: pos.x < w / 2 ? w - 30 : 30, y: pos.y < h / 2 ? h - 30 : 30 };
      fleeUntil = performance.now() + 900;
      wanderAt = fleeUntil + 1500;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(stage);

    const bugEl = bug.current;
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    bugEl?.addEventListener("pointerdown", catchBug);
    window.addEventListener("resize", alignGrid);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      bugEl?.removeEventListener("pointerdown", catchBug);
      window.removeEventListener("resize", alignGrid);
    };
  }, []);

  return (
    <div className="fx" ref={layer} aria-hidden="true">
      <div className="fx-glow" />
      <div ref={bug} className="fx-bug" hidden={!alive} title="Catch the bug">
        <svg viewBox="0 0 9 9" width="27" height="27">
          <g className="fx-bug-body">
            {BODY.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" />
            ))}
            <rect x="3" y="2" width="1" height="1" className="fx-bug-eye" />
            <rect x="5" y="2" width="1" height="1" className="fx-bug-eye" />
          </g>
          <g className="fx-legs fx-legs-a">
            {LEGS_A.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" />
            ))}
          </g>
          <g className="fx-legs fx-legs-b">
            {LEGS_B.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" />
            ))}
          </g>
        </svg>
      </div>
      {rings.map((r) => (
        <span key={r.id} className="fx-ring" style={{ left: r.x, top: r.y }} />
      ))}
      {bits.map((b) => (
        <span
          key={b.id}
          className={`fx-bit fx-bit-${b.tone}`}
          style={
            {
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              "--dx": `${b.dx}px`,
              "--dy": `${b.dy}px`,
              "--rot": `${b.rot}deg`,
              animationDuration: `${b.dur}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const BUG = [
  ".X.....X.",
  "..X...X..",
  "...XXX...",
  "X.XXXXX.X",
  ".XXX.XXX.",
  "X.XX.XX.X",
  ".XXX.XXX.",
  "X.XX.XX.X",
  "..XX.XX..",
];

const CELLS = BUG.flatMap((row, y) =>
  [...row].flatMap((c, x) => (c === "X" ? [{ x, y }] : [])),
);

export default function BugMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      className="bugmark"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="22" height="22" rx="5" fill="var(--ink)" />
      <g transform="translate(6.5 6.5)" fill="var(--lime)">
        {CELLS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" />
        ))}
      </g>
    </svg>
  );
}

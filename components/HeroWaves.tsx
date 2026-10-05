// Layered, seamless sine waves + light rays + swimming fish for the hero backdrop.
const W = 1440; // one wave tile; each layer is 2 tiles wide and slides by exactly one tile

function wavePath(amp: number, cycles: number, phase: number, base: number) {
  const pts: string[] = [];
  const steps = 96;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W * 2;
    const y = base + amp * Math.sin((x / W) * Math.PI * 2 * cycles + phase);
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `${pts.join(" ")} V220 H0Z`;
}

const LAYERS = [
  { amp: 16, cycles: 2, phase: 0, base: 70, fill: "var(--accent)", op: 0.1, dur: 38, rev: false, h: 190 },
  { amp: 22, cycles: 3, phase: 1.4, base: 90, fill: "var(--accent-2)", op: 0.14, dur: 28, rev: true, h: 190 },
  { amp: 14, cycles: 4, phase: 2.6, base: 110, fill: "var(--accent)", op: 0.18, dur: 22, rev: false, h: 190 },
  { amp: 10, cycles: 3, phase: 4, base: 140, fill: "var(--bg)", op: 1, dur: 16, rev: true, h: 190 },
];

const FISH = [
  { top: "78%", size: 34, dur: 46, delay: -8, dir: 1 },
  { top: "84%", size: 24, dur: 62, delay: -30, dir: -1 },
  { top: "72%", size: 18, dur: 74, delay: -50, dir: 1 },
];

export function HeroWaves() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* sunlight rays filtering down through the water */}
      <div className="rays absolute inset-x-0 top-0 h-[75%]" />

      {/* swimming fish */}
      {FISH.map((f, i) => (
        <svg key={i} viewBox="0 0 64 32" className={`swim absolute ${f.dir > 0 ? "swim-r" : "swim-l"} text-accent`}
          style={{ top: f.top, width: f.size, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, opacity: 0.35 }}>
          <g className="fish-bob" style={{ animationDelay: `${f.delay}s` }}>
            <path fill="currentColor" d="M2 16 C14 2 38 2 50 14 L62 5 C58 12 58 20 62 27 L50 18 C38 30 14 30 2 16Z" />
            <circle cx="12" cy="13" r="1.6" fill="var(--bg)" />
          </g>
        </svg>
      ))}

      {/* wave layers */}
      <div className="absolute inset-x-0 bottom-0 h-[190px]">
        {LAYERS.map((l, i) => (
          <svg key={i} viewBox={`0 0 ${W * 2} 220`} preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-[200%]" style={{ height: l.h, opacity: l.op }}>
            <g className="wave-slide" style={{ animationDuration: `${l.dur}s`, animationDirection: l.rev ? "reverse" : "normal" }}>
              <path d={wavePath(l.amp, l.cycles, l.phase, l.base)} fill={l.fill} />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
}

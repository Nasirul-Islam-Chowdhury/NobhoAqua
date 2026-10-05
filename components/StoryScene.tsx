type Scene = "cover" | "shore" | "satellite" | "net" | "cast" | "tide" | "lantern";

/** Hand-drawn style illustrations for the user-manual storybook. */
export function StoryScene({ scene }: { scene: Scene }) {
  const sky = scene === "tide" ? ["#3b1d2a", "#7f2d3a"] : scene === "lantern" ? ["#0b1b3a", "#233a73"] : ["#0e2a4a", "#1f6f8b"];
  return (
    <svg viewBox="0 0 400 460" className="h-full w-full" role="img" aria-label={`Illustration: ${scene}`}>
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14b8c6" stopOpacity=".9" /><stop offset="1" stopColor="#0a3d62" /></linearGradient>
        <radialGradient id="sun"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#fde68a" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="460" fill={`url(#sky-${scene})`} />
      {/* stars */}
      {[[40, 40], [120, 70], [300, 50], [350, 110], [210, 30], [70, 120], [260, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 1.4 : 2} fill="#fff" opacity=".7" />)}
      {/* sun / moon */}
      <circle cx="310" cy="150" r="70" fill="url(#sun)" /><circle cx="310" cy="150" r="26" fill={scene === "lantern" ? "#e2e8f0" : "#fde68a"} />

      {/* satellite */}
      {(scene === "satellite" || scene === "cover" || scene === "lantern") && (
        <g transform="translate(90 80) rotate(-18)">
          <rect x="-14" y="-10" width="28" height="20" rx="4" fill="#cbd5e1" />
          <rect x="-58" y="-7" width="38" height="14" fill="#38bdf8" stroke="#0c4a6e" /><rect x="20" y="-7" width="38" height="14" fill="#38bdf8" stroke="#0c4a6e" />
          <path d="M0 10 L0 22 M-8 22 H8" stroke="#cbd5e1" strokeWidth="3" />
          {scene === "satellite" && <path d="M0 26 L-70 230 H70Z" fill="#fde68a" opacity=".13" />}
        </g>
      )}

      {/* sea */}
      <rect y="250" width="400" height="210" fill="url(#sea)" />
      <path d="M0 262 Q 50 244 100 262 T 200 262 T 300 262 T 400 262 V275 H0Z" fill="#22d3ee" opacity=".35" />
      <path d="M0 290 Q 60 274 120 290 T 240 290 T 360 290 T 480 290 V300 H0Z" fill="#67e8f9" opacity=".18" />

      {/* hotspot glow */}
      {(scene === "satellite" || scene === "net" || scene === "cast") && (
        <g>{[[250, 340, 34], [290, 372, 22], [215, 385, 18]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#34d399" opacity={0.18 + i * 0.05} />)}</g>
      )}
      {/* red tide */}
      {scene === "tide" && <g>{[[110, 350, 50], [170, 390, 36], [70, 400, 28]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r * 1.5} ry={r * 0.6} fill="#ef4444" opacity=".45" />)}</g>}

      {/* boat */}
      {scene !== "net" && scene !== "tide" && (
        <g transform="translate(70 232)">
          <path d="M0 40 H110 L92 66 H18Z" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          <path d="M55 38 V-30" stroke="#451a03" strokeWidth="3" /><path d="M58 -28 L100 30 H58Z" fill="#fef3c7" /><path d="M52 -20 L18 30 H52Z" fill="#fde68a" />
          {scene === "lantern" && <><circle cx="108" cy="30" r="6" fill="#fbbf24" /><circle cx="108" cy="30" r="16" fill="#fbbf24" opacity=".25" /></>}
        </g>
      )}
      {scene === "tide" && (
        <g transform="translate(240 240)"><path d="M0 40 H100 L84 62 H16Z" fill="#92400e" stroke="#451a03" strokeWidth="2" /><path d="M50 38 V-20" stroke="#451a03" strokeWidth="3" /><path d="M53 -18 L90 30 H53Z" fill="#fef3c7" /></g>
      )}
      {/* fish */}
      {(scene === "net" || scene === "cast" || scene === "shore" || scene === "cover") && (
        <g fill="#e0f2fe" opacity=".95">
          {[[230, 350, 1.2], [290, 330, 0.9], [200, 400, 0.8], [320, 395, 1]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 0 C14 -14 34 -14 46 -2 L58 -12 C54 -4 54 4 58 12 L46 2 C34 14 14 14 0 0Z" /><circle cx="9" cy="-3" r="2" fill="#0a3d62" /></g>
          ))}
        </g>
      )}
      {scene === "net" && <path d="M120 270 Q200 460 330 280" stroke="#f1f5f9" strokeWidth="1.5" fill="none" strokeDasharray="3 5" opacity=".7" />}
      {/* shore */}
      {scene === "shore" && <path d="M0 430 Q 90 400 200 425 T 400 420 V460 H0Z" fill="#d6b87a" />}
    </svg>
  );
}

import type { Range } from "@/lib/types";

interface Props {
  label: string;
  unit: string;
  range: Range;
  scale: Range;
  marker?: { value: number; label: string };
  fmt?: (n: number) => string;
}

export function RangeGauge({ label, unit, range, scale, marker, fmt = (n) => String(n) }: Props) {
  const pct = (v: number) => Math.min(100, Math.max(0, ((v - scale[0]) / (scale[1] - scale[0])) * 100));
  const l = pct(range[0]), w = Math.max(2.5, pct(range[1]) - l);
  const inside = marker && marker.value >= range[0] && marker.value <= range[1];
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-display text-lg font-semibold tabular-nums">
          {fmt(range[0])} – {fmt(range[1])} <span className="text-xs font-normal text-muted">{unit}</span>
        </span>
      </div>
      <div className="relative mt-5 h-3 rounded-full bg-line" role="img" aria-label={`${label} tolerance ${range[0]} to ${range[1]} ${unit}`}>
        <div className="absolute inset-y-0 rounded-full bg-gradient-to-r from-accent to-accent2 shadow-[0_0_18px_var(--glow)]" style={{ left: `${l}%`, width: `${w}%` }} />
        {marker && (
          <div className="absolute -top-1.5 h-6 w-0.5 bg-fg" style={{ left: `${pct(marker.value)}%` }}>
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-muted">{marker.label}</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted tabular-nums"><span>{scale[0]}</span><span>{scale[1]}</span></div>
      {!marker && <p className="mt-2 text-xs text-muted">Comfortable range for this species</p>}
      {marker && (
        <p className={`mt-2 text-xs ${inside ? "text-good" : "text-warn"}`}>
          Bay of Bengal avg {fmt(+marker.value.toFixed(2))} {unit} — {inside ? "inside tolerance" : "outside tolerance"}
        </p>
      )}
    </div>
  );
}

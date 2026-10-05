"use client";
import { mean, pearson, points } from "@/lib/data";
import { Reveal, SectionHead } from "./Reveal";

const keys = [
  ["sst", "SST"], ["chl", "Chl-a"], ["salinity", "Salinity"], ["depth", "Depth"], ["hsiHilsa", "HSI Hilsa"], ["hsiTuna", "HSI Tuna"], ["hsiShrimp", "HSI Shrimp"],
] as const;

function Box({ label, vals, color }: { label: string; vals: number[]; color: string }) {
  const s = [...vals].sort((a, b) => a - b);
  const q = (p: number) => s[Math.floor((s.length - 1) * p)];
  const W = 100;
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-muted tabular-nums">mean {mean(vals).toFixed(2)}</span></div>
      <svg viewBox="0 0 100 18" className="w-full" role="img" aria-label={`${label} distribution: median ${q(0.5).toFixed(2)}`}>
        <rect x="0" y="6" width="100" height="6" rx="3" fill="var(--line)" />
        <line x1={q(0) * W} x2={q(1) * W} y1="9" y2="9" stroke={color} strokeWidth="1" />
        <rect x={q(0.25) * W} y="3" width={Math.max(1, (q(0.75) - q(0.25)) * W)} height="12" rx="2" fill={color} fillOpacity=".7" />
        <line x1={q(0.5) * W} x2={q(0.5) * W} y1="2" y2="16" stroke="var(--fg)" strokeWidth="1.2" />
        {vals.map((v, i) => <circle key={i} cx={v * W} cy={9 + ((i * 37) % 7) - 3} r="0.8" fill={color} />)}
      </svg>
      <div className="flex justify-between text-[10px] text-muted"><span>0</span><span>HSI</span><span>1</span></div>
    </div>
  );
}

export function Insights() {
  const mat = keys.map(([a]) => keys.map(([b]) => pearson(points.map((p) => p[a]), points.map((p) => p[b]))));
  const cell = (v: number) => (v >= 0 ? `rgba(34,211,238,${Math.abs(v)})` : `rgba(248,113,113,${Math.abs(v)})`);
  return (
    <section id="insights" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Model insights" title="What drives fish habitat?"
        sub="The Colab pipeline predicts habitat suitability (HSI, 0–1) for Hilsa, Tuna and Shrimp from four satellite variables. Here is how those variables relate." />
      <Reveal>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">HSI distribution by species</h3>
            <div className="mt-5 space-y-6">
              <Box label="Hilsa" vals={points.map((p) => p.hsiHilsa)} color="#22d3ee" />
              <Box label="Tuna" vals={points.map((p) => p.hsiTuna)} color="#a78bfa" />
              <Box label="Shrimp" vals={points.map((p) => p.hsiShrimp)} color="#2dd4bf" />
            </div>
            <p className="mt-5 text-sm text-muted">Hilsa and shrimp thrive in these estuarine waters; tuna favour clearer, saltier offshore water, so scores are low near the coast.</p>
          </div>
          <div className="glass overflow-x-auto rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">Parameter correlation</h3>
            <table className="mt-4 w-full min-w-[460px] border-separate border-spacing-1 text-center text-xs">
              <thead><tr><th />{keys.map(([, l]) => <th key={l} className="px-1 pb-1 font-medium text-muted">{l}</th>)}</tr></thead>
              <tbody>
                {keys.map(([, l], i) => (
                  <tr key={l}>
                    <th className="pr-2 text-right font-medium text-muted">{l}</th>
                    {mat[i].map((v, j) => <td key={j} className="rounded-md py-2 tabular-nums" style={{ background: cell(v) }} title={`${l} × ${keys[j][1]}: ${v.toFixed(2)}`}>{v.toFixed(2)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-muted">Cyan = positive, red = negative correlation, computed from the 119 satellite points.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

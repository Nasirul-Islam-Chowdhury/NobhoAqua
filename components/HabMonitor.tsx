"use client";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { locations, MODEL, points } from "@/lib/data";
import { Reveal, SectionHead } from "./Reveal";
import { Badge, habLabel } from "./ui";

const COL = { crit: "#f87171", mod: "#fbbf24", ok: "#34d399" };
const hc = (h: string) => (h.startsWith("CRITICAL") ? COL.crit : h.startsWith("Moderate") ? COL.mod : COL.ok);

export function HabMonitor() {
  const [hover, setHover] = useState<number | null>(null);
  const crit = points.filter((p) => p.hab.startsWith("CRITICAL"));
  const mod = points.filter((p) => p.hab.startsWith("Moderate"));
  const ok = points.filter((p) => p.hab.startsWith("Normal"));

  const W = 640, H = 360, m = { l: 48, r: 16, t: 16, b: 44 };
  const xs = points.map((p) => p.sst), ys = points.map((p) => p.chl);
  const x0 = Math.floor(Math.min(...xs)), x1 = Math.ceil(Math.max(...xs)), y1 = Math.ceil(Math.max(...ys));
  const X = (v: number) => m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r);
  const Y = (v: number) => H - m.b - (v / y1) * (H - m.t - m.b);
  const hp = hover != null ? points.find((p) => p.id === hover) : null;

  return (
    <section id="hab" className="bg-bg2/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Aquaculture & algal bloom monitor" title="Warnings 24–48 hours ahead."
          sub={`A Random-Forest classifier reads temperature, chlorophyll-a, salinity and depth to flag harmful algal blooms — ${MODEL.habAccuracy}% accurate on held-out points.`} />

        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ n: crit.length, l: "Critical red-tide alerts", c: COL.crit, pulse: true }, { n: mod.length, l: "Moderate warnings", c: COL.mod }, { n: ok.length, l: "Normal health", c: COL.ok }].map((s) => (
              <div key={s.l} className="glass flex items-center gap-4 rounded-2xl p-5">
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${s.pulse ? "pulse-danger" : ""}`} style={{ background: `${s.c}22`, color: s.c }}><AlertTriangle size={22} /></span>
                <div><div className="font-display text-3xl font-bold tabular-nums">{s.n}</div><div className="text-sm text-muted">{s.l}</div></div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-semibold">Temperature vs chlorophyll-a</h3>
              <p className="text-sm text-muted">Each dot is a grid point, coloured by alert level. Hover for details.</p>
              <div className="relative mt-3">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scatter plot of sea temperature against chlorophyll-a coloured by algal alert">
                  {Array.from({ length: y1 + 1 }, (_, i) => i).map((t) => (
                    <g key={t}><line x1={m.l} x2={W - m.r} y1={Y(t)} y2={Y(t)} stroke="var(--line)" /><text x={m.l - 8} y={Y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{t}</text></g>
                  ))}
                  {Array.from({ length: x1 - x0 + 1 }, (_, i) => x0 + i).map((t) => (
                    <text key={t} x={X(t)} y={H - m.b + 18} textAnchor="middle" fontSize="11" fill="var(--muted)">{t}</text>
                  ))}
                  <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="var(--muted)">Sea surface temperature (°C)</text>
                  <text transform={`translate(12 ${H / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="var(--muted)">Chl-a (mg/m³)</text>
                  {points.map((p) => (
                    <circle key={p.id} cx={X(p.sst)} cy={Y(p.chl)} r={3 + p.depth / 12} fill={hc(p.hab)} fillOpacity={hover === p.id ? 1 : 0.55} stroke={hover === p.id ? "#fff" : "none"}
                      onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} />
                  ))}
                </svg>
                {hp && <div className="glass pointer-events-none absolute right-2 top-2 rounded-xl px-3 py-2 text-xs"><b>{hp.location}</b><br />{hp.sst}°C · {hp.chl} mg/m³ · {hp.salinity} PSU<br />{habLabel(hp.hab)}</div>}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
                {[["Critical", COL.crit], ["Moderate", COL.mod], ["Normal", COL.ok]].map(([l, c]) => <span key={l} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{l}</span>)}
                <span>· dot size = depth</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-semibold">By area</h3>
              <div className="mt-4 space-y-5">
                {locations.map((loc) => {
                  const ps = points.filter((p) => p.location === loc);
                  const c = ps.filter((p) => p.hab.startsWith("CRITICAL")).length, md = ps.filter((p) => p.hab.startsWith("Moderate")).length, o = ps.length - c - md;
                  return (
                    <div key={loc}>
                      <div className="mb-1.5 flex justify-between text-sm"><span>{loc}</span><span className="text-muted tabular-nums">{ps.length} pts</span></div>
                      <div className="flex h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={`${c} critical, ${md} moderate, ${o} normal`}>
                        <div style={{ width: `${(c / ps.length) * 100}%`, background: COL.crit }} /><div style={{ width: `${(md / ps.length) * 100}%`, background: COL.mod }} /><div style={{ width: `${(o / ps.length) * 100}%`, background: COL.ok }} />
                      </div>
                      <div className="mt-1.5 flex gap-2"><Badge tone="danger">{c} critical</Badge><Badge tone="warn">{md} moderate</Badge><Badge tone="good">{o} normal</Badge></div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm leading-relaxed">
                <b className="text-danger">Farm advice:</b> at critical points, pause feeding, increase aeration and check dissolved oxygen — blooms can drop oxygen overnight.
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

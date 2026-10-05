"use client";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { fmtCoord, points, rankSpeciesAt, verdict } from "@/lib/data";
import type { OceanPoint } from "@/lib/types";
import { OceanMap } from "./MapClient";
import { SectionHead, Reveal } from "./Reveal";
import { Badge, Bar, Stat, habLabel, habTone, scoreColor } from "./ui";

type Layer = "pfz" | "sst" | "chl" | "hab";
const LAYERS: { id: Layer; label: string }[] = [
  { id: "pfz", label: "Fishing zones" },
  { id: "sst", label: "Sea temp" },
  { id: "chl", label: "Chlorophyll-a" },
  { id: "hab", label: "Algal alerts" },
];

const lerp = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const ramp = (stops: number[][], t: number) => {
  const x = Math.min(0.999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(x);
  const c = lerp(stops[i], stops[i + 1], x - i);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const SST_STOPS = [[56, 189, 248], [250, 204, 21], [244, 63, 94]];
const CHL_STOPS = [[16, 185, 129], [234, 179, 8], [190, 242, 100], [20, 83, 45]];

const sstMin = Math.min(...points.map((p) => p.sst)), sstMax = Math.max(...points.map((p) => p.sst));
const chlMin = Math.min(...points.map((p) => p.chl)), chlMax = Math.max(...points.map((p) => p.chl));

export function MapSection() {
  const [layer, setLayer] = useState<Layer>("pfz");
  const [sel, setSel] = useState<OceanPoint | null>(points[0]);

  const style = (p: OceanPoint) => {
    switch (layer) {
      case "sst": return { color: ramp(SST_STOPS, (p.sst - sstMin) / (sstMax - sstMin)), label: `${p.sst}°C` };
      case "chl": return { color: ramp(CHL_STOPS.slice(0, 3), (p.chl - chlMin) / (chlMax - chlMin)), label: `${p.chl} mg/m³` };
      case "hab": return { color: p.hab.startsWith("CRITICAL") ? "#f87171" : p.hab.startsWith("Moderate") ? "#fbbf24" : "#34d399", label: habLabel(p.hab) };
      default: return { color: p.pfz === "High Density" ? "#22d3ee" : "#a78bfa", radius: 5 + p.hsiHilsa * 5, label: p.pfz };
    }
  };

  const top = useMemo(() => (sel ? rankSpeciesAt(sel).slice(0, 6) : []), [sel]);

  const legend: Record<Layer, { c: string; l: string }[]> = {
    pfz: [{ c: "#22d3ee", l: "High-density zone" }, { c: "#a78bfa", l: "Medium zone" }],
    sst: [{ c: ramp(SST_STOPS, 0), l: `${sstMin.toFixed(1)}°C` }, { c: ramp(SST_STOPS, 0.5), l: "" }, { c: ramp(SST_STOPS, 1), l: `${sstMax.toFixed(1)}°C` }],
    chl: [{ c: ramp(CHL_STOPS.slice(0, 3), 0), l: `${chlMin.toFixed(1)} mg/m³` }, { c: ramp(CHL_STOPS.slice(0, 3), 0.5), l: "" }, { c: ramp(CHL_STOPS.slice(0, 3), 1), l: `${chlMax.toFixed(1)} mg/m³` }],
    hab: [{ c: "#f87171", l: "Critical" }, { c: "#fbbf24", l: "Moderate" }, { c: "#34d399", l: "Normal" }],
  };

  return (
    <section id="map" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Ocean GIS" title="Potential fishing zones, from orbit"
        sub="119 NASA-derived grid points across the Sundarbans estuary, Meghna river mouth and Kuakata offshore. Switch layers, then tap any point to inspect it." />
      <Reveal>
        <div role="tablist" aria-label="Map layer" className="mb-4 flex flex-wrap gap-2">
          {LAYERS.map((l) => (
            <button key={l.id} role="tab" aria-selected={layer === l.id} onClick={() => setLayer(l.id)}
              className={`focus-ring rounded-xl border px-4 py-2 text-sm font-medium transition ${layer === l.id ? "border-transparent bg-gradient-to-r from-accent to-accent2 text-ink shadow-[0_0_24px_var(--glow)]" : "glass text-muted hover:text-fg"}`}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 lg:grid-cols-[1fr_380px]">
          <div className="glass relative h-[460px] overflow-hidden rounded-2xl sm:h-[560px]">
            <OceanMap points={points} style={style} selectedId={sel?.id} onSelect={setSel} />
            <div className="glass pointer-events-none absolute bottom-3 left-3 z-[500] flex items-center gap-3 rounded-xl px-3 py-2 text-xs">
              {legend[layer].map((x, i) => (
                <span key={i} className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: x.c }} />{x.l}</span>
              ))}
            </div>
          </div>
          <aside aria-live="polite" className="glass rounded-2xl p-5">
            {sel ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted"><MapPin size={14} />Point #{sel.id}</div>
                    <h3 className="mt-1 font-display text-xl font-semibold">{sel.location}</h3>
                    <p className="font-mono text-xs text-muted">{fmtCoord(sel)}</p>
                  </div>
                  <Badge tone={sel.pfz === "High Density" ? "accent" : "default"}>{sel.pfz}</Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <Stat label="Sea temp" value={sel.sst} unit="°C" />
                  <Stat label="Chlorophyll-a" value={sel.chl} unit="mg/m³" />
                  <Stat label="Salinity" value={sel.salinity} unit="PSU" />
                  <Stat label="Depth" value={sel.depth} unit="m" />
                </div>
                <div className="mt-4"><Badge tone={habTone(sel.hab)}>{habLabel(sel.hab)}</Badge></div>
                <h4 className="mt-6 text-sm font-semibold">Likely species here</h4>
                <ul className="mt-3 space-y-3">
                  {top.map((t) => (
                    <li key={t.species.id}>
                      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                        <span className="truncate">{t.species.name}</span>
                        <span className={`shrink-0 tabular-nums ${verdict(t.score).cls}`}>{Math.round(t.score * 100)}%</span>
                      </div>
                      <Bar value={t.score} color={scoreColor(t.score)} />
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted">Hilsa & tuna scores come from the ML model; others from temperature + chlorophyll-a range fit.</p>
              </>
            ) : <p className="text-muted">Select a point on the map.</p>}
          </aside>
        </div>
      </Reveal>
    </section>
  );
}

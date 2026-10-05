"use client";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { fmtCoord, points, rankSpeciesAt, verdict } from "@/lib/data";
import type { OceanPoint } from "@/lib/types";
import { MapLegend } from "./MapLegend";
import { OceanMap } from "./MapClient";
import { SectionHead, Reveal } from "./Reveal";
import { Badge, Bar, Stat, habLabel, habTone, scoreColor } from "./ui";

type Layer = "pfz" | "sst" | "chl" | "hab";
const LAYERS: { id: Layer; label: string }[] = [
  { id: "pfz", label: "Fishing zones" },
  { id: "sst", label: "Sea temperature" },
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
      case "sst": return { color: ramp(SST_STOPS, (p.sst - sstMin) / (sstMax - sstMin)), label: `${p.sst}°C sea temperature` };
      case "chl": return { color: ramp(CHL_STOPS.slice(0, 3), (p.chl - chlMin) / (chlMax - chlMin)), label: `${p.chl} mg/m³ chlorophyll-a` };
      case "hab": return { color: p.hab.startsWith("CRITICAL") ? "#f87171" : p.hab.startsWith("Moderate") ? "#fbbf24" : "#34d399", label: habLabel(p.hab) };
      default: return { color: p.pfz === "High Density" ? "#22d3ee" : "#a78bfa", radius: 5 + p.hsiHilsa * 5, label: `${p.pfz} fishing zone · tap for details` };
    }
  };

  const top = useMemo(() => (sel ? rankSpeciesAt(sel).slice(0, 6) : []), [sel]);

  const legends: Record<Layer, React.ComponentProps<typeof MapLegend>> = {
    pfz: { title: "Fishing zones", items: [{ color: "#22d3ee", label: "High-density zone", hint: "Best chance of finding fish" }, { color: "#a78bfa", label: "Medium zone", hint: "Moderate chance" }], note: "Bigger dot = better hilsa conditions" },
    sst: { title: "Sea temperature", scale: { colors: SST_STOPS.map((c) => `rgb(${c.join(",")})`), low: `${sstMin.toFixed(1)}°C cooler`, high: `warmer ${sstMax.toFixed(1)}°C` }, note: "Fish gather where warm and cool water meet" },
    chl: { title: "Chlorophyll-a (fish food)", scale: { colors: CHL_STOPS.slice(0, 3).map((c) => `rgb(${c.join(",")})`), low: `${chlMin.toFixed(1)} less`, high: `more ${chlMax.toFixed(1)} mg/m³` }, note: "More chlorophyll-a = more plankton for fish to eat" },
    hab: { title: "Algal bloom alerts", items: [{ color: "#f87171", label: "Critical red tide", hint: "Pause feeding · check oxygen" }, { color: "#fbbf24", label: "Moderate warning", hint: "Watch the water closely" }, { color: "#34d399", label: "Normal health", hint: "Water looks safe" }] },
  };

  return (
    <section id="map" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Ocean map" title="Potential fishing zones, from orbit"
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
            <MapLegend {...legends[layer]} />
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
                  <Stat label="Sea temperature" value={sel.sst} unit="°C" />
                  <Stat label="Chlorophyll-a" value={sel.chl} unit="mg/m³" />
                  <Stat label="Salinity" value={sel.salinity} unit="practical salinity units" />
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
                <p className="mt-4 text-xs text-muted">Hilsa & tuna scores come from the machine-learning model; others from temperature + chlorophyll-a range fit.</p>
              </>
            ) : <p className="text-muted">Select a point on the map.</p>}
          </aside>
        </div>
      </Reveal>
    </section>
  );
}

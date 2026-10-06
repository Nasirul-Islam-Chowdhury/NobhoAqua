"use client";
import { AlertTriangle, MapPin } from "lucide-react";
import { useState } from "react";
import { fmtCoord, locations, MODEL, points } from "@/lib/data";
import type { OceanPoint } from "@/lib/types";
import { OceanMap } from "./MapClient";
import { MapLegend } from "./MapLegend";
import { Reveal, SectionHead } from "./Reveal";
import { Badge, Stat, habLabel, habTone } from "./ui";

const COL = { crit: "#f87171", mod: "#fbbf24", ok: "#34d399" };
const hc = (h: string) => (h.startsWith("CRITICAL") ? COL.crit : h.startsWith("Moderate") ? COL.mod : COL.ok);
const radius = (h: string) => (h.startsWith("CRITICAL") ? 13 : h.startsWith("Moderate") ? 11 : 9);

const ADVICE: Record<"danger" | "warn" | "good", string> = {
  danger: "Pause feeding, increase aeration and check dissolved oxygen right away — blooms can drop oxygen overnight.",
  warn: "Watch the water closely over the next 24–48 hours and keep aeration ready, just in case.",
  good: "Water looks safe. Continue routine monitoring.",
};

export function HabMonitor() {
  const crit = points.filter((p) => p.hab.startsWith("CRITICAL"));
  const mod = points.filter((p) => p.hab.startsWith("Moderate"));
  const ok = points.filter((p) => p.hab.startsWith("Normal"));
  const [sel, setSel] = useState<OceanPoint | null>(crit[0] ?? points[0]);

  const legend = {
    title: "Algal bloom alerts",
    items: [
      { color: COL.crit, label: "Critical red tide", hint: "Pause feeding · check oxygen" },
      { color: COL.mod, label: "Moderate warning", hint: "Watch the water closely" },
      { color: COL.ok, label: "Normal health", hint: "Water looks safe" },
    ],
    note: "Bigger dot = higher alert level · tap any point for farm advice",
  };

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

          <p className="mt-6 text-sm text-muted">Every point below is a farm or fishing area. Tap one on the map to see its reading and what to do about it.</p>

          <div className="mt-3 grid grid-cols-1 gap-4 [&>*]:min-w-0 lg:grid-cols-[1fr_380px]">
            <div className="glass relative h-[420px] overflow-hidden rounded-2xl sm:h-[500px]">
              <OceanMap
                points={points}
                style={(p) => ({ color: hc(p.hab), radius: radius(p.hab), label: `${p.location} · ${habLabel(p.hab)}` })}
                selectedId={sel?.id}
                onSelect={setSel}
              />
              <MapLegend {...legend} />
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
                    <Badge tone={habTone(sel.hab)}>{habLabel(sel.hab)}</Badge>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <Stat label="Sea temperature" value={sel.sst} unit="°C" />
                    <Stat label="Chlorophyll-a" value={sel.chl} unit="mg/m³" />
                    <Stat label="Salinity" value={sel.salinity} unit="practical salinity units" />
                    <Stat label="Depth" value={sel.depth} unit="m" />
                  </div>
                  <div className={`mt-5 rounded-xl border p-4 text-sm leading-relaxed ${sel.hab.startsWith("CRITICAL") ? "border-danger/30 bg-danger/10" : sel.hab.startsWith("Moderate") ? "border-warn/30 bg-warn/10" : "border-good/30 bg-good/10"}`}>
                    <b className={habTone(sel.hab) === "danger" ? "text-danger" : habTone(sel.hab) === "warn" ? "text-warn" : "text-good"}>Farm advice:</b> {ADVICE[habTone(sel.hab)]}
                  </div>
                </>
              ) : <p className="text-muted">Select a point on the map.</p>}
            </aside>
          </div>

          <div className="mt-4 glass rounded-2xl p-5">
            <h3 className="font-display text-lg font-semibold">By area</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

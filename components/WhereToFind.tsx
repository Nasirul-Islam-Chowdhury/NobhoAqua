"use client";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { useMemo, useState } from "react";
import { fmtCoord, groups, locationSummary, locations, points, rankSpeciesAt, verdict } from "@/lib/data";
import type { OceanPoint } from "@/lib/types";
import { MapLegend } from "./MapLegend";
import { OceanMap } from "./MapClient";
import { Reveal, SectionHead } from "./Reveal";
import { Badge, Bar, scoreColor } from "./ui";

const summaries = locations.map(locationSummary);
const AREA_HINT: Record<string, string> = {
  "Sundarbans Estuary": "Mangrove-fed brackish water — nursery ground for shrimp, mullet and hilsa.",
  "Meghna River Mouth": "River-plume nutrients feed the hilsa run and coastal schooling fish.",
  "Kuakata Offshore": "Deeper, clearer shelf water — pelagic and open-water species.",
};

export function WhereToFind() {
  const [sel, setSel] = useState<OceanPoint>(points[0]);
  const [group, setGroup] = useState("All");
  const [min, setMin] = useState(0.5);

  const results = useMemo(
    () => rankSpeciesAt(sel).filter((r) => (group === "All" || r.species.group === group) && r.score >= min).slice(0, 12),
    [sel, group, min],
  );

  return (
    <section id="where" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Where can I get which fish?" title="From the water to the catch."
        sub="Start with the area, or tap an exact point. We rank every species by how well the satellite-observed temperature and chlorophyll-a fit its needs." />

      <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 md:grid-cols-3">
        {summaries.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08}>
            <article className="glass h-full rounded-2xl p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-xl font-semibold">{s.name}</h3>
                <Badge tone="accent">{s.count} pts</Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{AREA_HINT[s.name]}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg border border-line py-2"><div className="font-display text-base font-semibold">{s.sst.toFixed(1)}°C</div>temp</div>
                <div className="rounded-lg border border-line py-2"><div className="font-display text-base font-semibold">{s.chl.toFixed(1)}</div>chl-a</div>
                <div className="rounded-lg border border-line py-2"><div className="font-display text-base font-semibold">{s.depth.toFixed(0)} m</div>depth</div>
              </div>
              <h4 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-muted">Top fish here</h4>
              <ol className="space-y-1.5">
                {s.top.slice(0, 6).map((t, k) => (
                  <li key={t.species.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate"><span className="mr-1.5 text-muted tabular-nums">{k + 1}.</span>{t.species.name}</span>
                    <span className={`shrink-0 text-xs tabular-nums ${verdict(t.score).cls}`}>{Math.round(t.score * 100)}%</span>
                  </li>
                ))}
              </ol>
              <button onClick={() => { const p = points.find((x) => x.location === s.name)!; setSel(p); document.getElementById("finder")?.scrollIntoView({ behavior: "smooth" }); }}
                className="focus-ring mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                Pick a point in this area <ArrowUpRight size={14} />
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div id="finder" className="mt-10 grid grid-cols-1 gap-4 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr]">
          <div className="glass relative h-[420px] overflow-hidden rounded-2xl lg:h-[620px]">
            <OceanMap points={points} selectedId={sel.id} onSelect={setSel}
              style={(p) => ({ color: p.location === sel.location ? "#22d3ee" : "#64748b", radius: 6, opacity: p.location === sel.location ? 0.8 : 0.45, label: `${p.location} · ${p.sst}°C · tap to rank fish` })} />
            <MapLegend title="Choose a spot" items={[{ color: "#22d3ee", label: "Same area as selected", hint: sel.location }, { color: "#64748b", label: "Other areas", hint: "Tap any dot to compare" }]} />
            <div className="pointer-events-none absolute right-3 top-3 z-[500] flex items-center gap-2 rounded-xl border border-accent/50 bg-solid/95 px-3.5 py-2 text-sm font-bold shadow-lg"><MousePointerClick size={16} className="text-accent" />Tap a point to rank fish</div>
          </div>
          <div className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-semibold">Fish at point #{sel.id}</h3>
              <span className="font-mono text-xs text-muted">{fmtCoord(sel)}</span>
            </div>
            <p className="text-sm text-muted">{sel.location} · {sel.sst}°C · chl-a {sel.chl} mg/m³</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="grp" className="text-xs text-muted">Fish group</label>
                <select id="grp" value={group} onChange={(e) => setGroup(e.target.value)} className="focus-ring mt-1 w-full rounded-xl border border-line bg-solid px-3 py-2.5 text-sm">
                  <option>All</option>{groups.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="min" className="flex justify-between text-xs text-muted"><span>Minimum suitability</span><span className="tabular-nums">{Math.round(min * 100)}%</span></label>
                <input id="min" type="range" min={0} max={0.95} step={0.05} value={min} onChange={(e) => setMin(+e.target.value)} className="focus-ring mt-3 w-full accent-[var(--accent)]" />
              </div>
            </div>
            <ul className="mt-5 space-y-3" aria-live="polite">
              {results.map((r) => (
                <li key={r.species.id}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate font-medium">{r.species.name} <span className="text-xs font-normal italic text-muted">{r.species.scientific}</span></span>
                    <span className={`shrink-0 tabular-nums ${verdict(r.score).cls}`}>{Math.round(r.score * 100)}% {r.source === "model" && "· Machine Learning"}</span>
                  </div>
                  <div className="mt-1"><Bar value={r.score} color={scoreColor(r.score)} /></div>
                </li>
              ))}
              {!results.length && <li className="py-8 text-center text-sm text-muted">No species meet this filter here. Lower the minimum suitability.</li>}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted">Range-based estimate from temperature and chlorophyll-a; it does not check a species’ native geographic range. Always combine with local expertise and regulations.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

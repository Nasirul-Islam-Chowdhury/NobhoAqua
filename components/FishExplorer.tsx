"use client";
import { Download, Search, Thermometer } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BOB_MEAN, fmtCoord, groups, isModelled, mean, points, rankPointsFor, species, verdict } from "@/lib/data";
import type { Species } from "@/lib/types";
import { OceanMap } from "./MapClient";
import { RangeGauge } from "./RangeGauge";
import { Reveal, SectionHead } from "./Reveal";
import { Badge, Bar, scoreColor } from "./ui";

const QUICK = ["hilsa-tenualosa-ilisha", "yellowfin-tuna", "barramundi-sea-bass", "milkfish", "atlantic-salmon", "great-white-shark"];

export function similar(s: Species, n = 4) {
  const d = (o: Species) =>
    Math.abs((o.temp[0] + o.temp[1]) / 2 - (s.temp[0] + s.temp[1]) / 2) / 10 +
    Math.abs((o.chl[0] + o.chl[1]) / 2 - (s.chl[0] + s.chl[1]) / 2) / 2 +
    Math.abs((o.do[0] + o.do[1]) / 2 - (s.do[0] + s.do[1]) / 2) / 4 + (o.group === s.group ? 0 : 0.6);
  return species.filter((o) => o.id !== s.id).sort((a, b) => d(a) - d(b)).slice(0, n);
}

function csv(s: Species) {
  const rows = rankPointsFor(s).slice(0, 25).map((m) => [m.point.id, m.point.lat, m.point.lon, m.point.location, m.point.sst, m.point.chl, Math.round(m.score * 100)].join(","));
  const blob = new Blob(["point,latitude,longitude,area,sst_c,chl_mg_m3,suitability_pct\n" + rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${s.slug}-best-locations.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function FishExplorer() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string>("All");
  const [selected, setSelected] = useState<Species>(species.find((s) => s.slug === "hilsa-tenualosa-ilisha")!);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return species.filter((s) => (group === "All" || s.group === group) && (!t || s.name.toLowerCase().includes(t) || s.scientific.toLowerCase().includes(t)));
  }, [q, group]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const ranked = useMemo(() => rankPointsFor(selected), [selected]);
  const top = ranked.slice(0, 10);
  const scoreById = useMemo(() => new Map(ranked.map((m) => [m.point.id, m.score])), [ranked]);
  const avg = mean(ranked.map((m) => m.score));
  const v = verdict(ranked[0].score);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter" && filtered[active]) { e.preventDefault(); setSelected(filtered[active]); }
  };

  return (
    <section id="explorer" className="bg-bg2/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Species explorer" title="Choose any fish. See everything."
          sub="Search all 200 saltwater species. Each profile shows its tolerance for oxygen, temperature, pH and chlorophyll-a — and the best places to find it in the Bay of Bengal right now." />
        <Reveal>
          <div className="grid grid-cols-1 gap-5 [&>*]:min-w-0 lg:grid-cols-[340px_1fr]">
            {/* picker */}
            <div className="glass flex flex-col rounded-2xl p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
              <label htmlFor="fish-search" className="sr-only">Search fish</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input id="fish-search" role="combobox" aria-expanded="true" aria-controls="fish-list" aria-activedescendant={filtered[active] ? `fish-${filtered[active].slug}` : undefined}
                  value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} placeholder="Search by common or scientific name…"
                  className="focus-ring w-full rounded-xl border border-line bg-bg/60 py-3 pl-9 pr-3 text-sm placeholder:text-muted" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {QUICK.map((slug) => {
                  const s = species.find((x) => x.slug === slug)!;
                  return <button key={slug} onClick={() => setSelected(s)} className="focus-ring rounded-full border border-line px-2.5 py-1 text-xs text-muted transition hover:border-accent hover:text-fg">{s.name.replace(/ \(.*\)/, "")}</button>;
                })}
              </div>
              <label htmlFor="group" className="mt-3 text-xs text-muted">Group</label>
              <select id="group" value={group} onChange={(e) => { setGroup(e.target.value); setActive(0); }} className="focus-ring mt-1 rounded-xl border border-line bg-solid px-3 py-2.5 text-sm">
                <option>All</option>
                {groups.map((g) => <option key={g}>{g}</option>)}
              </select>
              <p className="mt-3 text-xs text-muted" aria-live="polite">{filtered.length} species</p>
              <ul id="fish-list" ref={listRef} role="listbox" aria-label="Fish species" className="scroll-thin mt-2 h-72 space-y-1 overflow-y-auto pr-1 lg:h-auto lg:min-h-0 lg:flex-1">
                {filtered.map((s, i) => (
                  <li key={s.id} id={`fish-${s.slug}`} data-i={i} role="option" aria-selected={s.id === selected.id}>
                    <button onClick={() => setSelected(s)} className={`focus-ring w-full rounded-lg px-3 py-2 text-left text-sm transition ${s.id === selected.id ? "bg-accent/15 text-fg ring-1 ring-accent/50" : i === active ? "bg-line" : "hover:bg-line"}`}>
                      <div className="truncate font-medium">{s.name}</div>
                      <div className="truncate text-xs italic text-muted">{s.scientific}</div>
                    </button>
                  </li>
                ))}
                {!filtered.length && <li className="px-3 py-6 text-center text-sm text-muted">No fish match “{q}”.</li>}
              </ul>
            </div>

            {/* profile */}
            <div className="min-w-0 space-y-5" aria-live="polite">
              <div className="glass rounded-2xl p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="accent">{selected.group}</Badge>
                  <Badge>{selected.zone}</Badge>
                  <Badge>{selected.productivity} waters</Badge>
                  {isModelled(selected) && <Badge tone="good">ML-modelled HSI</Badge>}
                  <span className="ml-auto text-xs text-muted">#{selected.id} of 200</span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{selected.name}</h3>
                <p className="mt-1 text-lg italic text-muted">{selected.scientific}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-line p-4">
                    <div className="text-xs uppercase tracking-wider text-muted">Best Bay of Bengal match</div>
                    <div className={`mt-1 font-display text-3xl font-bold ${v.cls}`}>{Math.round(ranked[0].score * 100)}%</div>
                    <div className="text-sm text-muted">{v.label}</div>
                  </div>
                  <div className="rounded-xl border border-line p-4">
                    <div className="text-xs uppercase tracking-wider text-muted">Average across area</div>
                    <div className="mt-1 font-display text-3xl font-bold">{Math.round(avg * 100)}%</div>
                    <div className="text-sm text-muted">{ranked.filter((m) => m.score >= 0.6).length} of {points.length} points ≥ 60%</div>
                  </div>
                  <div className="rounded-xl border border-line p-4">
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted"><Thermometer size={14} />Comfort zone</div>
                    <div className="mt-1 font-display text-3xl font-bold">{selected.temp[0]}–{selected.temp[1]}°C</div>
                    <div className="text-sm text-muted">{selected.zone} species</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <RangeGauge label="Dissolved oxygen" unit="mg/L" range={selected.do} scale={[3, 9.5]} fmt={(n) => n.toFixed(1)} />
                <RangeGauge label="Temperature" unit="°C" range={selected.temp} scale={[-2, 34]} marker={{ value: BOB_MEAN.sst, label: "BoB" }} />
                <RangeGauge label="pH" unit="" range={selected.ph} scale={[7.0, 8.6]} fmt={(n) => n.toFixed(1)} />
                <RangeGauge label="Chlorophyll-a" unit="mg/m³" range={selected.chl} scale={[0, 6.5]} marker={{ value: BOB_MEAN.chl, label: "BoB" }} fmt={(n) => String(n)} />
              </div>

              <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 xl:grid-cols-[1fr_1fr]">
                <div className="glass rounded-2xl p-5">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h4 className="font-display text-lg font-semibold">Where to find it</h4>
                    <button onClick={() => csv(selected)} className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs transition hover:border-accent">
                      <Download size={14} />CSV
                    </button>
                  </div>
                  <ol className="space-y-3">
                    {top.map((m, i) => (
                      <li key={m.point.id}>
                        <div className="flex items-baseline justify-between gap-2 text-sm">
                          <span className="min-w-0 truncate"><span className="mr-2 text-muted tabular-nums">{i + 1}.</span>{m.point.location}</span>
                          <span className={`tabular-nums ${verdict(m.score).cls}`}>{Math.round(m.score * 100)}%</span>
                        </div>
                        <div className="font-mono text-[11px] text-muted">{fmtCoord(m.point)} · {m.point.sst}°C · {m.point.chl} mg/m³</div>
                        <div className="mt-1"><Bar value={m.score} color={scoreColor(m.score)} /></div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 text-xs text-muted">{ranked[0].source === "model" ? "Scores from the Colab Random-Forest HSI model." : "Estimated by matching this species’ temperature and chlorophyll-a tolerance to each satellite point."}</p>
                </div>
                <div className="glass h-80 overflow-hidden rounded-2xl xl:h-auto xl:min-h-[420px]">
                  <OceanMap points={points} selectedId={top[0].point.id}
                    style={(p) => { const s = scoreById.get(p.id) ?? 0; return { color: scoreColor(s), radius: 4 + s * 7, opacity: 0.35 + s * 0.6, label: `${Math.round(s * 100)}% · ${p.location}` }; }} />
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h4 className="mb-3 font-display text-lg font-semibold">Similar habitat species</h4>
                <div className="flex flex-wrap gap-2">
                  {similar(selected).map((s) => (
                    <button key={s.id} onClick={() => setSelected(s)} className="focus-ring rounded-xl border border-line px-4 py-2 text-left text-sm transition hover:border-accent">
                      <div className="font-medium">{s.name}</div><div className="text-xs italic text-muted">{s.scientific}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

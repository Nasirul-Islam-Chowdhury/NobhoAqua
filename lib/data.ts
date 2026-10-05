import pointsRaw from "@/data/points.json";
import speciesRaw from "@/data/species.json";
import type { Match, OceanPoint, Species } from "./types";

export const points = pointsRaw as OceanPoint[];
export const species = speciesRaw as Species[];
export const groups = Array.from(new Set(species.map((s) => s.group)));
export const locations = Array.from(new Set(points.map((p) => p.location)));

export const MODEL = { hsiMse: 0.0031, habAccuracy: 79.17, algorithm: "Random Forest (100 trees)" };

/** Species with a dedicated Colab ML habitat-suitability output. */
const MODELLED: Record<string, "hsiHilsa" | "hsiTuna"> = {
  "hilsa-tenualosa-ilisha": "hsiHilsa",
  "yellowfin-tuna": "hsiTuna",
  "skipjack-tuna": "hsiTuna",
};
export const isModelled = (s: Species) => s.slug in MODELLED;

function rangeScore(v: number, [lo, hi]: [number, number], margin: number) {
  if (v >= lo && v <= hi) {
    const half = (hi - lo) / 2 || 1;
    // 1.0 at the centre of the tolerance range, 0.8 at its edge
    return 0.8 + 0.2 * (1 - Math.abs(v - (lo + hi) / 2) / half);
  }
  const d = v < lo ? lo - v : v - hi;
  return 0.75 * Math.max(0, 1 - d / margin);
}

/** Range-based suitability of a species at a satellite point (0–1). */
export function suitability(s: Species, p: OceanPoint): { score: number; source: Match["source"] } {
  const key = MODELLED[s.slug];
  if (key) return { score: p[key], source: "model" };
  const t = rangeScore(p.sst, s.temp, 4);
  const c = rangeScore(p.chl, s.chl, Math.max(0.5, s.chl[1] * 0.5));
  return { score: Math.pow(t, 0.6) * Math.pow(c, 0.4), source: "range" };
}

export function rankPointsFor(s: Species, list: OceanPoint[] = points): Match[] {
  return list
    .map((p) => ({ point: p, ...suitability(s, p) }))
    .sort((a, b) => b.score - a.score || b.point.pfz.length - a.point.pfz.length);
}

export function rankSpeciesAt(p: OceanPoint): { species: Species; score: number; source: Match["source"] }[] {
  return species
    .map((s) => ({ species: s, ...suitability(s, p) }))
    .sort((a, b) => b.score - a.score || a.species.id - b.species.id);
}

export function verdict(score: number) {
  if (score >= 0.8) return { label: "Excellent", cls: "text-good" };
  if (score >= 0.6) return { label: "Good", cls: "text-accent" };
  if (score >= 0.35) return { label: "Fair", cls: "text-warn" };
  return { label: "Poor", cls: "text-danger" };
}

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);

export function locationSummary(loc: string) {
  const ps = points.filter((p) => p.location === loc);
  const ranked = species
    .map((s) => ({ species: s, score: mean(ps.map((p) => suitability(s, p).score)) }))
    .sort((a, b) => b.score - a.score);
  return {
    name: loc,
    count: ps.length,
    sst: mean(ps.map((p) => p.sst)),
    chl: mean(ps.map((p) => p.chl)),
    salinity: mean(ps.map((p) => p.salinity)),
    depth: mean(ps.map((p) => p.depth)),
    high: ps.filter((p) => p.pfz === "High Density").length,
    critical: ps.filter((p) => p.hab === "CRITICAL RED TIDE ALERT").length,
    centre: [mean(ps.map((p) => p.lat)), mean(ps.map((p) => p.lon))] as [number, number],
    top: ranked.slice(0, 8),
  };
}

export function pearson(a: number[], b: number[]) {
  const ma = mean(a), mb = mean(b);
  let n = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) {
    n += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return n / Math.sqrt(da * db);
}

export const BOB_MEAN = { sst: mean(points.map((p) => p.sst)), chl: mean(points.map((p) => p.chl)) };

export const fmtCoord = (p: OceanPoint) => `${p.lat.toFixed(4)}°N, ${p.lon.toFixed(4)}°E`;

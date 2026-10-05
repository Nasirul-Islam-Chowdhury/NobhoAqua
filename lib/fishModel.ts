import type { Species } from "./types";

export type Archetype = "fusiform" | "deep" | "shark" | "flat" | "ray" | "eel" | "round";
export type TailKind = "lunate" | "forked" | "round" | "shark";

export interface Palette { back: string; belly: string; fin: string }
export interface FishSpec {
  arch: Archetype;
  L: number; H: number; W: number;          // body length, half-height, half-width
  snout: number; fat: number; taper: number; peduncle: number;
  tail: TailKind; tailLen: number; tailH: number;
  dorsal: { x: number; len: number; h: number } | null;
  anal: { x: number; len: number; h: number } | null;
  pectoral: number;
  eye: number;
  bill: number;                               // spear length (billfish)
  whip: number;                               // whip tail length (rays)
  topView: boolean;
  palette: Palette;
}

const has = (s: Species, rx: RegExp) => rx.test(s.name.toLowerCase());

export function archetypeOf(s: Species): Archetype {
  if (s.group === "Sharks") return "shark";
  if (has(s, /\bray\b|skate|stingray|torpedo|manta/)) return "ray";
  if (has(s, /halibut|flounder|\bsole\b|turbot|fluke/)) return "flat";
  if (has(s, /\beel\b|moray|conger|cornetfish|trumpetfish|needlefish|halfbeak/)) return "eel";
  if (has(s, /sunfish|puffer|porcupine|trunkfish|batfish|anglerfish|monkfish|goosefish/)) return "round";
  if (s.group === "Reef & Ornamental Fish" || has(s, /snapper|grouper|bream|sheepshead|scup|porgy|dentex|john dory|opah|pompano|permit|lookdown|tarpon|barramundi|seabass|sea bass|trout/)) return "deep";
  return "fusiform";
}

export function paletteOf(s: Species): Palette {
  const n = s.name.toLowerCase();
  const P = (back: string, belly: string, fin = back): Palette => ({ back, belly, fin });
  if (s.slug.startsWith("hilsa")) return P("#8fa8b8", "#f6f9fb", "#b8cad6");
  if (/yellowfin/.test(n)) return P("#1c4a85", "#e4edf5", "#f2c230");
  if (/tuna|marlin|sailfish|swordfish|wahoo|mackerel|mahi|dolphin/.test(n)) return P("#1f5a96", "#dfeaf3", "#3a86c8");
  if (/salmon/.test(n)) return P("#5d8299", "#f2b9a6", "#7aa0b5");
  if (/yellow|gold|amberjack|banded/.test(n)) return P("#e0aa1c", "#fff1bf", "#f0c94a");
  if (/red|snapper|coral trout|redfish|rockfish|squirrelfish|soldierfish|cardinal/.test(n)) return P("#c63a2d", "#f8cfc4", "#e0584a");
  if (/clown|orange|garibaldi/.test(n)) return P("#f26a1b", "#ffd9b5", "#ff8a3d");
  if (/blue|tang|damsel/.test(n)) return P("#2074d4", "#a9d3ff", "#4a9bf0");
  if (/green|parrot|moray/.test(n)) return P("#1f9a76", "#c0f2dc", "#46c49c");
  if (/black|drum|croaker/.test(n)) return P("#2a323b", "#8896a4", "#46525e");
  if (/sardine|pilchard|herring|anchov|menhaden|milkfish|mullet|ladyfish|silver|bluefish|trevally|jack|crevalle/.test(n)) return P("#4c7a98", "#f0f7fb", "#7fa5bd");
  if (s.group === "Sharks") return P("#6d7f8f", "#f1f5f8", "#8396a6");
  if (s.group === "Rays, Skates & Chimaeras") return P("#8d7656", "#ece3d1", "#a58d6b");
  if (s.group === "Cod & Flatfish") return P("#a48660", "#eadfc4", "#bda27a");
  if (s.group === "Deep-sea & Cold Water") return P("#323a66", "#5f6aa8", "#7b86cc");
  if (s.group === "Reef & Ornamental Fish") return P("#e06a8c", "#ffd1de", "#f48aa8");
  if (s.group === "Snappers, Groupers & Seabass") return P("#8a6a4c", "#e8d6c0", "#a88866");
  return P("#5f8a9c", "#eef5f7", "#86aab9");
}

export function specOf(s: Species): FishSpec {
  const arch = archetypeOf(s);
  const palette = paletteOf(s);
  const base: FishSpec = {
    arch, L: 3.2, H: 0.62, W: 0.46, snout: 0.82, fat: 0.62, taper: 0.45, peduncle: 0.1,
    tail: "lunate", tailLen: 0.9, tailH: 0.85,
    dorsal: { x: 0.34, len: 0.9, h: 0.5 }, anal: { x: 0.68, len: 0.5, h: 0.28 },
    pectoral: 0.5, eye: 0.1, bill: 0, whip: 0, topView: false, palette,
  };
  switch (arch) {
    case "deep":
      Object.assign(base, { L: 2.7, H: 0.98, W: 0.42, snout: 0.9, fat: 0.7, taper: 0.5, peduncle: 0.16, tail: "round", tailLen: 0.7, tailH: 0.7,
        dorsal: { x: 0.28, len: 1.3, h: 0.5 }, anal: { x: 0.62, len: 0.7, h: 0.35 }, pectoral: 0.55, eye: 0.12 });
      break;
    case "shark":
      Object.assign(base, { L: 3.6, H: 0.52, W: 0.5, snout: 0.62, fat: 0.58, taper: 0.5, peduncle: 0.1, tail: "shark", tailLen: 0.95, tailH: 1.0,
        dorsal: { x: 0.36, len: 0.7, h: 0.85 }, anal: { x: 0.74, len: 0.3, h: 0.2 }, pectoral: 0.85, eye: 0.055 });
      break;
    case "flat":
      Object.assign(base, { L: 2.7, H: 0.16, W: 0.95, snout: 0.9, fat: 0.7, taper: 0.4, peduncle: 0.18, tail: "round", tailLen: 0.5, tailH: 0.4,
        dorsal: null, anal: null, pectoral: 0, eye: 0.1, topView: true });
      break;
    case "ray":
      Object.assign(base, { L: 2.3, H: 0.2, W: 1.7, snout: 0.7, fat: 0.8, taper: 0.05, peduncle: 0.03, tail: "round", tailLen: 0.01, tailH: 0.01,
        dorsal: null, anal: null, pectoral: 0, eye: 0.08, whip: 1.7, topView: true });
      break;
    case "eel":
      Object.assign(base, { L: 4.1, H: 0.22, W: 0.22, snout: 0.9, fat: 0.4, taper: 0.35, peduncle: 0.38, tail: "round", tailLen: 0.35, tailH: 0.2,
        dorsal: { x: 0.2, len: 3, h: 0.14 }, anal: { x: 0.45, len: 2, h: 0.1 }, pectoral: 0.18, eye: 0.06 });
      break;
    case "round":
      Object.assign(base, { L: 1.9, H: 1.15, W: 0.7, snout: 1, fat: 0.55, taper: 0.4, peduncle: 0.3, tail: "round", tailLen: 0.5, tailH: 0.9,
        dorsal: { x: 0.55, len: 0.6, h: 0.9 }, anal: { x: 0.55, len: 0.6, h: 0.8 }, pectoral: 0.4, eye: 0.11 });
      break;
  }
  const n = s.name.toLowerCase();
  if (/marlin|sailfish/.test(n)) { base.bill = 1.1; base.dorsal = { x: 0.28, len: /sailfish/.test(n) ? 1.9 : 1.0, h: /sailfish/.test(n) ? 1.0 : 0.6 }; }
  if (/swordfish/.test(n)) { base.bill = 1.3; base.dorsal = { x: 0.3, len: 0.8, h: 0.7 }; }
  if (s.group === "Deep-sea & Cold Water") base.eye = Math.max(base.eye, 0.15);
  if (/seahorse|seadragon/.test(n)) { base.arch = "eel"; }
  return base;
}

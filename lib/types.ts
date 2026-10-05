export type PfzClass = "High Density" | "Medium";
export type HabAlert = "CRITICAL RED TIDE ALERT" | "Moderate Warning" | "Normal Health";

export interface OceanPoint {
  id: number;
  lat: number;
  lon: number;
  location: string;
  sst: number;
  chl: number;
  salinity: number;
  depth: number;
  hsiHilsa: number;
  hsiTuna: number;
  hsiShrimp: number;
  pfz: PfzClass;
  hab: HabAlert;
}

export type Range = [number, number];

export interface Species {
  id: number;
  slug: string;
  name: string;
  scientific: string;
  group: string;
  zone: "Polar" | "Cold-water" | "Temperate" | "Subtropical" | "Tropical";
  productivity: "Oligotrophic" | "Mesotrophic" | "Eutrophic";
  do: Range;
  temp: Range;
  ph: Range;
  chl: Range;
}

export interface Match {
  point: OceanPoint;
  score: number;
  source: "model" | "range";
}

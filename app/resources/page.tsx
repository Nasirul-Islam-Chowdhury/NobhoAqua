import { ArrowUpRight, Database, Leaf, Satellite, Thermometer, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Reveal, SectionHead } from "@/components/Reveal";

export const metadata = { title: "Datasets & Resources | NobhoAqua", description: "NASA datasets, portals and the Google Colab notebook behind NobhoAqua." };

interface Res { name: string; blurb: string; url: string }
interface Dataset { n: string; icon: LucideIcon; title: string; unit?: string; provides: string; links: Res[] }

const DATASETS: Dataset[] = [
  {
    n: "01", icon: Thermometer, title: "NASA MODIS-Aqua Sea Surface Temperature (SST)", unit: "°C",
    provides: "Daily ocean-surface temperature at ~9 km resolution — the key signal for locating thermal fronts where fish gather.",
    links: [
      { name: "NASA OceanColor Main Portal", blurb: "Gateway to NASA ocean-colour and SST data and documentation.", url: "https://www.earthdata.nasa.gov/topics/ocean/ocean-color" },
      { name: "NASA PO.DAAC MODIS Aqua SST Dataset", blurb: "MODIS Aqua Level-3 daily 9 km daytime thermal SST (v2019.0).", url: "https://podaac.jpl.nasa.gov/dataset/MODIS_AQUA_L3_SST_THERMAL_DAILY_9KM_DAYTIME_V2019.0" },
    ],
  },
  {
    n: "02", icon: Leaf, title: "NASA MODIS-Aqua Chlorophyll-a Concentration", unit: "mg/m³",
    provides: "Chlorophyll-a is a proxy for phytoplankton — the base of the marine food chain and an early indicator of algal blooms.",
    links: [
      { name: "NASA OceanColor L3 Chlorophyll Data Access", blurb: "Browse and download Level-3/4 ocean-colour products.", url: "https://www.earthdata.nasa.gov/data/tools/ocean-color-level-3-4-browser" },
      { name: "NASA Earthdata Search", blurb: "Search every NASA Earth science dataset in one place.", url: "https://search.earthdata.nasa.gov/" },
    ],
  },
  {
    n: "03", icon: Satellite, title: "NASA Landsat 8/9 — OLI & Thermal Infrared Sensor (TIRS)", unit: "30 m optical · 100 m thermal",
    provides: "High-resolution optical and thermal imagery for coastlines, estuaries, ponds and aquaculture farms.",
    links: [
      { name: "USGS / NASA EarthExplorer Portal", blurb: "Search and download Landsat scenes.", url: "https://earthexplorer.usgs.gov/" },
      { name: "NASA GIBS Imagery Tiles Service", blurb: "Global Imagery Browse Services — ready-to-use map tiles for web maps.", url: "https://gibs.earthdata.nasa.gov/" },
    ],
  },
  {
    n: "04", icon: Zap, title: "NASA POWER Agroclimatology & Ocean API",
    provides: "Solar, meteorological and agroclimatic parameters through a simple API — useful context for farm and coastal conditions.",
    links: [{ name: "NASA POWER API Portal", blurb: "Prediction Of Worldwide Energy Resources: docs, data viewer and API.", url: "https://power.larc.nasa.gov/" }],
  },
];

const COLAB = "https://colab.research.google.com/drive/1ct7vcpaB00IU3G04UcqEgMDCWnaUF4Sq?usp=sharing";

function Ext({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`focus-ring group inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${primary ? "bg-gradient-to-r from-accent to-accent2 text-ink shadow-[0_0_28px_var(--glow)] hover:brightness-110" : "border border-line hover:border-accent"}`}>
      {children}<ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Resources() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[1000] border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" className="logo-mark h-9 w-auto" />
            <span className="font-display text-lg font-bold">Nobho<span className="text-accent">Aqua</span></span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/guide" className="focus-ring hidden rounded-lg px-3 py-2 text-muted hover:text-fg sm:block">User Manual</Link>
            <Link href="/dashboard" className="focus-ring rounded-xl border border-line px-4 py-2 hover:border-accent">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6">
        <div className="relative mb-14 overflow-hidden rounded-3xl border border-line px-6 py-14 sm:px-12">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_80%_0%,var(--glow),transparent),radial-gradient(40%_60%_at_0%_100%,rgba(45,212,191,0.14),transparent)]" />
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted"><Database size={14} className="text-accent" />Datasets & Resources</span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">The open data behind <span className="text-grad">NobhoAqua</span></h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">Every dataset below is free and publicly available from NASA and USGS. Use these links to explore the sources, download the raw data, and reproduce our analysis.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Ext href={COLAB} primary>Open our Google Colab</Ext>
            <a href="#datasets" className="focus-ring rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:border-accent">Browse datasets</a>
          </div>
        </div>

        <section id="datasets">
          <SectionHead eyebrow="NASA & USGS data" title="Four sources, one picture of the ocean" />
          <div className="grid gap-5 lg:grid-cols-2">
            {DATASETS.map((d, i) => (
              <Reveal key={d.n} delay={(i % 2) * 0.08}>
                <article className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition hover:border-accent/60 sm:p-8">
                  <div aria-hidden className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition group-hover:bg-accent/20" />
                  <span aria-hidden className="absolute right-6 top-4 font-display text-6xl font-bold text-line">{d.n}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-ink shadow-[0_0_28px_var(--glow)]"><d.icon size={22} /></span>
                  <h2 className="mt-5 pr-12 font-display text-xl font-semibold leading-snug sm:text-2xl">{d.title}</h2>
                  {d.unit && <p className="mt-2 inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">{d.unit}</p>}
                  <p className="mt-4 text-sm leading-relaxed text-muted">{d.provides}</p>
                  <ul className="mt-6 space-y-3">
                    {d.links.map((l) => (
                      <li key={l.url}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer" className="focus-ring group/l flex items-start justify-between gap-3 rounded-2xl border border-line bg-bg/40 p-4 transition hover:border-accent">
                          <span className="min-w-0">
                            <span className="block font-medium">{l.name}</span>
                            <span className="mt-0.5 block text-sm text-muted">{l.blurb}</span>
                            <span className="mt-1.5 block truncate font-mono text-[11px] text-accent/80">{l.url.replace(/^https:\/\//, "")}</span>
                          </span>
                          <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-accent transition group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="colab" className="mt-20">
          <Reveal>
            <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
              <div aria-hidden className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-accent2/15 blur-3xl" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Our analysis</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">The Google Colab notebook</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">This is the notebook we used to prepare the Bay of Bengal ocean dataset and train the models. It extracts the dataset, trains a Random-Forest model for habitat suitability (HSI) and another for algal-bloom alerts, and draws the correlation, fishing-zone, HSI and bloom charts you see in the dashboard.</p>
              <ul className="mt-5 grid gap-2 text-sm text-muted sm:grid-cols-2">
                {["Reads the ocean dataset (SST, chlorophyll-a, salinity, depth)", "Random-Forest regression for HSI (MSE 0.0031)", "Random-Forest classifier for bloom alerts (79.17% accuracy)", "Interactive Plotly maps and charts"].map((t) => (
                  <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t}</li>
                ))}
              </ul>
              <div className="mt-7"><Ext href={COLAB} primary>Open in Google Colab</Ext></div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}

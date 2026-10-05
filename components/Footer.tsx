import { ArrowRight, ArrowUpRight, Database, Fish, ShieldAlert, Waves } from "lucide-react";
import Link from "next/link";
import { MODEL, points } from "@/lib/data";

const PLATFORM = [
  ["Ocean GIS Heatmap", "/dashboard#gis"],
  ["Species HSI Predictor", "/dashboard#hsi"],
  ["Algal Bloom Monitor", "/dashboard#farm"],
  ["Log in", "/login"],
  ["Sign up", "/signup"],
];
const EXPLORE = [
  ["Mission & Vision", "/#mission"],
  ["About the project", "/#about"],
  ["User Manual (Storybook)", "/guide"],
  ["Meet the team", "/#team"],
  ["Datasets & Resources", "/resources"],
];
const SOURCES = [
  ["MODIS-Aqua SST", "https://podaac.jpl.nasa.gov/dataset/MODIS_AQUA_L3_SST_THERMAL_DAILY_9KM_DAYTIME_V2019.0"],
  ["MODIS-Aqua Chlorophyll-a", "https://www.earthdata.nasa.gov/data/tools/ocean-color-level-3-4-browser"],
  ["Landsat 8/9 · EarthExplorer", "https://earthexplorer.usgs.gov/"],
  ["NASA GIBS", "https://gibs.earthdata.nasa.gov/"],
  ["NASA POWER API", "https://power.larc.nasa.gov/"],
  ["Our Google Colab", "https://colab.research.google.com/drive/1ct7vcpaB00IU3G04UcqEgMDCWnaUF4Sq?usp=sharing"],
];

const stats = [
  { icon: Fish, v: "200", l: "saltwater species" },
  { icon: Waves, v: String(points.length), l: "satellite grid points" },
  { icon: ShieldAlert, v: `${MODEL.habAccuracy}%`, l: "bloom-alert accuracy" },
  { icon: Database, v: "5", l: "open NASA / USGS sources" },
];

const head = "text-xs font-semibold uppercase tracking-[0.18em] text-accent";
const link = "focus-ring inline-flex items-center gap-1 rounded text-sm text-muted transition hover:text-fg";

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line bg-bg2/70">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_0%,var(--glow),transparent),radial-gradient(40%_50%_at_0%_100%,rgba(45,212,191,0.10),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        {/* CTA band */}
        <div className="glass flex flex-col items-start justify-between gap-5 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Ready to read the ocean from space?</h2>
            <p className="mt-2 max-w-xl text-muted">Open the dashboard with a free demo account and explore fishing zones, 200 fish species and algal-bloom alerts.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 px-6 py-3 font-semibold text-ink shadow-[0_0_30px_var(--glow)] hover:brightness-110">
              Get started <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link href="/guide" className="focus-ring rounded-xl border border-line px-6 py-3 font-medium hover:border-accent">Read the guide</Link>
          </div>
        </div>

        {/* stats */}
        <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="flex items-center gap-4 rounded-2xl border border-line p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><s.icon size={20} /></span>
              <div><dd className="font-display text-2xl font-bold tabular-nums">{s.v}</dd><dt className="text-xs text-muted">{s.l}</dt></div>
            </div>
          ))}
        </dl>

        {/* link columns */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="focus-ring flex w-fit items-center gap-3 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt="" className="logo-mark h-14 w-auto" />
              <span className="font-display text-3xl font-bold tracking-tight">Nobho<span className="text-accent">Aqua</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">NASA Earth-observation intelligence for coastal fisheries, aquaculture and space bio-research. Developed by <b className="text-fg">Team NobhoJol</b> for the NASA Space Apps Challenge — <i>Field Shift: Adapting Farms with NASA Data</i>.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["UN SDG 14 · Life Below Water", "Bay of Bengal", "Open data"].map((t) => <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{t}</span>)}
            </div>
          </div>
          <nav aria-label="Platform"><h3 className={head}>Platform</h3><ul className="mt-4 space-y-2.5">{PLATFORM.map(([l, h]) => <li key={h}><Link href={h} className={link}>{l}</Link></li>)}</ul></nav>
          <nav aria-label="Explore"><h3 className={head}>Explore</h3><ul className="mt-4 space-y-2.5">{EXPLORE.map(([l, h]) => <li key={h}><Link href={h} className={link}>{l}</Link></li>)}</ul></nav>
          <nav aria-label="Data sources"><h3 className={head}>Data & sources</h3>
            <ul className="mt-4 space-y-2.5">{SOURCES.map(([l, h]) => <li key={h}><a href={h} target="_blank" rel="noopener noreferrer" className={link}>{l}<ArrowUpRight size={13} /></a></li>)}</ul>
          </nav>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-line py-7 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} NobhoAqua · Team NobhoJol. Built for the NASA Space Apps Challenge.</p>
          <p className="max-w-xl md:text-right">Powered by NASA MODIS & Landsat data. Estimates support — not replace — local knowledge and fishing regulations. Demo accounts are stored only in your browser.</p>
        </div>
      </div>
    </footer>
  );
}

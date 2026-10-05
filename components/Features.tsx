import { ArrowRight, Fish, Map as MapIcon, Waves } from "lucide-react";
import Link from "next/link";
import { Reveal, SectionHead } from "./Reveal";

const F = [
  { icon: MapIcon, tag: "Module 1", title: "Ocean Heatmap & Fishing Zones", body: "Switch between sea-temperature, chlorophyll-a, fishing-zone and algal-alert layers. Click any point for coordinates, ocean metrics and likely species.", tab: "gis" },
  { icon: Fish, tag: "Module 2", title: "Species Habitat Suitability Predictor", body: "Choose any of 200 saltwater species to see its oxygen, temperature, pH and chlorophyll tolerance, plus the best places to find it and a downloadable spreadsheet of coordinates.", tab: "hsi" },
  { icon: Waves, tag: "Module 3", title: "Aquaculture & Algal Bloom Monitor", body: "A Random-Forest early-warning model flags critical red-tide risk 24–48 hours ahead, with area-by-area water health for farms.", tab: "farm" },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Platform" title="Three tools. One decision dashboard."
        sub="Create a free demo account to open the dashboard and explore NASA-derived data for the Bay of Bengal." />
      <div className="grid grid-cols-1 gap-5 [&>*]:min-w-0 md:grid-cols-3">
        {F.map((f, i) => (
          <Reveal key={f.tab} delay={i * 0.08}>
            <Link href={`/dashboard#${f.tab}`} className="focus-ring glass group relative block h-full overflow-hidden rounded-3xl p-7 transition hover:-translate-y-1 hover:border-accent">
              <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/15 blur-3xl transition group-hover:bg-accent/25" />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-ink"><f.icon size={22} /></span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-accent">{f.tag}</p>
              <h3 className="mt-1 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Open in dashboard <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

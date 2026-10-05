import { Compass, Cpu, Database, Eye, Satellite, Target } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

const mv = [
  {
    id: "mission", icon: Target, title: "Our Mission",
    body: "Our mission at Team NobhoJol is to empower coastal fisheries and space bio-research through the NobhoAqua Portal by seamlessly transforming raw satellite data into actionable marine intelligence. By leveraging NASA MODIS-Aqua for Sea Surface Temperature (SST) and Chlorophyll-a concentrations, Landsat 8/9 for high-resolution thermal and optical coastal mapping via USGS EarthExplorer & GIBS, and the NASA POWER API for real-time agroclimatic ocean analytics, we optimize fishing zone predictions (PFZ) to reduce fuel waste on Earth, while providing data-driven modeling for closed-loop microgravity aquaculture in space.",
  },
  {
    id: "vision", icon: Eye, title: "Our Vision",
    body: "To pioneer a sustainable future for aquatic life on Earth and beyond by revolutionizing marine ecosystem intelligence and enabling extraterrestrial aquaculture through NASA Space Technology.",
  },
];

const steps = [
  { icon: Satellite, t: "Observe", d: "NASA MODIS-Aqua supplies sea-surface temperature and chlorophyll-a; Landsat 8/9 adds high-resolution coastal detail." },
  { icon: Database, t: "Calibrate", d: "Species tolerance ranges for 200 fish — oxygen, temperature, pH and chlorophyll-a — anchor every prediction." },
  { icon: Cpu, t: "Predict", d: "Random-Forest models estimate habitat suitability (HSI) and 24–48 h algal-bloom risk for every grid point." },
  { icon: Compass, t: "Decide", d: "Maps, rankings and alerts turn predictions into practical guidance at sea and at the farm." },
];

const challenge: [string, string][] = [
  ["Project", "NobhoAqua — developed by Team NobhoJol"],
  ["Theme", "Earth Science, Climate Adaptation, Ecosystem Resilience and Agricultural Decision Support"],
  ["Core Subjects", "Earth Science, Software"],
  ["Sub Subjects", "Satellite Remote Sensing, Marine Data Analytics, Precision Fisheries & Aquaculture, Water Quality Management, Interactive Web Visualization"],
  ["Goal", "To give coastal fisheries, aquaculturists and space bio-researchers an interactive, data-driven decision-support tool built on NASA Earth Observation data — so they can adapt to a changing climate, use resources wisely, and simulate closed-loop aquaculture for long-term sustainability."],
];

const audienceFacts: [string, string][] = [
  ["Age Range", "15+ years — high school students, university undergraduates, researchers and industry professionals."],
  ["Who It’s For", "Traditional fishermen, commercial aquaculture farm managers, marine biologists & researchers, space life scientists and climate-resilience policy makers."],
  ["Educational Use", "Ideal for courses in Fisheries Science, Marine Biology, Oceanography, Remote Sensing, Machine Learning and Space Microgravity Biology."],
  ["Global Appeal", "Addresses climate change adaptation, marine ecosystem preservation, lower carbon footprints in fisheries, UN SDG 14 (Life Below Water), and NASA’s Artemis & Mars exploration missions."],
];

const sources = ["NASA MODIS-Aqua", "Landsat 8/9", "NASA POWER API", "USGS EarthExplorer", "NASA GIBS"];

function InfoCard({ title, subtitle, rows }: { title: string; subtitle?: string; rows: [string, string][] }) {
  return (
    <article className="rounded-2xl border border-accent2/30 bg-solid/80 p-7 shadow-[0_0_50px_var(--glow)] backdrop-blur sm:p-9">
      <h3 className="font-display text-3xl font-bold text-accent2">{title}</h3>
      {subtitle && <p className="mt-1 text-base font-medium text-danger">{subtitle}</p>}
      <div className="my-5 h-px bg-accent2/30" />
      <div className="space-y-4">
        {rows.map(([k, v]) => (
          <p key={k} className="text-base leading-relaxed text-fg/90"><b className="text-accent2">{k}:</b> {v}</p>
        ))}
      </div>
    </article>
  );
}

export function MissionVisionAbout() {
  return (
    <>
      <section id="mission" className="bg-bg2/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="Mission & vision" title="Why we built NobhoAqua" />
          <div className="grid grid-cols-1 gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
            {mv.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.1}>
                <article id={c.id} className="glass relative h-full overflow-hidden rounded-3xl p-8 sm:p-10">
                  <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-ink shadow-[0_0_30px_var(--glow)]"><c.icon size={26} /></span>
                  <h3 className="mt-6 font-display text-2xl font-bold sm:text-3xl">{c.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{c.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHead eyebrow="About" title="NobhoAqua by Team NobhoJol"
          sub="An interactive, data-driven decision-support tool built on NASA Earth Observation datasets (MODIS-Aqua SST & Chlorophyll-a, Landsat 8/9 and the NASA POWER API) alongside localized aquatic, soil and species parameters. It helps coastal fisheries, aquaculturists and space bio-researchers adapt to changing climatic conditions, optimize resource usage, and simulate closed-loop aquaculture for long-term sustainability." />

        <div className="grid grid-cols-1 gap-5 [&>*]:min-w-0 lg:grid-cols-2">
          <Reveal><InfoCard title="The Challenge" subtitle="Field Shift: Adapting Farms with NASA Data" rows={challenge} /></Reveal>
          <Reveal delay={0.1}><InfoCard title="Target Audience" rows={audienceFacts} /></Reveal>
        </div>

        <Reveal>
          <div className="glass mt-5 flex flex-wrap items-center gap-3 rounded-2xl p-5">
            <h3 className="mr-2 text-xs font-semibold uppercase tracking-wider text-accent">Data sources</h3>
            {sources.map((a) => <span key={a} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm text-accent">{a}</span>)}
          </div>
        </Reveal>

        <h3 className="mb-4 mt-14 font-display text-xl font-semibold">How it works</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="flex items-center justify-between"><s.icon className="text-accent" size={24} /><span className="font-display text-sm text-muted">0{i + 1}</span></div>
                <h4 className="mt-4 font-display text-lg font-semibold">{s.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

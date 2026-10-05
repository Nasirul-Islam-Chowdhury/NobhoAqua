import { Brain, Compass, Database, Globe2, Layers, Rocket, Satellite, type LucideIcon } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

type Status = "done" | "active" | "planned";
interface Step { icon: LucideIcon; title: string; body: string; status: Status; tags?: string[] }

const STEPS: Step[] = [
  { icon: Compass, status: "done", title: "Challenge & research",
    body: "Chose the NASA Space Apps challenge “Field Shift: Adapting Farms with NASA Data” and studied how changing ocean conditions affect fishers and aquaculture farms in the Bay of Bengal.",
    tags: ["Problem framing", "Literature"] },
  { icon: Database, status: "done", title: "Species knowledge base",
    body: "Compiled the comfortable oxygen, temperature, pH and chlorophyll-a ranges of 200 saltwater species into one searchable table.",
    tags: ["200 species"] },
  { icon: Satellite, status: "done", title: "Satellite-derived ocean dataset",
    body: "Prepared the Bay of Bengal dataset: 119 grid points across the Sundarbans Estuary, Meghna River Mouth and Kuakata Offshore, with temperature, chlorophyll-a, salinity and depth.",
    tags: ["119 points", "3 areas"] },
  { icon: Brain, status: "done", title: "Machine-learning models",
    body: "Trained Random-Forest models in Google Colab: one for Habitat Suitability Index (mean squared error 0.0031) and one for algal-bloom alerts (79.17% accuracy).",
    tags: ["Google Colab", "Random Forest"] },
  { icon: Layers, status: "done", title: "NobhoAqua web platform",
    body: "Built the dashboard with the ocean heatmap, species predictor with 3D fish and algal-bloom monitor — plus the storybook user manual, datasets page and demo accounts.",
    tags: ["Next.js", "3D", "Maps"] },
  { icon: Rocket, status: "active", title: "Launch & user feedback",
    body: "Publish the platform, share it with fishers, farmers and researchers, and collect feedback to refine the guidance and wording.",
    tags: ["Deployment", "Feedback"] },
  { icon: Globe2, status: "planned", title: "Live NASA data",
    body: "Replace the static dataset with automatic updates from NASA ocean-colour, temperature and Prediction Of Worldwide Energy Resources services, and widen the map beyond the current three areas.",
    tags: ["Automation"] },
  { icon: Compass, status: "planned", title: "Space aquaculture simulator",
    body: "Model closed-loop aquaculture for microgravity research, connecting our water-quality science to NASA’s deep-space missions.",
    tags: ["Artemis", "Mars"] },
  { icon: Layers, status: "planned", title: "Seasons, Bangla & real accounts",
    body: "Add breeding and migration calendars per species, a Bangla language option for fishers, and secure accounts that save favourite locations.",
    tags: ["Accessibility"] },
];

const BADGE: Record<Status, { label: string; cls: string }> = {
  done: { label: "Completed", cls: "border-good/50 bg-good/10 text-good" },
  active: { label: "In progress", cls: "border-accent/60 bg-accent/10 text-accent" },
  planned: { label: "Planned", cls: "border-line text-muted" },
};

export function Timeline() {
  return (
    <section id="timeline" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Project timeline" title="From challenge to launch — and beyond"
        sub="How NobhoAqua grew from a NASA Space Apps challenge into a working decision-support platform, and where we are heading next." />
      <ol className="relative mx-auto max-w-5xl">
        <div aria-hidden className="absolute bottom-0 left-[1.15rem] top-2 w-0.5 bg-gradient-to-b from-accent via-accent2/50 to-transparent md:left-1/2 md:-translate-x-1/2" />
        {STEPS.map((s, i) => {
          const b = BADGE[s.status], right = i % 2 === 1;
          return (
            <li key={s.title} className={`relative pb-8 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-x-16 md:pl-0 ${i > 0 ? "md:-mt-24" : ""}`}>
              <span aria-hidden className={`absolute left-0 top-1 z-10 grid h-10 w-10 place-items-center rounded-full border-2 md:left-1/2 md:-translate-x-1/2 ${s.status === "planned" ? "border-dashed border-line bg-bg text-muted" : "border-accent bg-bg text-accent shadow-[0_0_24px_var(--glow)]"} ${s.status === "active" ? "pulse-ring" : ""}`}>
                <s.icon size={18} />
              </span>
              <Reveal className={right ? "md:col-start-2" : "md:col-start-1"}>
                <article className={`glass rounded-2xl p-5 sm:p-6 ${s.status === "planned" ? "border-dashed" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-sm font-semibold text-muted">Phase {String(i + 1).padStart(2, "0")}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${b.cls}`}>{b.label}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                  {s.tags && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {s.tags.map((t) => <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{t}</li>)}
                    </ul>
                  )}
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

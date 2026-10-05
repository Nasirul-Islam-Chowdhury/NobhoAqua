import { Check } from "lucide-react";
import Image from "next/image";
import { Reveal, SectionHead } from "./Reveal";

interface Goal {
  n: number; img: string; title: string; color: string; role: "Primary" | "Secondary";
  summary: string; targets: string; points: string[];
}

const GOALS: Goal[] = [
  {
    n: 14, img: "/sdg/sdg-14.png", title: "Life Below Water", color: "#0a97d9", role: "Primary",
    summary: "Conserve and sustainably use the oceans, seas and marine resources.",
    targets: "Targets 14.2 · 14.4 · 14.a",
    points: [
      "Shows where fish are likely to be, so fishers stop searching blindly and take fewer, better-planned trips.",
      "Gives the comfortable habitat range of 200 species, supporting informed, sustainable harvesting decisions.",
      "Flags harmful algal blooms early to protect marine and coastal ecosystems.",
      "Turns open NASA satellite science into practical marine knowledge anyone can use.",
    ],
  },
  {
    n: 2, img: "/sdg/sdg-2.png", title: "Zero Hunger", color: "#dda63a", role: "Secondary",
    summary: "End hunger and promote sustainable food production.",
    targets: "Targets 2.3 · 2.4",
    points: ["Helps small-scale fishers and farmers catch and harvest more reliably.", "Protects fish stocks and ponds that feed coastal communities."],
  },
  {
    n: 13, img: "/sdg/sdg-13.png", title: "Climate Action", color: "#3f7e44", role: "Secondary",
    summary: "Take urgent action to combat climate change and its impacts.",
    targets: "Targets 13.1 · 13.3",
    points: ["Helps fishing and farming adapt as ocean temperature and plankton patterns shift.", "Cuts wasted fuel on fruitless searches, lowering emissions."],
  },
  {
    n: 6, img: "/sdg/sdg-6.png", title: "Clean Water and Sanitation", color: "#26bde2", role: "Secondary",
    summary: "Ensure availability and sustainable management of water.",
    targets: "Targets 6.3 · 6.6",
    points: ["Monitors water quality and bloom risk for coastal and aquaculture waters.", "Gives early warning before oxygen drops and water turns harmful."],
  },
];

function GoalCard({ g, big = false }: { g: Goal; big?: boolean }) {
  return (
    <article className="glass relative h-full overflow-hidden rounded-3xl p-6 sm:p-8" style={{ borderColor: `${g.color}66` }}>
      <div aria-hidden className="absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl" style={{ background: `${g.color}33` }} />
      <div className={`relative flex gap-5 ${big ? "flex-col sm:flex-row sm:items-start" : "items-center"}`}>
        <Image src={g.img} alt={`Sustainable Development Goal ${g.n}: ${g.title}`} width={273} height={273}
          className={`${big ? "h-40 w-40 sm:h-48 sm:w-48" : "h-24 w-24"} shrink-0 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,.35)]`} />
        <div className="min-w-0">
          <span className="inline-block rounded-full px-3 py-0.5 text-xs font-extrabold uppercase tracking-widest text-white" style={{ background: g.color }}>{g.role} goal</span>
          <h3 className={`mt-2 font-display font-bold leading-tight ${big ? "text-3xl sm:text-4xl" : "text-xl"}`}>Goal {g.n} · {g.title}</h3>
          <p className="mt-1 text-sm text-muted">{g.summary}</p>
        </div>
      </div>
      <h4 className="relative mt-6 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: g.color }}>How NobhoAqua helps</h4>
      <ul className={`relative mt-3 ${big ? "grid gap-x-10 gap-y-3 md:grid-cols-2" : "space-y-2.5"}`}>
        {g.points.map((p) => (
          <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-fg/90">
            <Check size={16} className="mt-0.5 shrink-0" style={{ color: g.color }} />{p}
          </li>
        ))}
      </ul>
      <p className="relative mt-5 text-xs font-semibold text-muted">{g.targets}</p>
    </article>
  );
}

export function SdgSection() {
  const [primary, ...secondary] = GOALS;
  return (
    <section id="sdg" className="bg-bg2/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Sustainable Development Goals" title="Where NobhoAqua meets the Global Goals"
          sub="Our work is aimed squarely at United Nations Sustainable Development Goal 14, and supports three more along the way." />
        <Reveal><GoalCard g={primary} big /></Reveal>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 [&>*]:min-w-0">
          {secondary.map((g, i) => <Reveal key={g.n} delay={i * 0.08}><GoalCard g={g} /></Reveal>)}
        </div>
        <p className="mt-6 text-xs text-muted">Sustainable Development Goal names and icons belong to the United Nations. Target numbers refer to the official 2030 Agenda.</p>
      </div>
    </section>
  );
}

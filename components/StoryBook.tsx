"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { StoryScene } from "./StoryScene";

interface Chapter {
  id: string;
  title: string;
  scene: Parameters<typeof StoryScene>[0]["scene"];
  story: ReactNode;
  steps?: string[];
  tip?: string;
}

const B = ({ children }: { children: ReactNode }) => <b className="text-fg">{children}</b>;

const CH: Chapter[] = [
  {
    id: "cover", title: "The Tale of Rahim and the Silver Tide", scene: "cover",
    story: <><p>Welcome aboard. This is the user manual for <B>NobhoAqua</B>, told as a story.</p><p>Follow Rahim, a young fisher from the edge of the Sundarbans, as he learns to read the sea from space — and you will learn every feature of the platform along the way.</p><p>Turn the page with the arrows, your keyboard’s ← → keys, or jump to any chapter from the list below.</p></>,
  },
  {
    id: "account", title: "Chapter 1 · A Name on the Boat", scene: "shore",
    story: <><p>Rahim’s father always said, “Go where the fish are.” But some mornings the net came back nearly empty, and the diesel was gone.</p><p>One evening a cousin showed him NobhoAqua. “It uses NASA satellites,” she said. “First, make an account.”</p></>,
    steps: ["Press <b>Sign up</b> in the top bar of the home page.", "Enter your name, email and a password (at least 6 characters), then <b>Create account</b>.", "Just exploring? Choose <b>Continue with demo account</b> to enter instantly.", "Already registered? Use <b>Log in</b>. You land on your dashboard."],
    tip: "This is a demo: accounts are saved only in your own browser. Don’t reuse a real password.",
  },
  {
    id: "map", title: "Chapter 2 · The Sea Seen from the Sky", scene: "satellite",
    story: <><p>Next morning the dashboard opened on the <B>Ocean Heatmap & Fishing Zone Map</B>. A satellite, high above, had measured the water — its warmth, and the green dust of tiny plants that fish love to eat.</p><p>Each dot on the map was a place the satellite had checked. Rahim touched the buttons above the map and the sea changed colour.</p></>,
    steps: ["Open the <b>Ocean Heatmap & Fishing Zone Map</b> tab.", "Choose a layer: <b>Fishing zones</b>, <b>Sea temperature</b>, <b>Chlorophyll-a</b> or <b>Algal alerts</b>.", "Tap any dot. The panel on the right shows its coordinates, temperature, chlorophyll, salinity, depth and likely species.", "Scroll your mouse wheel, pinch, or use + / − to zoom; drag to move the map."],
    tip: "Cyan dots are high-density fishing zones; purple are medium. Bigger dots mean better hilsa conditions.",
  },
  {
    id: "fish", title: "Chapter 3 · Which Fish Lives Here?", scene: "net",
    story: <><p>“But what will I actually catch?” Rahim wondered. So he opened the <B>Species Habitat Suitability Predictor</B> — a library of 200 saltwater fish.</p><p>He typed “hilsa”. At once the page showed what hilsa need to be happy: how much oxygen, how warm, how salty-sweet the water should be — and where in the bay that matched best.</p></>,
    steps: ["Open the <b>Species Habitat Suitability Predictor</b> tab.", "Search by common or scientific name, or use the quick-pick chips and the <b>Group</b> filter. Arrow keys + Enter also work.", "Read the four gauges: oxygen, temperature, pH and chlorophyll-a. The <i>BoB</i> marker is the Bay of Bengal average.", "See <b>Where to find it</b>: the top 10 places with a match percentage. Press <b>Download coordinates</b> to save them as a spreadsheet file.", "Explore <b>Similar habitat species</b> for alternatives."],
    tip: "Hilsa and tuna scores come from the machine-learning model. Other species are estimated by matching temperature and chlorophyll to their comfort ranges.",
  },
  {
    id: "where", title: "Chapter 4 · Where Should I Cast?", scene: "cast",
    story: <><p>Rahim reversed the question. Instead of choosing a fish, he chose a <B>place</B> — the Meghna River Mouth, where his uncle fished.</p><p>The <B>Where can I get which fish</B> section listed the species that suit that water best, from most to least likely.</p></>,
    steps: ["Scroll to <b>Where can I get which fish?</b> below the species explorer.", "Read the three area cards: Sundarbans Estuary, Meghna River Mouth, Kuakata Offshore.", "Tap any point on the map to rank all fish for that exact spot.", "Narrow the list with <b>Fish group</b> and the <b>Minimum suitability</b> slider."],
    tip: "Percentages: 80%+ Excellent, 60–79% Good, 35–59% Fair, below that Poor. It is a guide, not a promise of a catch.",
  },
  {
    id: "tide", title: "Chapter 5 · The Red Tide Warning", scene: "tide",
    story: <><p>Rahim’s neighbour, Salma, kept shrimp in a coastal pond. One day her fish gasped near the surface — too late she learned that a harmful algal bloom had stolen the oxygen.</p><p>“Never again,” she said, and opened the <B>Aquaculture &amp; Algal Bloom Monitor</B>.</p></>,
    steps: ["Open the <b>Aquaculture & Algal Bloom Monitor</b> tab.", "Check the three counters: Critical red-tide alerts, Moderate warnings, Normal health.", "Hover over dots on the temperature vs chlorophyll chart to see each point’s details.", "Use the <b>By area</b> bars to compare Sundarbans, Meghna and Kuakata.", "Follow the farm advice: at critical points pause feeding, add aeration and check dissolved oxygen."],
    tip: "The early-warning model was about 79% accurate on test data. Treat alerts as a cue to check your water.",
  },
  {
    id: "words", title: "Chapter 6 · The Sailor’s Word List", scene: "lantern",
    story: <><p>Rahim kept a small list of strange words on a scrap of paper. Here it is, for you too:</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        {[["Sea surface temperature", "How warm the top layer of the sea is, in °C."], ["Chlorophyll-a", "A measure of tiny plants (phytoplankton) in the water — fish food."], ["Salinity", "How salty the water is."], ["Dissolved oxygen", "The air fish breathe, measured in mg/L."], ["Habitat Suitability Index", "A score from 0 to 1 for how well the water suits a species."], ["Potential Fishing Zone", "Places likely to hold fish."], ["Harmful Algal Bloom", "Too much algae, including red tide, which can steal oxygen from the water."], ["Match percentage", "How closely a place fits a fish’s comfort ranges."]].map(([t, d]) => <div key={t} className="rounded-lg border border-line p-3"><dt className="font-semibold text-accent">{t}</dt><dd className="text-muted">{d}</dd></div>)}
      </dl></>,
  },
  {
    id: "end", title: "The End (and a New Beginning)", scene: "lantern",
    story: <><p>By the end of the season Rahim burned less diesel, found fish sooner, and taught the whole jetty to read the sea from space.</p><p>Before you go, a few last tips: switch <B>light / dark</B> with the sun or moon button; use <B>Log out</B> on shared computers; and always combine NobhoAqua with local knowledge and fishing rules.</p><p>Now it is your turn to cast off.</p></>,
  },
];

export function StoryBook() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const go = useCallback((n: number) => { if (n < 0 || n >= CH.length) return; setDir(n > i ? 1 : -1); setI(n); }, [i]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go, i]);

  const c = CH[i];
  const last = i === CH.length - 1;

  return (
    <div>
      <div className="relative mx-auto max-w-6xl" style={{ perspective: 1800 }}>
        <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/25 to-accent2/10 blur-2xl" />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.article key={c.id} custom={dir} aria-live="polite" aria-label={c.title}
            initial={{ opacity: 0, rotateY: dir * -18, x: dir * 30 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: dir * 18, x: dir * -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }} style={{ transformOrigin: dir > 0 ? "left center" : "right center" }}
            className="glass relative grid overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_rgba(0,0,0,.35)] md:grid-cols-2">
            {/* left page: illustration */}
            <div className="relative min-h-[260px] border-b border-line md:min-h-[560px] md:border-b-0 md:border-r">
              <StoryScene scene={c.scene} />
              <span className="absolute bottom-3 left-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur">Page {i + 1} / {CH.length}</span>
            </div>
            {/* right page: text */}
            <div className="relative flex flex-col p-6 sm:p-9">
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-6 bg-gradient-to-r from-black/15 to-transparent md:block" />
              <h2 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{c.title}</h2>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-muted [&_b]:font-semibold">{c.story}</div>
              {c.steps && (
                <div className="mt-5 rounded-2xl border border-accent/30 bg-accent/10 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">How to do it</h3>
                  <ol className="mt-2 space-y-2 text-sm">
                    {c.steps.map((s, k) => (
                      <li key={k} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-ink">{k + 1}</span><span className="text-muted [&_b]:text-fg" dangerouslySetInnerHTML={{ __html: s }} /></li>
                    ))}
                  </ol>
                </div>
              )}
              {c.tip && <p className="mt-4 flex gap-2 rounded-xl border border-warn/30 bg-warn/10 p-3 text-sm"><Lightbulb size={18} className="mt-0.5 shrink-0 text-warn" /><span className="text-muted">{c.tip}</span></p>}
              {last && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 px-5 py-3 font-semibold text-ink">Start exploring <ArrowRight size={16} /></Link>
                  <Link href="/dashboard" className="focus-ring rounded-xl border border-line px-5 py-3 font-medium hover:border-accent">Open dashboard</Link>
                </div>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl items-center justify-between gap-3">
        <button onClick={() => go(i - 1)} disabled={i === 0} className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-sm font-medium transition enabled:hover:border-accent disabled:opacity-40 sm:px-4"><ChevronLeft size={16} /><span className="hidden sm:inline">Previous</span></button>
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto sm:gap-1.5" role="tablist" aria-label="Chapters">
          {CH.map((x, k) => <button key={x.id} role="tab" aria-selected={k === i} aria-label={`Go to ${x.title}`} onClick={() => go(k)} className={`focus-ring h-2.5 shrink-0 rounded-full transition-all ${k === i ? "w-8 bg-accent" : "w-2.5 bg-line hover:bg-muted"}`} />)}
        </div>
        <button onClick={() => go(i + 1)} disabled={last} className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent2 px-3 py-2.5 text-sm font-semibold text-ink transition enabled:hover:brightness-110 disabled:opacity-40 sm:px-4"><span className="hidden sm:inline">Next</span><ChevronRight size={16} /></button>
      </div>

      <nav aria-label="Table of contents" className="mx-auto mt-10 grid max-w-6xl gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {CH.map((x, k) => (
          <button key={x.id} onClick={() => { go(k); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`focus-ring rounded-xl border p-3 text-left text-sm transition ${k === i ? "border-accent bg-accent/10" : "border-line hover:border-accent/60"}`}>
            <span className="text-xs text-muted">{k === 0 ? "Cover" : k === CH.length - 1 ? "Finale" : `Chapter ${k}`}</span>
            <span className="mt-0.5 block font-medium">{x.title.replace(/^Chapter \d+ · /, "")}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

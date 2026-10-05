"use client";
import { animate, useInView, motion } from "framer-motion";
import { ArrowRight, Fish, Radar, Satellite, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MODEL, points } from "@/lib/data";
import { HeroWaves } from "./HeroWaves";

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>;
}

const stats = [
  { icon: Fish, label: "Species profiled", to: 200, d: 0, s: "" },
  { icon: Satellite, label: "Satellite grid points", to: points.length, d: 0, s: "" },
  { icon: ShieldAlert, label: "HAB warning accuracy", to: MODEL.habAccuracy, d: 2, s: "%" },
  { icon: Radar, label: "HSI model error (MSE)", to: MODEL.hsiMse, d: 4, s: "" },
];

export function Hero() {
  const bubbles = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 73) % 100}%`, size: 6 + ((i * 7) % 14), dur: 14 + ((i * 5) % 12), delay: -((i * 3) % 14),
  }));
  return (
    <section id="top" className="relative isolate overflow-hidden pt-36 pb-52 sm:pt-44">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,var(--glow),transparent),radial-gradient(50%_40%_at_10%_80%,rgba(45,212,191,0.12),transparent)]" />
      <HeroWaves />
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {bubbles.map((b, i) => (
          <span key={i} className="bubble absolute bottom-0 rounded-full border border-accent/40 bg-accent/10"
            style={{ left: b.left, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div aria-hidden className="pointer-events-none absolute right-10 top-36 hidden h-[360px] w-[360px] place-items-center xl:grid">
          <span className="ripple absolute inset-0 rounded-full border border-accent/30" />
          <span className="ripple absolute inset-0 rounded-full border border-accent/30" style={{ animationDelay: "-2.2s" }} />
          <span className="ripple absolute inset-0 rounded-full border border-accent/30" style={{ animationDelay: "-4.4s" }} />
          <div className="orb glass grid h-[250px] w-[250px] place-items-center rounded-full shadow-[0_0_80px_var(--glow)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" className="logo-mark w-[62%]" />
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted">
            <span className="h-2 w-2 rounded-full bg-good" /> NASA Space Apps · Earth Observation × Fisheries Science
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Know where the fish are.<br />
            <span className="text-grad">Before you leave the shore.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            NobhoAqua turns NASA MODIS ocean-colour and temperature data into potential fishing zones, species-level habitat
            suitability and early warnings for harmful algal blooms across the Bay of Bengal.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/signup" className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 px-6 py-3.5 font-semibold text-ink shadow-[0_0_36px_var(--glow)] transition hover:brightness-110">
              Get started <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <Link href="/login" className="focus-ring glass rounded-xl px-6 py-3.5 font-semibold transition hover:border-accent">
              Log in to dashboard
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="glass rounded-2xl p-5">
              <s.icon size={20} className="text-accent" />
              <div className="mt-3 font-display text-3xl font-bold tabular-nums sm:text-4xl">
                <Counter to={s.to} decimals={s.d} suffix={s.s} />
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

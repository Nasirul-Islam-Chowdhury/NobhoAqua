"use client";
import { BookOpen, Fish, LogOut, Map as MapIcon, Moon, Sun, Waves } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logOut, useAuth } from "@/lib/auth";
import { FishExplorer } from "./FishExplorer";
import { HabMonitor } from "./HabMonitor";
import { Insights } from "./Insights";
import { MapSection } from "./MapSection";
import { useTheme } from "./useTheme";
import { WhereToFind } from "./WhereToFind";

const TABS = [
  { id: "gis", label: "Ocean GIS Heatmap", short: "GIS Heatmap", icon: MapIcon, blurb: "NASA-derived sea temperature, chlorophyll-a and potential fishing zones." },
  { id: "hsi", label: "Species HSI Predictor", short: "Species HSI", icon: Fish, blurb: "Pick any of 200 species to see its habitat needs and best Bay of Bengal locations." },
  { id: "farm", label: "Aquaculture & Algal Bloom Monitor", short: "Farm Monitor", icon: Waves, blurb: "Harmful algal bloom early warnings and water-quality status by area." },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function Dashboard() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState<TabId>("gis");

  useEffect(() => { if (ready && !user) router.replace("/login"); }, [ready, user, router]);
  useEffect(() => {
    const h = window.location.hash.slice(1) as TabId;
    if (TABS.some((t) => t.id === h)) setTab(h); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  const pick = (t: TabId) => { setTab(t); history.replaceState(null, "", `#${t}`); window.scrollTo({ top: 0 }); };

  if (!ready || !user) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading dashboard…</div>;
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="dash min-h-screen">
      <header className="sticky top-0 z-[1000] border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" className="logo-mark h-9 w-auto" />
            <span className="font-display text-lg font-bold">Nobho<span className="text-accent">Aqua</span></span>
          </Link>
          <nav role="tablist" aria-label="Dashboard modules" className="hidden items-center gap-1 rounded-2xl border border-line bg-card p-1 md:flex">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => pick(t.id)}
                className={`focus-ring flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${tab === t.id ? "bg-gradient-to-r from-accent to-accent2 text-ink shadow-[0_0_20px_var(--glow)]" : "text-muted hover:text-fg"}`}>
                <t.icon size={16} />{t.short}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/guide" className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-card px-3 text-sm text-muted hover:border-accent hover:text-fg"><BookOpen size={16} /><span className="hidden lg:inline">Guide</span></Link>
            <button onClick={toggle} aria-label="Toggle theme" className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-line bg-card hover:border-accent">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="hidden items-center gap-2 rounded-xl border border-line bg-card py-1.5 pl-1.5 pr-3 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent2 text-sm font-bold text-ink">{user.name.charAt(0).toUpperCase()}</span>
              <span className="max-w-[120px] truncate text-sm">{user.name}</span>
            </div>
            <button onClick={() => { logOut(); router.replace("/"); }} className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted transition hover:border-danger hover:text-danger">
              <LogOut size={16} /><span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
        <nav role="tablist" aria-label="Dashboard modules" className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 md:hidden">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => pick(t.id)}
              className={`focus-ring flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${tab === t.id ? "bg-accent/15 text-accent" : "text-muted"}`}>
              <t.icon size={14} />{t.short}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <p className="text-sm text-muted">Welcome back, {user.name.split(" ")[0]}</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">{active.label}</h1>
        <p className="mt-1 text-muted">{active.blurb}</p>
      </div>

      <main>
        {tab === "gis" && <MapSection />}
        {tab === "hsi" && <><FishExplorer /><WhereToFind /></>}
        {tab === "farm" && <><HabMonitor /><Insights /></>}
      </main>
      <footer className="border-t border-line py-6 text-center text-xs text-muted">Powered by NASA MODIS & Landsat data · Estimates support, not replace, local knowledge.</footer>
    </div>
  );
}

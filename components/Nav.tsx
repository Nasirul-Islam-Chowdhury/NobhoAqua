"use client";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useTheme } from "./useTheme";

const links = [
  ["Platform", "#features"],
  ["Mission", "#mission"],
  ["About", "#about"],
  ["Team", "#team"],
  ["Resources", "/resources"],
  ["User Manual", "/guide"],
];

export function Nav() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="focus-ring flex items-center gap-2.5 rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="logo-mark h-10 w-auto" />
          <span className="font-display text-xl font-bold tracking-tight">
            Nobho<span className="text-accent">Aqua</span>
          </span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map(([l, h]) => (
            <Link key={h} href={h} className="focus-ring rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card hover:text-fg">
              {l}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-line bg-card text-fg transition hover:border-accent"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <Link href="/dashboard" className="focus-ring rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_0_28px_var(--glow)] hover:brightness-110">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="focus-ring rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-fg">Log in</Link>
              <Link href="/signup" className="focus-ring rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_0_28px_var(--glow)] hover:brightness-110">Sign up</Link>
            </>
          )}
        </div>
      </div>
      {/* mobile link strip */}
      <nav aria-label="Sections" className="scroll-thin flex gap-1 overflow-x-auto border-t border-line px-3 py-1.5 lg:hidden">
        {links.map(([l, h]) => (
          <Link key={h} href={h} className="focus-ring shrink-0 rounded-lg px-3 py-1.5 text-xs text-muted hover:text-fg">
            {l}
          </Link>
        ))}
      </nav>
    </header>
  );
}

"use client";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "./useTheme";

const links = [
  ["Platform", "#features"],
  ["Mission", "#mission"],
  ["About", "#about"],
  ["Goals", "#sdg"],
  ["Timeline", "#timeline"],
  ["Team", "#team"],
  ["Resources", "/resources"],
  ["User Manual", "/guide"],
];

export function Nav() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-lg" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="logo-mark h-10 w-auto" />
          <span className="hidden font-display text-xl font-bold tracking-tight sm:inline">
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-card text-fg transition hover:border-accent"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <Link href="/dashboard" className="focus-ring rounded-xl bg-gradient-to-r from-accent to-accent2 px-3 py-2.5 text-sm font-semibold text-ink shadow-[0_0_28px_var(--glow)] hover:brightness-110 sm:px-4">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="focus-ring hidden rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-fg sm:inline-block">Log in</Link>
              <Link href="/signup" className="focus-ring rounded-xl bg-gradient-to-r from-accent to-accent2 px-3 py-2.5 text-sm font-semibold text-ink shadow-[0_0_28px_var(--glow)] hover:brightness-110 sm:px-4">Sign up</Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-card text-fg transition hover:border-accent lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Sections" className="border-t border-line px-4 py-3 lg:hidden">
          <ul className="space-y-0.5">
            {links.map(([l, h]) => (
              <li key={h}>
                <Link href={h} onClick={() => setOpen(false)} className="focus-ring block rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-fg">
                  {l}
                </Link>
              </li>
            ))}
            {!user && (
              <li className="mt-1 border-t border-line pt-1">
                <Link href="/login" onClick={() => setOpen(false)} className="focus-ring block rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-fg">
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

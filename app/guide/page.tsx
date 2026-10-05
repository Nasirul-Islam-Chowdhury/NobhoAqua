import { BookOpen } from "lucide-react";
import Link from "next/link";
import { StoryBook } from "@/components/StoryBook";

export const metadata = { title: "User Manual | NobhoAqua", description: "A storybook guide to using NobhoAqua." };

export default function Guide() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" className="logo-mark h-9 w-auto" />
            <span className="font-display text-lg font-bold">Nobho<span className="text-accent">Aqua</span></span>
          </Link>
          <div className="flex gap-2">
            <Link href="/dashboard" className="focus-ring rounded-xl border border-line px-4 py-2 text-sm hover:border-accent">Dashboard</Link>
            <Link href="/signup" className="focus-ring rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-semibold text-ink">Sign up</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-ink"><BookOpen size={22} /></span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">The NobhoAqua Storybook</h1>
          <p className="mt-3 text-muted">A user manual told as a story. Read it start to finish, or jump to the chapter you need.</p>
        </div>
        <StoryBook />
      </main>
    </div>
  );
}

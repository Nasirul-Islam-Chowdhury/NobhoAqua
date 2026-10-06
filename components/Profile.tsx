"use client";
import { ArrowLeft, LogOut, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logOut, useAuth } from "@/lib/auth";

export function Profile() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => { if (ready && !user) router.replace("/login"); }, [ready, user, router]);

  if (!ready || !user) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading profile…</div>;

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[1000] border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/dashboard" className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-2 text-sm text-muted hover:text-fg">
            <ArrowLeft size={16} /><span className="hidden sm:inline">Back to dashboard</span>
          </Link>
          <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" className="logo-mark h-9 w-auto" />
            <span className="font-display text-lg font-bold">Nobho<span className="text-accent">Aqua</span></span>
          </Link>
          <button onClick={async () => { await logOut(); router.replace("/"); }} className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted transition hover:border-danger hover:text-danger">
            <LogOut size={16} /><span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="glass rounded-3xl p-7 sm:p-9">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 font-display text-2xl font-bold text-ink">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold">{user.name}</h1>
              <p className="truncate text-sm text-muted">{user.email}</p>
            </div>
          </div>

          <dl className="mt-8 space-y-4 border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><UserIcon size={16} /></span>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wider text-muted">Full name</dt>
                <dd className="truncate text-sm font-medium">{user.name}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><Mail size={16} /></span>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wider text-muted">Email</dt>
                <dd className="truncate text-sm font-medium">{user.email}</dd>
              </div>
            </div>
          </dl>

          <p className="mt-8 border-t border-line pt-5 text-xs text-muted">Member since {memberSince}</p>
        </div>
      </main>
    </div>
  );
}

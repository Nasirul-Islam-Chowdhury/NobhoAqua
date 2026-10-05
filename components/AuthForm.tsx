"use client";
import { Eye, EyeOff, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEMO, logIn, signUp, useAuth } from "@/lib/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const signup = mode === "signup";

  useEffect(() => { if (ready && user) router.replace("/dashboard"); }, [ready, user, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signup) {
      if (f.name.trim().length < 2) return setErr("Please enter your name.");
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email address.");
      if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
      if (f.password !== f.confirm) return setErr("Passwords don’t match.");
      const m = signUp(f.name, f.email, f.password);
      if (m) return setErr(m);
    } else {
      const m = logIn(f.email, f.password);
      if (m) return setErr(m);
    }
    router.replace("/dashboard");
  };

  const demo = () => { logIn(DEMO.email, DEMO.password); router.replace("/dashboard"); };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setErr(""); };
  const input = "focus-ring w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm placeholder:text-muted";

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-16">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_10%,var(--glow),transparent),radial-gradient(50%_40%_at_10%_90%,rgba(45,212,191,0.14),transparent)]" />
      <div className="w-full max-w-md">
        <Link href="/" className="focus-ring mx-auto mb-8 flex w-fit items-center gap-2.5 rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="logo-mark h-11 w-auto" />
          <span className="font-display text-2xl font-bold">Nobho<span className="text-accent">Aqua</span></span>
        </Link>
        <div className="glass rounded-3xl p-7 shadow-[0_0_80px_var(--glow)] sm:p-9">
          <h1 className="font-display text-2xl font-bold">{signup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-1 text-sm text-muted">{signup ? "Get access to the fisheries decision dashboard." : "Log in to open your dashboard."}</p>

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            {signup && (
              <div><label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full name</label>
                <input id="name" autoComplete="name" value={f.name} onChange={set("name")} placeholder="Your name" className={input} /></div>
            )}
            <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
              <input id="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} placeholder="you@example.com" className={input} /></div>
            <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative">
                <input id="password" type={show ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} value={f.password} onChange={set("password")} placeholder="••••••••" className={`${input} pr-11`} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="focus-ring absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-fg">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div></div>
            {signup && (
              <div><label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">Confirm password</label>
                <input id="confirm" type={show ? "text" : "password"} autoComplete="new-password" value={f.confirm} onChange={set("confirm")} placeholder="••••••••" className={input} /></div>
            )}
            {err && <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{err}</p>}
            <button className="focus-ring w-full rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-3 font-semibold text-ink shadow-[0_0_30px_var(--glow)] transition hover:brightness-110">
              {signup ? "Create account" : "Log in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
          <button onClick={demo} className="focus-ring w-full rounded-xl border border-line px-4 py-3 text-sm font-medium transition hover:border-accent">Continue with demo account</button>

          <p className="mt-6 text-center text-sm text-muted">
            {signup ? <>Already have an account? <Link href="/login" className="font-medium text-accent hover:underline">Log in</Link></>
              : <>New here? <Link href="/signup" className="font-medium text-accent hover:underline">Create an account</Link></>}
          </p>
        </div>
        <p className="mt-5 flex items-start justify-center gap-1.5 text-center text-xs text-muted"><Info size={14} className="mt-0.5 shrink-0" />Demo only: accounts are stored in this browser, not on a server. Don’t use a real password.</p>
      </div>
    </main>
  );
}

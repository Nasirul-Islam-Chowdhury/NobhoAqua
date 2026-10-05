"use client";
import { useSyncExternalStore } from "react";

// DEMO ONLY: accounts live in this browser's localStorage. There is no server and no real security.
const USERS = "nj-users";
const SESSION = "nj-session";
const SSR = "__ssr__";

export interface User { name: string; email: string }
interface Stored extends User { password: string }

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {}
  emit();
};
const users = (): Stored[] => { try { return JSON.parse(read(USERS) || "[]"); } catch { return []; } };

export const DEMO = { name: "Demo Fisher", email: "demo@nobhojol.app", password: "demo1234" };

export function signUp(name: string, email: string, password: string): string | null {
  const e = email.trim().toLowerCase();
  if (users().some((u) => u.email === e)) return "An account with this email already exists.";
  write(USERS, JSON.stringify([...users(), { name: name.trim(), email: e, password }]));
  write(SESSION, JSON.stringify({ name: name.trim(), email: e }));
  return null;
}

export function logIn(email: string, password: string): string | null {
  const e = email.trim().toLowerCase();
  if (e === DEMO.email && password === DEMO.password) {
    write(SESSION, JSON.stringify({ name: DEMO.name, email: DEMO.email }));
    return null;
  }
  const u = users().find((x) => x.email === e && x.password === password);
  if (!u) return "Incorrect email or password.";
  write(SESSION, JSON.stringify({ name: u.name, email: u.email }));
  return null;
}

export const logOut = () => write(SESSION, null);

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
};

export function useAuth(): { user: User | null; ready: boolean } {
  const raw = useSyncExternalStore(subscribe, () => read(SESSION) ?? "", () => SSR);
  if (raw === SSR) return { user: null, ready: false };
  let user: User | null = null;
  try { user = raw ? JSON.parse(raw) : null; } catch {}
  return { user, ready: true };
}

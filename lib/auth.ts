"use client";
import { useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
  createdAt: string;
}

let cachedUser: User | null | undefined; // undefined = not fetched yet
const listeners = new Set<(u: User | null) => void>();
const emit = (u: User | null) => {
  cachedUser = u;
  listeners.forEach((l) => l(u));
};

async function fetchMe(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function primeAuth() {
  if (cachedUser === undefined) fetchMe().then(emit);
}

export async function signUp(name: string, email: string, password: string): Promise<string | null> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return data.error ?? "Something went wrong.";
  emit(data.user);
  return null;
}

export async function logIn(email: string, password: string): Promise<string | null> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return data.error ?? "Something went wrong.";
  emit(data.user);
  return null;
}

export async function logOut(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  emit(null);
}

export function useAuth(): { user: User | null; ready: boolean } {
  const [user, setUser] = useState<User | null | undefined>(cachedUser);

  useEffect(() => {
    listeners.add(setUser);
    primeAuth();
    return () => {
      listeners.delete(setUser);
    };
  }, []);

  return { user: user ?? null, ready: user !== undefined };
}

"use client";
import { useEffect } from "react";
import { primeAuth } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    primeAuth();
  }, []);
  return <>{children}</>;
}

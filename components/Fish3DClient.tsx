"use client";
import dynamic from "next/dynamic";

export const Fish3D = dynamic(() => import("./Fish3D"), {
  ssr: false,
  loading: () => <div className="grid h-full w-full animate-pulse place-items-center text-sm text-muted">Loading 3D fish…</div>,
});

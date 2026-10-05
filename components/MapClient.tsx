"use client";
import dynamic from "next/dynamic";

export const OceanMap = dynamic(() => import("./OceanMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[320px] w-full animate-pulse place-items-center rounded-2xl bg-bg2 text-sm text-muted">
      Loading satellite map…
    </div>
  ),
});

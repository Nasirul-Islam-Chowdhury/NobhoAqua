import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" | "good" | "warn" | "danger" }) {
  const t = {
    default: "border-line text-muted",
    accent: "border-accent/40 bg-accent/10 text-accent",
    good: "border-good/40 bg-good/10 text-good",
    warn: "border-warn/40 bg-warn/10 text-warn",
    danger: "border-danger/40 bg-danger/10 text-danger",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${t}`}>{children}</span>;
}

export function Bar({ value, color = "var(--accent)" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line" role="presentation">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(value * 100)}%`, background: color }} />
    </div>
  );
}

export const scoreColor = (s: number) => (s >= 0.8 ? "var(--good)" : s >= 0.6 ? "var(--accent)" : s >= 0.35 ? "var(--warn)" : "var(--danger)");

export function Stat({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-0.5 font-display text-xl font-semibold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted">{unit}</span>}
      </div>
    </div>
  );
}

export const habTone = (h: string) => (h.startsWith("CRITICAL") ? "danger" : h.startsWith("Moderate") ? "warn" : "good") as "danger" | "warn" | "good";
export const habLabel = (h: string) => (h.startsWith("CRITICAL") ? "Critical red tide" : h.startsWith("Moderate") ? "Moderate warning" : "Normal health");

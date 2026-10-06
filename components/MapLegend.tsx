import type { ReactNode } from "react";

interface Item { color: string; label: string; hint?: string }
interface Props {
  title: string;
  items?: Item[];
  /** Continuous colour scale, drawn as a gradient bar with end labels. */
  scale?: { colors: string[]; low: string; high: string };
  note?: ReactNode;
  /** Two-column layout without hints, for small maps. */
  compact?: boolean;
  className?: string;
}

/** Bold, self-explanatory legend card overlaid on the bottom-left of a map. */
export function MapLegend({ title, items, scale, note, compact = false, className = "" }: Props) {
  return (
    <div className={`pointer-events-none absolute bottom-3 left-3 z-[500] w-[min(13rem,calc(100%-1.5rem))] rounded-2xl border border-line bg-solid/95 p-2.5 shadow-[0_10px_30px_rgba(0,0,0,.35)] backdrop-blur sm:w-[min(17rem,calc(100%-1.5rem))] sm:p-3.5 ${className}`}>
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">{title}</p>
      {items && (
        <ul className={`mt-2 sm:mt-2.5 ${compact ? "grid grid-cols-2 gap-x-3 gap-y-2" : "space-y-1.5 sm:space-y-2"}`}>
          {items.map((i) => (
            <li key={i.label} className="flex items-start gap-2.5">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-white/80 shadow" style={{ background: i.color }} />
              <span className="leading-tight">
                <span className="block text-sm font-bold text-fg">{i.label}</span>
                {i.hint && !compact && <span className="hidden text-xs font-medium text-muted sm:block">{i.hint}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {scale && (
        <div className="mt-2 sm:mt-2.5">
          <div className="h-3.5 rounded-full border border-white/40" style={{ background: `linear-gradient(to right, ${scale.colors.join(",")})` }} />
          <div className="mt-1.5 flex justify-between gap-2 text-sm font-bold text-fg">
            <span>{scale.low}</span>
            <span className="text-right">{scale.high}</span>
          </div>
        </div>
      )}
      {note && <p className="mt-2 hidden border-t border-line pt-2 text-xs font-semibold text-muted sm:mt-2.5 sm:block">{note}</p>}
    </div>
  );
}

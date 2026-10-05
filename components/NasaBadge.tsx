import Image from "next/image";

/** NASA Space Apps Challenge 2026 logo. The artwork is black, so it is shown as a clean white mark on the dark theme. */
export function NasaBadge({ className = "h-16", width = 377, height = 390 }: { className?: string; width?: number; height?: number }) {
  return (
    <Image src="/nasa-space-apps-2026.png" alt="NASA Space Apps Challenge 2026" width={width} height={height}
      className={`nasa-logo w-auto shrink-0 ${className}`} />
  );
}

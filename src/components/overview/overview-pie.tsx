import { cn } from "@/lib/utils";

export type PieSlice = {
  label: string;
  value: number;
  className: string;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function OverviewPie({
  slices,
  ariaLabel,
}: {
  slices: PieSlice[];
  ariaLabel: string;
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 68;

  if (total <= 0) {
    return (
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div
          className="size-40 rounded-full bg-surface-container-high"
          role="img"
          aria-label={`${ariaLabel}: no data`}
        />
        <p className="text-body-sm text-on-surface-variant">No accounts yet.</p>
      </div>
    );
  }

  let angle = 0;
  const paths = slices
    .filter((slice) => slice.value > 0)
    .map((slice) => {
      const sweep = (slice.value / total) * 360;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      // Full circle needs a special path — use two semicircles if ~360
      if (sweep >= 359.99) {
        return (
          <circle
            key={slice.label}
            cx={cx}
            cy={cy}
            r={r}
            className={cn(slice.className)}
          />
        );
      }
      return (
        <path
          key={slice.label}
          d={describeSlice(cx, cy, r, start, end)}
          className={cn(slice.className)}
        />
      );
    });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
        className="shrink-0"
      >
        {paths}
      </svg>
      <ul className="flex flex-col gap-2 text-body-sm">
        {slices.map((slice) => {
          const pct = Math.round((slice.value / total) * 100);
          return (
            <li key={slice.label} className="flex items-center gap-2">
              <span className={cn("size-2.5 shrink-0 rounded-full", slice.className)} aria-hidden />
              <span className="text-on-surface-variant">{slice.label}</span>
              <span className="font-tabular text-on-surface">
                {slice.value}
                <span className="ml-1 text-on-surface-variant">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

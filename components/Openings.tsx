import Image from "next/image";
import { labelClass, monoLabelClass } from "@/components/ui";
import { openings as allOpenings, type Opening, type OpeningKind } from "@/lib/openings";
import { formatAmount } from "@/lib/types";

/** Doors and windows: one card each, then the sum of what's priced so far. */
export function Openings({ openings = allOpenings }: { openings?: Opening[] }) {
  const priced = openings.filter((o) => o.price !== null);
  const total = priced.reduce((sum, o) => sum + o.price! * o.quantity, 0);
  const missing = openings.length - priced.length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {openings.map((opening) => (
          <OpeningCard key={opening.name} opening={opening} />
        ))}
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-3">
        <div>
          <p className={labelClass}>รวมประตูหน้าต่าง</p>
          {missing > 0 && (
            <p className="mt-0.5 text-xs text-muted">
              ยังไม่มีราคา {missing} รายการ
            </p>
          )}
        </div>
        <p className="tnum font-serif text-xl text-ink">
          {priced.length > 0 ? formatAmount(total) : "—"}
          <span className="ml-1 text-sm text-muted">บาท</span>
        </p>
      </div>
    </>
  );
}

function OpeningCard({ opening }: { opening: Opening }) {
  const { size, color, price, quantity } = opening;
  const dims: [string, number | null][] = [
    ["กว้าง", size.width],
    ["ยาว", size.length],
    ["สูง", size.height],
  ];

  return (
    // Same white mat as the reference shots, so the two sections read as a set.
    <article className="rounded-[3px] border border-line bg-surface p-2.5 shadow-[0_1px_2px_rgb(42_38_34/0.05),0_12px_28px_-20px_rgb(42_38_34/0.35)] sm:p-3.5">
      <div className="relative aspect-4/3 overflow-hidden border border-ink/10 bg-paper">
        {opening.image ? (
          <Image
            src={opening.image}
            alt={opening.name}
            className="size-full object-contain"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <>
            <Drawing kind={opening.kind} width={size.width} height={size.height} />
            <span className="absolute right-2.5 bottom-1.5 text-xs text-muted/80">
              รอรูป
            </span>
          </>
        )}
      </div>

      <div className="px-1 pt-3.5 sm:px-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg leading-snug text-ink">
            {opening.name}
          </h3>
          <span className={monoLabelClass}>{opening.tag}</span>
        </div>
        {opening.note && (
          <p className="mt-0.5 text-xs leading-5 text-muted">{opening.note}</p>
        )}

        {/* Sizes set out like the notes on a drawing: label over figure. */}
        <dl className="mt-3 grid grid-cols-3 divide-x divide-line-soft border-y border-line-soft py-2">
          {dims.map(([label, value]) => (
            <div key={label} className="px-2 first:pl-0">
              <dt className={labelClass}>{label}</dt>
              <dd className="tnum mt-0.5 text-sm text-ink">
                {value ?? <span className="text-muted">—</span>}
                <span className="ml-1 text-xs text-muted">ซม.</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-2.5 flex items-center gap-2 text-sm">
          <span className={`${labelClass} w-8`}>สี</span>
          {color ? (
            <>
              <span
                className="size-4 shrink-0 rounded-full border border-ink/15"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <span className="text-ink">{color.name}</span>
            </>
          ) : (
            <span className="text-muted">—</span>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="tnum font-serif text-xl leading-tight text-ink">
              {price !== null ? formatAmount(price) : "—"}
              <span className="ml-1 text-sm text-muted">บาท</span>
            </p>
            {quantity > 1 && (
              <p className="tnum text-xs text-muted">
                × {quantity} = {price !== null ? formatAmount(price * quantity) : "—"}
              </p>
            )}
          </div>
          <ShopeeTag url={opening.shopeeUrl} />
        </div>
      </div>
    </article>
  );
}

/** Says where the price came from; links to the listing once there is one. */
function ShopeeTag({ url }: { url?: string }) {
  const className =
    "inline-flex shrink-0 items-center gap-1 rounded-full bg-clay/10 px-2.5 py-0.5 text-xs text-clay";
  if (!url) return <span className={className}>ราคาจาก Shopee</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition hover:bg-clay/20`}
    >
      ราคาจาก Shopee <span aria-hidden>↗</span>
    </a>
  );
}

/**
 * A plain elevation of the opening, drawn in hairlines, standing in for the
 * product photo. Once the width and height are known they're written on the
 * dimension lines.
 */
function Drawing({
  kind,
  width,
  height,
}: {
  kind: OpeningKind;
  width: number | null;
  height: number | null;
}) {
  // Each kind sits in its own box on a 160×120 sheet.
  const box =
    kind === "sliding-door"
      ? { x: 26, y: 18, w: 112, h: 86 }
      : kind === "louvre"
        ? { x: 52, y: 30, w: 64, h: 52 }
        : { x: 36, y: 24, w: 96, h: 66 };
  const { x, y, w, h } = box;
  const glass = "stroke-line-strong/50";

  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      strokeLinecap="round"
      aria-hidden
      className="size-full text-line-strong"
    >
      <g stroke="currentColor" strokeWidth={0.8}>
        {/* Frame */}
        <rect x={x} y={y} width={w} height={h} />
        <rect x={x + 2.5} y={y + 2.5} width={w - 5} height={h - 5} />

        {kind === "window" && (
          <>
            {/* Two sashes overlapping at the meeting rail */}
            <rect x={x + 5} y={y + 5} width={w / 2 - 3} height={h - 10} />
            <rect x={x + w / 2 - 2} y={y + 5} width={w / 2 - 3} height={h - 10} />
            <g className={glass}>
              <path d={`M${x + 14} ${y + 26}l12 -12M${x + 14} ${y + 34}l18 -18`} />
              <path d={`M${x + w / 2 + 8} ${y + 26}l12 -12M${x + w / 2 + 8} ${y + 34}l18 -18`} />
            </g>
            {/* Sill */}
            <path d={`M${x - 6} ${y + h + 3}h${w + 12}`} />
          </>
        )}

        {kind === "louvre" && (
          <g>
            {Array.from({ length: 7 }, (_, i) => {
              const ly = y + 9 + i * 6;
              return <path key={i} d={`M${x + 6} ${ly}h${w - 12}`} />;
            })}
            <path d={`M${x - 5} ${y + h + 3}h${w + 10}`} />
          </g>
        )}

        {kind === "sliding-door" && (
          <>
            <rect x={x + 5} y={y + 5} width={w / 2 - 3} height={h - 5} />
            <rect x={x + w / 2 - 2} y={y + 5} width={w / 2 - 3} height={h - 5} />
            {/* Handles */}
            <path d={`M${x + w / 2 - 6} ${y + h / 2 - 6}v12M${x + w / 2 + 4} ${y + h / 2 - 6}v12`} />
            <g className={glass}>
              <path d={`M${x + 14} ${y + 30}l14 -14M${x + 14} ${y + 40}l22 -22`} />
              <path d={`M${x + w / 2 + 8} ${y + 30}l14 -14M${x + w / 2 + 8} ${y + 40}l22 -22`} />
            </g>
            {/* Floor line */}
            <path d={`M${x - 14} ${y + h}h${w + 28}`} />
          </>
        )}
      </g>

      {/* Dimension lines: width above, height to the left */}
      <g stroke="currentColor" strokeWidth={0.5} className="text-muted/60">
        <path d={`M${x} ${y - 8}h${w}M${x} ${y - 11}v6M${x + w} ${y - 11}v6`} />
        <path d={`M${x - 8} ${y}v${h}M${x - 11} ${y}h6M${x - 11} ${y + h}h6`} />
      </g>
      <g
        className="fill-muted font-mono"
        fontSize={6}
        textAnchor="middle"
        stroke="none"
      >
        <text x={x + w / 2} y={y - 10.5}>
          {width ?? "W"}
        </text>
        <text
          x={x - 10.5}
          y={y + h / 2}
          transform={`rotate(-90 ${x - 10.5} ${y + h / 2})`}
        >
          {height ?? "H"}
        </text>
      </g>
    </svg>
  );
}

/** Small stroked icons, drawn on a 20px grid so they sit with the text. */

const paths = {
  chevron: "M7.5 5l5 5-5 5",
  up: "M10 15V5M5.5 9.5L10 5l4.5 4.5",
  down: "M10 5v10M5.5 10.5L10 15l4.5-4.5",
  pencil: "M12.5 4.5l3 3L7 16H4v-3l8.5-8.5z",
  trash: "M4.5 6h11M8 6V4.5h4V6M6 6l.7 9.5h6.6L14 6",
  plus: "M10 4.5v11M4.5 10h11",
  check: "M5 10.5l3.2 3L15 6.5",
  close: "M5.5 5.5l9 9M14.5 5.5l-9 9",
  info: "M10 9v5M10 6.3v.2",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "size-4",
  strokeWidth = 1.6,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}

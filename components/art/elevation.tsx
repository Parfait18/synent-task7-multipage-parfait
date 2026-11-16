import { cn } from "@/lib/utils";

export type ElevationKind = "house" | "shop" | "school";

/**
 * Front elevations of the three featured projects, drawn by hand as simple
 * architectural line drawings. They replace photographs: the studio is
 * fictional, so pictures of real buildings would be misleading.
 *
 * Conventions: kiln lines for structure, laterite for earth-block walls,
 * a dashed line for the natural ground level.
 */
export function Elevation({ kind, className }: { kind: ElevationKind; className?: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      className={cn("text-kiln", className)}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      {kind === "house" && <House />}
      {kind === "shop" && <Shop />}
      {kind === "school" && <School />}
      {/* Natural ground level. */}
      <path d="M8 160H312" strokeDasharray="6 5" />
    </svg>
  );
}

/** Earth-block courses drawn as horizontal joints inside a wall rectangle. */
function Courses({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const lines = [];
  for (let line = y + 10; line < y + height; line += 10) {
    lines.push(<path key={line} d={`M${x} ${line}H${x + width}`} />);
  }
  return (
    <g className="text-laterite" stroke="currentColor" strokeWidth="1">
      {lines}
    </g>
  );
}

function House() {
  return (
    <>
      {/* Wide roof overhang shades the walls. */}
      <path d="M30 84L160 40L290 84" />
      <path d="M44 80V160M276 80V160" />
      <rect x="62" y="84" width="196" height="76" className="fill-plaster" />
      <Courses x={62} y={84} width={196} height={76} />
      {/* Door and shuttered windows. */}
      <rect x="146" y="110" width="28" height="50" className="fill-lime" />
      <rect x="84" y="104" width="34" height="30" className="fill-lime" />
      <rect x="202" y="104" width="34" height="30" className="fill-lime" />
      <path d="M101 104V134M219 104V134" />
    </>
  );
}

function Shop() {
  return (
    <>
      <path d="M70 36H250" strokeWidth="3" />
      <rect x="78" y="40" width="164" height="54" className="fill-plaster" />
      {/* Upper floor claustra screen: a grid of round openings. */}
      {[0, 1, 2, 3, 4, 5, 6].map((column) =>
        [0, 1].map((row) => (
          <circle
            key={`${column}-${row}`}
            cx={98 + column * 21}
            cy={56 + row * 22}
            r="7"
            className="fill-lime text-laterite"
            stroke="currentColor"
          />
        )),
      )}
      <rect x="78" y="94" width="164" height="66" className="fill-plaster" />
      <Courses x={78} y={94} width={164} height={66} />
      {/* Shopfront with a rolled awning. */}
      <rect x="100" y="112" width="120" height="48" className="fill-lime" />
      <path d="M94 106H226" strokeWidth="4" className="text-neem" stroke="currentColor" />
      <path d="M160 112V160" />
    </>
  );
}

function School() {
  return (
    <>
      {/* A roof that floats above the classrooms lets hot air escape. */}
      <path d="M14 70L306 54" strokeWidth="3" />
      <path d="M30 70V160M110 66V160M210 61V160M290 57V160" />
      {[34, 134, 214].map((x) => (
        <g key={x}>
          <rect x={x} y="92" width="72" height="68" className="fill-plaster" />
          <Courses x={x} y={92} width={72} height={68} />
          <rect x={x + 24} y="118" width="24" height="42" className="fill-lime" />
        </g>
      ))}
      {/* Neem trees planted for shade. */}
      <g className="text-neem" stroke="currentColor">
        <path d="M120 160V128" />
        <circle cx="120" cy="116" r="12" className="fill-lime" />
      </g>
    </>
  );
}

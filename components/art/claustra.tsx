import { cn } from "@/lib/utils";

/**
 * One claustra block, drawn on a 100 × 100 grid.
 *
 * Claustra (perforated screen blocks) are everywhere in West African modernist
 * buildings: they let air and light through while keeping the sun off the
 * wall behind. Each block has a round opening in the middle and a quarter
 * circle in every corner, so four neighbouring blocks complete a small circle
 * at each joint. The `evenodd` fill rule cuts the openings out of the square.
 */
const BLOCK_PATH = [
  "M0 0H100V100H0Z",
  // Central opening.
  "M50 22a28 28 0 1 0 0.001 0Z",
  // Corner quarter circles that join with the neighbouring blocks.
  "M0 0H15A15 15 0 0 1 0 15Z",
  "M100 0V15A15 15 0 0 1 85 0Z",
  "M100 100H85A15 15 0 0 1 100 85Z",
  "M0 100V85A15 15 0 0 1 15 100Z",
].join(" ");

type ClaustraProps = {
  /** Unique within the page: the block is defined once and reused with <use>. */
  id: string;
  columns: number;
  courses: number;
  /** Lays the wall course by course on page load (the site's one animation). */
  isAnimated?: boolean;
  /** Colour seen through the openings. */
  lightClassName?: string;
  /** Colour of the blocks. */
  blockClassName?: string;
  /** SVG aspect handling, for example "xMinYMid slice" for a strip that fills its width. */
  preserveAspectRatio?: string;
  className?: string;
};

const BLOCK = 100;
const JOINT = 4;

export function Claustra({
  id,
  columns,
  courses,
  isAnimated = false,
  lightClassName = "fill-harmattan",
  blockClassName = "fill-laterite",
  preserveAspectRatio,
  className,
}: ClaustraProps) {
  const pitch = BLOCK + JOINT;
  const width = columns * pitch - JOINT;
  const height = courses * pitch - JOINT;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={preserveAspectRatio}
      className={cn(isAnimated && "claustra-animated", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={id} d={BLOCK_PATH} fillRule="evenodd" />
      </defs>
      {/* What shows through the openings and joints: light behind the wall. */}
      <rect width={width} height={height} className={lightClassName} />
      {Array.from({ length: courses }, (_, course) => (
        <g key={course} className={cn("claustra-course", blockClassName)}>
          {Array.from({ length: columns }, (_, column) => (
            <use key={column} href={`#${id}`} x={column * pitch} y={course * pitch} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/** A single block, used as the logo mark and as a small marker. */
export function ClaustraBlock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path d={BLOCK_PATH} fillRule="evenodd" fill="currentColor" />
    </svg>
  );
}

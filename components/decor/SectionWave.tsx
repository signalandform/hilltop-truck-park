/**
 * Full-width wavy transition between two section background colors.
 * Place between sections: `fill` should match the section *below* the wave.
 */
export function SectionWave({
  fill = "htp-cream",
  className = "",
  flip = false,
}: {
  fill?: "htp-cream" | "htp-bg" | "htp-cream-2";
  className?: string;
  /** When true, wave crests point the other way (for variety between breaks) */
  flip?: boolean;
}) {
  const fillClass =
    fill === "htp-bg"
      ? "text-htp-bg"
      : fill === "htp-cream-2"
        ? "text-htp-cream-2"
        : "text-htp-cream";

  const d = flip
    ? "M0,48 L0,8 Q200,32 400,20 T800,28 T1200,12 L1200,48 Z"
    : "M0,48 L0,28 Q300,0 600,20 T1200,8 L1200,48 Z";

  return (
    <div
      className={`w-full leading-none select-none ${fillClass} ${className}`}
      aria-hidden
    >
      <svg
        className="block w-full h-10 sm:h-14"
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d={d} />
      </svg>
    </div>
  );
}

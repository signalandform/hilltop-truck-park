/** Scalloped “bottlecap” shapes for weekly hours — matches site navy + cream palette */
import { BOTTLECAP_PATH } from "./decor/bottlecap-path";

type Props = {
  hours: { day: string; time: string }[];
};

export function HoursBottlecaps({ hours }: Props) {
  if (hours.length === 0) return null;

  return (
    <ul
      className="htp-hours-bottlecaps mx-auto flex list-none flex-wrap justify-center gap-x-4 gap-y-6 px-1 sm:gap-x-5 sm:gap-y-7"
      aria-label="Weekly opening hours"
    >
      {hours.map(({ day, time }, i) => (
        <li key={`${day}-${i}`} className="htp-bottlecap-item">
          <div className="htp-bottlecap relative flex aspect-square w-[5.75rem] shrink-0 items-center justify-center sm:w-[6.5rem] md:w-[7rem] lg:w-[7.5rem]">
            <svg
              className="absolute inset-0 h-full w-full text-htp-navy drop-shadow-[0_2px_6px_rgb(0_0_0_/_0.12)]"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id={`htp-bc-fill-${i}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="var(--htp-navy)" />
                  <stop offset="100%" stopColor="var(--htp-navy-footer)" />
                </linearGradient>
                <clipPath id={`htp-bc-clip-${i}`} clipPathUnits="userSpaceOnUse">
                  <path d={BOTTLECAP_PATH} />
                </clipPath>
              </defs>
              <rect
                width="100"
                height="100"
                fill={`url(#htp-bc-fill-${i})`}
                clipPath={`url(#htp-bc-clip-${i})`}
              />
            </svg>
            <div className="relative z-[1] flex max-w-[92%] flex-col items-center justify-center px-0.5 text-center leading-none text-white">
              <span className="font-display text-xs uppercase tracking-[0.08em] sm:text-sm">
                {day}
              </span>
              <span className="font-display mt-1 text-sm leading-tight tracking-wide sm:text-[0.9375rem] md:text-base">
                {time}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

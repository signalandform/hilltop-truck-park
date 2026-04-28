/** Scalloped “bottlecap” shapes for weekly hours — matches site navy + cream palette */

const BOTTLECAP_PATH =
  "M50.000,1.000 L56.727,7.529 L65.142,3.398 L69.522,11.687 L78.801,10.358 L80.406,19.594 L89.642,21.199 L88.313,30.478 L96.602,34.858 L92.471,43.273 L99.000,50.000 L92.471,56.727 L96.602,65.142 L88.313,69.522 L89.642,78.801 L80.406,80.406 L78.801,89.642 L69.522,88.313 L65.142,96.602 L56.727,92.471 L50.000,99.000 L43.273,92.471 L34.858,96.602 L30.478,88.313 L21.199,89.642 L19.594,80.406 L10.358,78.801 L11.687,69.522 L3.398,65.142 L7.529,56.727 L1.000,50.000 L7.529,43.273 L3.398,34.858 L11.687,30.478 L10.358,21.199 L19.594,19.594 L21.199,10.358 L30.478,11.687 L34.858,3.398 L43.273,7.529 Z";

type Props = {
  hours: { day: string; time: string }[];
};

export function HoursBottlecaps({ hours }: Props) {
  if (hours.length === 0) return null;

  return (
    <ul
      className="htp-hours-bottlecaps mx-auto flex list-none flex-wrap justify-center gap-x-3 gap-y-5 px-1 sm:gap-x-4 sm:gap-y-6"
      aria-label="Weekly opening hours"
    >
      {hours.map(({ day, time }, i) => (
        <li key={`${day}-${i}`} className="htp-bottlecap-item">
          <div className="htp-bottlecap relative flex aspect-square w-[4.65rem] shrink-0 items-center justify-center sm:w-[5.25rem] md:w-[5.65rem] lg:w-[6rem]">
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
              <span className="font-display text-[0.625rem] uppercase tracking-[0.08em] sm:text-[0.6875rem] md:text-xs">
                {day}
              </span>
              <span className="font-display mt-1 text-[0.6875rem] leading-tight tracking-wide sm:text-[0.75rem] md:text-[0.8125rem]">
                {time}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

import Image from "next/image";
import { BOTTLECAP_PATH } from "./bottlecap-path";

type Props = {
  src: string;
  alt?: string;
  id: string;
};

function toSvgSafeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function BottlecapImageFrame({ src, alt = "", id }: Props) {
  const safeId = toSvgSafeId(id);
  const gradientId = `htp-bottlecap-image-fill-${safeId}`;
  const clipId = `htp-bottlecap-image-clip-${safeId}`;

  return (
    <div className="relative flex aspect-square w-48 items-center justify-center sm:w-52">
      <svg
        className="absolute inset-0 h-full w-full drop-shadow-[0_4px_12px_rgb(0_0_0_/_0.16)]"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--htp-navy)" />
            <stop offset="100%" stopColor="var(--htp-navy-footer)" />
          </linearGradient>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={BOTTLECAP_PATH} />
          </clipPath>
        </defs>
        <rect
          width="100"
          height="100"
          fill={`url(#${gradientId})`}
          clipPath={`url(#${clipId})`}
        />
      </svg>

      <div className="relative z-[1] h-[72%] w-[72%] overflow-hidden rounded-full border-[6px] border-htp-cream bg-white shadow-inner">
        <Image
          src={src}
          alt={alt}
          fill
          className="scale-110 object-cover"
          sizes="(max-width: 640px) 192px, 208px"
        />
      </div>
    </div>
  );
}

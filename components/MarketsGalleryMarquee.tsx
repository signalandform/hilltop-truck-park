"use client";

import Image from "next/image";

export type MarketGallerySlide = {
  src: string;
  alt: string;
};

type Props = {
  images: MarketGallerySlide[];
};

/**
 * Full-width strip: five tiles visible on large screens; track scrolls slowly in a loop.
 */
export function MarketsGalleryMarquee({ images }: Props) {
  if (images.length === 0) return null;

  const loop = [...images, ...images];

  return (
    <div className="mb-12 w-full overflow-hidden rounded-card border border-htp-line bg-htp-bg/80 shadow-sm">
      <div className="flex w-max animate-htp-marquee gap-3 py-3 pl-3 motion-reduce:animate-none md:gap-4">
        {loop.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="relative h-32 w-[min(19vw,11.5rem)] shrink-0 overflow-hidden rounded-[0.65rem] sm:h-36 sm:w-[min(19vw,12rem)]"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 38vw, (max-width: 1200px) 19vw, 192px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

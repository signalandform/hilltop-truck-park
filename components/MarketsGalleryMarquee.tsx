"use client";

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

  const minVisibleTiles = 5;
  const baseImages =
    images.length >= minVisibleTiles
      ? images
      : Array.from(
          { length: minVisibleTiles },
          (_, index) => images[index % images.length],
        );
  const loop = [...baseImages, ...baseImages];

  return (
    <div className="mb-14 w-full overflow-hidden rounded-card border border-htp-line bg-htp-bg/80 shadow-sm">
      <div className="flex w-max animate-htp-marquee gap-4 py-4 pl-4 motion-reduce:animate-none md:gap-5">
        {loop.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="relative h-40 w-[min(24vw,15rem)] shrink-0 overflow-hidden rounded-[0.85rem] sm:h-48 sm:w-[min(24vw,16rem)] lg:h-56 lg:w-[min(24vw,18rem)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

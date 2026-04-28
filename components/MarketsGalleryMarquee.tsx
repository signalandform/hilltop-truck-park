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
    <div className="mb-12 w-full overflow-hidden rounded-card border border-htp-line bg-htp-bg/80 shadow-sm">
      <div className="flex w-max animate-htp-marquee gap-3 py-3 pl-3 motion-reduce:animate-none md:gap-4">
        {loop.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="relative h-32 w-[min(19vw,11.5rem)] shrink-0 overflow-hidden rounded-[0.65rem] sm:h-36 sm:w-[min(19vw,12rem)]"
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

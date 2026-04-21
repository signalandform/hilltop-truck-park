import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CMS_REVALIDATE, getGalleryPhotos } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Photo Fun! | Hilltop Truck Park",
  description:
    "Foam parties, photo ops, and family fun at Hilltop Truck Park in Northlake, TX.",
};

export const revalidate = CMS_REVALIDATE;

export default async function PhotoFunPage() {
  const photos = await getGalleryPhotos();

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Photo Fun!
        </h1>
        <div className="space-y-8 text-htp-ink leading-[1.55] mb-12">
          <p className="text-lg max-w-2xl mx-auto">
            Hilltop Truck Park is the perfect spot for family photos, group shots, and
            making memories. Enjoy our outdoor setup, colorful murals, and seasonal
            activities.
          </p>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto text-left">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Foam Parties
            </h2>
            <p>
              Foam parties are held weekly during the summer! Check our{" "}
              <Link href="/events" className="text-htp-red hover:underline font-medium">
                Events
              </Link>{" "}
              calendar for dates and times.
            </p>
          </div>
          <p>
            Bring the family, grab some food from our trucks, and capture the fun at
            Hilltop Truck Park.
          </p>
        </div>

        {photos.length === 0 ? (
          <p className="text-htp-ink/60 text-sm">
            Photos coming soon — check back later!
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {photos.map((photo, i) => {
              const alt = photo.alt_text ?? `Hilltop Truck Park photo ${i + 1}`;
              const hasDims = photo.width && photo.height;
              const isPriority = i < 4;
              return (
                <figure
                  key={photo.id}
                  className="mb-4 break-inside-avoid rounded-card overflow-hidden bg-htp-cream border border-htp-line shadow-sm"
                >
                  {hasDims ? (
                    <Image
                      src={photo.image_url}
                      alt={alt}
                      width={photo.width!}
                      height={photo.height!}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={isPriority}
                      className="w-full h-auto block"
                    />
                  ) : (
                    // Fallback for legacy photos without stored dimensions.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.image_url}
                      alt={alt}
                      loading="lazy"
                      className="w-full h-auto block"
                    />
                  )}
                  {photo.caption && (
                    <figcaption className="text-htp-ink text-sm px-3 py-2 text-left">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

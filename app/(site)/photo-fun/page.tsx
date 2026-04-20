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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 auto-rows-[120px]">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className={`relative rounded-card overflow-hidden bg-htp-cream ${
                  photo.is_featured ? "col-span-2 row-span-2" : ""
                }`}
              >
                <Image
                  src={photo.image_url}
                  alt={photo.alt_text ?? `Hilltop Truck Park photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs px-2 py-2 text-left">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

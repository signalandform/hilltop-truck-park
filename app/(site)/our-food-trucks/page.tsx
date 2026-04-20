import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFoodTrucks, CMS_REVALIDATE } from "@/lib/cms";

export const revalidate = CMS_REVALIDATE;

export const metadata: Metadata = {
  title: "Our Food Trucks | Hilltop Truck Park",
  description: "Discover the rotating lineup of food trucks at Hilltop Truck Park in Northlake, TX.",
};

export default async function OurFoodTrucksPage() {
  const trucks = await getFoodTrucks();

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Our Food Trucks
        </h1>
        <div className="space-y-6 text-htp-ink leading-[1.55] mb-12">
          <p className="text-lg max-w-2xl mx-auto">
            Hilltop Truck Park features a rotating lineup of local food trucks, bringing variety and
            great eats to Northlake, TX every week.
          </p>
          <p>
            Our schedule changes regularly, so check our{" "}
            <Link href="/markets" className="text-htp-red hover:underline font-medium">
              Markets
            </Link>{" "}
            page for upcoming farmers markets, or our{" "}
            <Link href="/events" className="text-htp-red hover:underline font-medium">
              Events
            </Link>{" "}
            page for paint classes, raffles, and more.
          </p>
        </div>

        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 mb-12 mx-auto max-w-2xl text-left">
          <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-4">
            Interested in Joining Us?
          </h2>
          <p className="text-htp-ink leading-[1.55]">
            Food truck owners: if you&apos;d like to schedule with Hilltop Truck Park, please
            fill out our{" "}
            <Link href="/vendor-requests" className="text-htp-red hover:underline font-medium">
              Vendor Request
            </Link>{" "}
            form or email{" "}
            <a href="mailto:info@hilltoptruckpark.com" className="text-htp-red hover:underline font-medium">
              info@hilltoptruckpark.com
            </a>
            .
          </p>
        </div>

        <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-6">
          Our Trucks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map((truck) => (
            <div
              key={truck.id}
              className="bg-htp-cream border border-htp-line rounded-card shadow-sm overflow-hidden"
            >
              {truck.image_url && (
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={truck.image_url}
                    alt={truck.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-1">
                  {truck.name}
                </h3>
                <p className="text-sm text-htp-red mb-3">{truck.cuisine}</p>
                {truck.blurb && (
                  <p className="text-htp-ink text-sm leading-[1.55]">{truck.blurb}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

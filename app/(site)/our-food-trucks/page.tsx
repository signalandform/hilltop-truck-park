import type { Metadata } from "next";
import Link from "next/link";
import { BottlecapImageFrame } from "@/components/decor/BottlecapImageFrame";
import { resolveFoodTruckImageUrl } from "@/lib/food-truck-logos";
import {
  getFoodTruckDisplayBlurb,
  getFoodTruckDisplayName,
} from "@/lib/food-truck-overrides";
import { getFoodTrucks, CMS_REVALIDATE } from "@/lib/cms";

export const revalidate = CMS_REVALIDATE;

export const metadata: Metadata = {
  title: "Our Food Trucks | Hilltop Truck Park",
  description:
    "Ten permanent food trucks open daily at Hilltop Truck Park in Northlake, TX, plus visiting trucks and markets.",
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
            Hilltop Truck Park features 10 permanent trucks that are open daily, as well as a
            rotating lineup of visiting trucks to keep things fresh and interesting.
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
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {trucks.map((truck) => {
            const imageSrc = resolveFoodTruckImageUrl(truck);
            const displayBlurb = getFoodTruckDisplayBlurb(truck.name, truck.blurb);
            const displayName = getFoodTruckDisplayName(truck.name);
            const bottlecapImage = imageSrc ? (
              <BottlecapImageFrame
                id={truck.id}
                src={imageSrc}
                alt=""
              />
            ) : null;
            return (
            <article
              key={truck.id}
              className="flex flex-col items-center text-center"
            >
              {bottlecapImage &&
                (truck.website_url ? (
                  <a
                    href={truck.website_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${displayName}`}
                    className="group inline-flex rounded-full transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-htp-red"
                  >
                    {bottlecapImage}
                  </a>
                ) : (
                  bottlecapImage
                ))}
              <div className="mt-5 max-w-sm">
                <h3 className="font-display text-xl text-htp-navy uppercase tracking-[0.04em] mb-1">
                  {displayName}
                </h3>
                <p className="text-sm text-htp-red mb-3">{truck.cuisine}</p>
                {displayBlurb && (
                  <p className="text-htp-ink text-sm leading-[1.55]">{displayBlurb}</p>
                )}
                {truck.website_url && (
                  <a
                    href={truck.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-htp-red hover:underline"
                  >
                    Visit Truck
                  </a>
                )}
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

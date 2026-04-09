import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Food Trucks | Hilltop Truck Park",
  description: "Discover the rotating lineup of food trucks at Hilltop Truck Park in Northlake, TX.",
};

export default function OurFoodTrucksPage() {
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
            <Link href="/events" className="text-htp-red hover:underline font-medium">
              Events
            </Link>{" "}
            page for the latest lineup, farmers markets, and special events.
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
          {[
            { name: "Taco Truck", cuisine: "Tex-Mex", blurb: "Fresh tacos, burritos, and more." },
            { name: "BBQ Pit Stop", cuisine: "BBQ", blurb: "Slow-smoked meats and classic sides." },
            { name: "Burgers & Fries", cuisine: "American", blurb: "Juicy burgers and hand-cut fries." },
            { name: "Sushi Roll", cuisine: "Japanese", blurb: "Fresh rolls and poke bowls." },
            { name: "Sweet Treats", cuisine: "Desserts", blurb: "Ice cream, shaved ice, and more." },
            { name: "Pizza on Wheels", cuisine: "Italian", blurb: "Wood-fired pies and calzones." },
            { name: "Pho King Good", cuisine: "Vietnamese", blurb: "Noodle bowls and banh mi." },
            { name: "Smokehouse", cuisine: "BBQ", blurb: "Texas-style smoked brisket." },
            { name: "Breakfast Burrito Co", cuisine: "Breakfast", blurb: "Morning fuel on the go." },
            { name: "Elote & More", cuisine: "Street Food", blurb: "Mexican street corn and snacks." },
          ].map((truck, i) => (
            <div
              key={i}
              className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-6"
            >
              <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-1">
                {truck.name}
              </h3>
              <p className="text-sm text-htp-red mb-3">{truck.cuisine}</p>
              <p className="text-htp-ink text-sm leading-[1.55]">{truck.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

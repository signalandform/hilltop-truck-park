import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Hilltop Truck Park",
  description: "Admission, parking, and event pricing at Hilltop Truck Park in Northlake, TX.",
};

export default function PricingPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Pricing
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Hilltop Truck Park offers affordable admission and parking for visitors. Pricing may vary
          for special events, farmers markets, and themed nights.
        </p>

        <div className="grid gap-6 mb-12 max-w-2xl mx-auto text-left">
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              General Admission
            </h2>
            <p className="text-htp-ink leading-[1.55]">Free admission to the park. Enjoy the food trucks, playground, and atmosphere.</p>
          </div>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Parking
            </h2>
            <p className="text-htp-ink leading-[1.55]">Free parking is available on-site at 8150 Thompson Rd, Northlake, TX.</p>
          </div>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Food &amp; Drinks
            </h2>
            <p className="text-htp-ink leading-[1.55]">Purchases are made directly from our rotating food trucks. Each truck sets its own prices.</p>
          </div>
        </div>

        <p className="text-htp-ink leading-[1.55] max-w-2xl mx-auto">
          For vendor pricing, market sign-ups, and special event details, visit our{" "}
          <Link href="/vendor-requests" className="text-htp-red hover:underline font-medium">
            Vendor Requests
          </Link>{" "}
          page or contact us at{" "}
          <a href="mailto:info@hilltoptruckpark.com" className="text-htp-red hover:underline font-medium">
            info@hilltoptruckpark.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Store | Hilltop Truck Park",
  description: "Shop Hilltop Truck Park merchandise and more.",
};

export default function OnlineStorePage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Online Store
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Shop Hilltop Truck Park merchandise, apparel, and more. Our online store is coming soon.
        </p>
        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 text-center max-w-xl mx-auto">
          <p className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
            Store Coming Soon
          </p>
          <p className="text-htp-ink text-sm leading-[1.55]">
            Check back later for merch, swag, and more. In the meantime, visit us in person at
            8150 Thompson Rd, Northlake, TX!
          </p>
        </div>
      </div>
    </section>
  );
}

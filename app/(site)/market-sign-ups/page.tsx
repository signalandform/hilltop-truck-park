import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Market Sign-Ups | Hilltop Truck Park",
  description: "Farmers market and vendor sign-ups at Hilltop Truck Park in Northlake, TX.",
};

const marketPlaceholders = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Market ${i + 1}`,
  description: "Join us for local vendors, fresh produce, and community fun.",
}));

export default function MarketSignUpsPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Market Sign-Ups
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-10 max-w-2xl mx-auto">
          Hilltop Truck Park hosts farmers markets, twilight markets, and special vendor events
          throughout the year.
        </p>

        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 mb-12 mx-auto max-w-2xl text-left">
          <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-4">
            Event Calendar (Coming Soon)
          </h2>
          <p className="mb-4 text-htp-ink leading-[1.55]">
            Our full event calendar and registration links will be available here soon.
          </p>
          <p className="text-htp-ink leading-[1.55]">
            For now, follow us on social media or contact{" "}
            <a href="mailto:info@hilltoptruckpark.com" className="text-htp-red hover:underline font-medium">
              info@hilltoptruckpark.com
            </a>{" "}
            for the latest market information.
          </p>
        </div>

        <div className="border-t border-htp-line pt-8 mb-12 max-w-2xl mx-auto text-left">
          <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-6">
            Regular Offerings
          </h2>
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <span className="px-3 py-1 bg-htp-navy text-white rounded-full text-xs font-medium tracking-wider uppercase">
              FOOD
            </span>
            <span className="px-3 py-1 bg-htp-navy text-white rounded-full text-xs font-medium tracking-wider uppercase">
              DRINKS
            </span>
            <span className="px-3 py-1 bg-htp-red text-white rounded-full text-xs font-medium tracking-wider uppercase">
              LIVE MUSIC
            </span>
            <span className="px-3 py-1 bg-htp-red text-white rounded-full text-xs font-medium tracking-wider uppercase">
              KIDS
            </span>
            <span className="px-3 py-1 bg-htp-navy text-white rounded-full text-xs font-medium tracking-wider uppercase">
              VENDOR
            </span>
          </div>
          <ul className="space-y-2 text-htp-ink leading-[1.55]">
            <li>• Farmers markets (seasonal)</li>
            <li>• Twilight markets</li>
            <li>• Live music</li>
            <li>• Crawfish pre-orders — see <Link href="/crawfish-pre-orders" className="text-htp-red hover:underline font-medium">Crawfish Pre-Orders</Link></li>
            <li>• Foam parties (summer)</li>
            <li>• Themed events (Vegas Night, Galentine&apos;s, Halloween, etc.)</li>
          </ul>
        </div>

        <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-6">
          Markets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {marketPlaceholders.map((market) => (
            <div
              key={market.id}
              className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-6"
            >
              <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
                {market.name}
              </h3>
              <p className="text-sm text-htp-ink leading-[1.55] mb-4">
                {market.description}
              </p>
              <span className="inline-block px-4 py-2 bg-htp-navy text-white rounded-btn text-sm font-medium opacity-60 cursor-not-allowed">
                Sign up (Coming soon)
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

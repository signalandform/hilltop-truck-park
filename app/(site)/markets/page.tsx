import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getUpcomingMarkets, getPastMarkets, CMS_REVALIDATE } from "@/lib/cms";

export const revalidate = CMS_REVALIDATE;

export const metadata: Metadata = {
  title: "Market Sign-Ups | Hilltop Truck Park",
  description:
    "Sign up for upcoming farmers markets, twilight markets, and vendor market events at Hilltop Truck Park in Northlake, TX.",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function MarketsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingMarkets(),
    getPastMarkets(),
  ]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Market Sign-Ups
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Join us at our farmers markets and twilight markets as a vendor or shopper. Sign up
          below for upcoming markets at Hilltop Truck Park.
        </p>

        {upcoming.length > 0 ? (
          <>
            <h2 className="font-display text-htp-h2 md:text-3xl text-htp-navy uppercase tracking-[0.04em] mb-8">
              Upcoming Markets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {upcoming.map((market) => (
                <Link
                  key={market.slug}
                  href={`/markets/${market.slug}`}
                  className="bg-htp-cream border border-htp-line rounded-card shadow-sm overflow-hidden hover:border-htp-red/50 transition-colors block text-left"
                >
                  {market.image_url && (
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={market.image_url}
                        alt={market.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {market.event_date && (
                      <p className="text-xs font-medium text-htp-red uppercase tracking-wider mb-2">
                        {formatDate(market.event_date)}
                      </p>
                    )}
                    <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
                      {market.title}
                    </h3>
                    {market.location && (
                      <p className="text-sm text-htp-ink/60 mb-3">{market.location}</p>
                    )}
                    <p className="text-htp-ink text-sm leading-[1.55] mb-4 line-clamp-2">
                      {market.description}
                    </p>
                    <span className="inline-block px-4 py-2 bg-htp-red text-white rounded-btn text-sm font-medium">
                      {market.signup_enabled ? "Sign Up" : "Learn More"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-xl mx-auto mb-16">
            <p className="text-htp-ink leading-[1.55]">
              No upcoming markets right now. Follow us on social media for the latest updates, or
              check back soon!
            </p>
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 className="font-display text-htp-h3 text-htp-navy/60 uppercase tracking-[0.04em] mb-6">
              Past Markets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 opacity-70">
              {past.map((market) => (
                <Link
                  key={market.slug}
                  href={`/markets/${market.slug}`}
                  className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-4 hover:border-htp-line/80 transition-colors block text-left"
                >
                  {market.event_date && (
                    <p className="text-xs text-htp-ink/50 mb-1">
                      {formatDate(market.event_date)}
                    </p>
                  )}
                  <h3 className="font-display text-sm text-htp-navy uppercase tracking-[0.04em]">
                    {market.title}
                  </h3>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

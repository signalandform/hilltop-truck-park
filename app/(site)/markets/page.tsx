import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MarketsGalleryMarquee, type MarketGallerySlide } from "@/components/MarketsGalleryMarquee";
import {
  getUpcomingMarkets,
  getGalleryPhotos,
  CMS_REVALIDATE,
  type GalleryPhoto,
} from "@/lib/cms";

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

/** Local photos used to pad the marquee when the CMS gallery has few images. */
const MARKET_GALLERY_FALLBACK_SRCS = [
  "/images/photo-fun/51d5cc_726edf8198ac4150bc38f6f8ff9b1bab_mv2.jpeg",
  "/images/photo-fun/51d5cc_afcf3b951e9a40608d78dbc9d69f2887_mv2.jpeg",
  "/images/photo-fun/51d5cc_0537c9933c1e4addb6834ea30d3a66b1_mv2.jpeg",
  "/images/photo-fun/51d5cc_5a71b62c35b64391b5f542f9065018ef_mv2.jpeg",
  "/images/photo-fun/51d5cc_8500e7ed553b4bc2bc31395ed1d48361_mv2.jpg",
  "/images/photo-fun/51d5cc_b2fc845f3661414281da3072ba73185e_mv2.jpg",
  "/images/photo-fun/51d5cc_b6820355573b4d9f93fe2abadf2e8a39_mv2.jpg",
  "/images/photo-fun/51d5cc_c65e42edd1e14da3b19625ea6ba79e44_mv2.jpg",
  "/images/photo-fun/51d5cc_cc1ae1773a534e68a8689b4ca71cdb0c_mv2.jpg",
  "/images/photo-fun/51d5cc_d2bad7e356ef45f5921adc6050cf568c_mv2.jpeg",
];

const MARKET_GALLERY_MAX_SLIDES = 14;

function buildMarketGallerySlides(photos: GalleryPhoto[]): MarketGallerySlide[] {
  const seen = new Set<string>();
  const out: MarketGallerySlide[] = [];
  for (const p of photos) {
    if (out.length >= MARKET_GALLERY_MAX_SLIDES) break;
    const src = p.image_url?.trim();
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push({
      src,
      alt: p.alt_text?.trim() || "Hilltop Truck Park",
    });
  }
  for (const src of MARKET_GALLERY_FALLBACK_SRCS) {
    if (out.length >= MARKET_GALLERY_MAX_SLIDES) break;
    if (!seen.has(src)) {
      seen.add(src);
      out.push({ src, alt: "Hilltop Truck Park" });
    }
  }
  return out;
}

export default async function MarketsPage() {
  const [upcoming, galleryPhotos] = await Promise.all([
    getUpcomingMarkets(),
    getGalleryPhotos(),
  ]);
  const marketGallerySlides = buildMarketGallerySlides(galleryPhotos);

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Market Sign-Ups
        </h1>

        <div className="mb-14 max-w-3xl mx-auto text-left">
          <div className="htp-card-highlight p-6 sm:p-8">
            <p className="font-accent text-sm uppercase tracking-[0.12em] text-htp-red mb-2">
              Hilltop Truck Park
            </p>
            <h2 className="font-display text-htp-h2 md:text-3xl text-htp-navy uppercase tracking-[0.04em] mb-8">
              Farmers / Twilight Market Vendor Information
            </h2>

            <div className="space-y-8 text-htp-ink leading-[1.55]">
              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  Market Hours
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong className="font-medium text-htp-navy">Twilight Market:</strong> Saturdays,
                    5:00–9:00 PM
                  </li>
                  <li>
                    <strong className="font-medium text-htp-navy">Farmers Market:</strong> Sundays,
                    10:00 AM–2:00 PM
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  Location
                </h3>
                <p>8150 Thompson Rd, Northlake, TX 76247</p>
              </section>

              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  Registration &amp; Fees
                </h3>
                <p className="mb-3">
                  Sign up online to reserve your date and pay for your spot. Visit{" "}
                  <Link
                    href="/events"
                    className="text-htp-red hover:underline font-medium"
                  >
                    hilltoptruckpark.com/events
                  </Link>{" "}
                  and look under the Farmers Market tab (scroll down).
                </p>
                <p>
                  <strong className="font-medium text-htp-navy">Vendor fee:</strong> $50 per market,
                  or $60 with electricity (electric spots are limited, so book early).
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  Setup Requirements
                </h3>
                <p className="mb-3">
                  Vendors must provide their own tent and table. Side walls are strongly recommended,
                  as the hilltop location can be windy.
                </p>
                <p>
                  First-time vendor? No need to worry — a staff member will be on site to help you
                  find your spot and get set up.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  Setup Times
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong className="font-medium text-htp-navy">Saturdays:</strong> arrive starting
                    at 3:00 PM
                  </li>
                  <li>
                    <strong className="font-medium text-htp-navy">Sundays:</strong> arrive starting
                    at 8:00 AM
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  Vendor Categories
                </h3>
                <p>
                  To prevent oversaturation, we cap the number of vendors in certain categories per
                  market — currently sourdough, tallow, and permanent jewelry. Please confirm
                  availability when registering.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  Spot Assignments
                </h3>
                <p>
                  A market map showing each vendor&apos;s assigned spot will be emailed out the week
                  of your scheduled market (typically mid-week). On-site staff will also be
                  available the day of to help you locate your space.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-3">
                  On-Site Rules
                </h3>
                <p className="font-medium text-htp-navy">Do not drive on the turf.</p>
              </section>
            </div>
          </div>
        </div>

        <MarketsGalleryMarquee images={marketGallerySlides} />

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
                  className="htp-card block cursor-pointer overflow-hidden text-left transition-colors hover:border-htp-red/50"
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
                    <span className="htp-btn-primary !pointer-events-none inline-flex !px-4 !py-2 !text-sm">
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
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getMarket,
  getMarketSlugs,
  getMarketTicketTypes,
  getTicketTypeSignupCounts,
  CMS_REVALIDATE,
} from "@/lib/cms";
import { MarketSignupForm } from "@/components/MarketSignupForm";

export const revalidate = CMS_REVALIDATE;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getMarketSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const market = await getMarket(slug);
  if (!market) return { title: "Market | Hilltop Truck Park" };
  return {
    title: `${market.title} | Hilltop Truck Park`,
    description: market.description,
  };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function MarketDetailPage({ params }: Props) {
  const { slug } = await params;
  const market = await getMarket(slug);
  if (!market) notFound();

  const formattedDate = formatDate(market.event_date);

  const [ticketTypes, signupCounts] = market.signup_enabled
    ? await Promise.all([
        getMarketTicketTypes(market.id),
        getTicketTypeSignupCounts(market.id),
      ])
    : [[], {}];

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <Link
          href="/markets"
          className="text-htp-red hover:underline text-sm mb-8 inline-block font-medium"
        >
          ← Back to Markets
        </Link>
        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm overflow-hidden max-w-2xl mx-auto">
          {market.image_url && (
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={market.image_url}
                alt={market.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}
          <div className="p-8">
            {formattedDate && (
              <p className="text-sm font-medium text-htp-red uppercase tracking-wider mb-3">
                {formattedDate}
              </p>
            )}
            <h1 className="font-display text-htp-h1 md:text-4xl text-htp-navy uppercase tracking-[0.04em] mb-4">
              {market.title}
            </h1>
            {market.location && (
              <p className="text-htp-ink/60 mb-4">{market.location}</p>
            )}
            <p className="text-htp-ink leading-[1.55] mb-6">{market.description}</p>

            {!market.signup_enabled && (
              <Link
                href="/contact-us"
                className="inline-block px-6 py-3 bg-htp-red text-white rounded-btn font-medium hover:bg-[#a32e28] transition-colors"
              >
                Get in touch
              </Link>
            )}

            {market.signup_enabled && (
              <MarketSignupForm
                marketId={market.id}
                marketTitle={market.title}
                ticketTypes={ticketTypes}
                signupCounts={signupCounts}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

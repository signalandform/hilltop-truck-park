import Link from "next/link";
import Image from "next/image";
import { getPageSections, CMS_REVALIDATE } from "@/lib/cms";
import { SectionWave } from "@/components/decor/SectionWave";

export const revalidate = CMS_REVALIDATE;

type HeroContent = {
  heading: string;
  tagline: string;
  description: string;
  logo_src: string;
};

type HoursContent = {
  heading: string;
  hours: { day: string; time: string }[];
};

type VisitUsContent = {
  heading: string;
  address: string;
  email: string;
};

type TextSection = {
  heading: string;
  body: string;
};

type CtaSection = {
  heading: string;
  link_href: string;
  link_text: string;
};

export default async function HomePage() {
  const sections = await getPageSections("home");

  const hero = sections.hero as HeroContent | undefined;
  const hoursData = sections.hours as HoursContent | undefined;
  const visitUs = sections.visit_us as VisitUsContent | undefined;
  const values = sections.values as TextSection | undefined;
  const enjoy = sections.enjoy as TextSection | undefined;
  const drinkUp = sections.drink_up as TextSection | undefined;
  const foodTruckCta = sections.food_truck_cta as CtaSection | undefined;

  return (
    <>
      {/* Hero — full-bleed photo, navy overlay, light text */}
      <section className="htp-hero relative z-[1] flex min-h-[min(90vh,640px)] items-center justify-center overflow-hidden px-4 pb-32 pt-24 sm:pb-40 sm:pt-28">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hilltop-mural-hero.png"
            alt="Greetings from Hilltop — mural at Hilltop Truck Park"
            fill
            priority
            className="object-cover object-[center_35%] sm:object-center"
            sizes="100vw"
          />
          {/* Base dim — tames saturated mural art */}
          <div className="absolute inset-0 bg-htp-navy/50" aria-hidden />
          {/* Darker in the center where the copy sits */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_100%_88%_at_50%_40%,rgb(8_20_32_/_0.88),rgb(8_20_32_/_0.4)_55%,rgb(8_20_32_/_0.15)_100%)]"
            aria-hidden
          />
          {/* Top/bottom: slightly darker for text + transition to next section */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-htp-navy/30 via-transparent to-htp-navy/50"
            aria-hidden
          />
        </div>

        <div className="mx-auto w-full max-w-3xl px-0 sm:max-w-4xl">
          <div className="htp-hero-panel">
            <div className="htp-hero-anim htp-hero-prose text-center text-white">
              <p className="font-accent text-xl tracking-[0.14em] text-white/90 md:text-2xl">
                Northlake, Texas
              </p>
              <div className="mb-6 mt-2 flex justify-center sm:mb-8">
                <Image
                  src={hero?.logo_src ?? "/images/IMG_0935.png"}
                  alt="Hilltop Truck Park"
                  width={320}
                  height={128}
                  className="h-28 w-auto max-w-full [filter:drop-shadow(0_2px_4px_rgb(0_0_0_/_0.6))] sm:h-32 md:h-36"
                />
              </div>
              <h1 className="mb-4 font-display text-htp-h1 sm:mb-6 md:text-5xl lg:text-[3.5rem]">
                {hero?.heading ?? "Hilltop Truck Park"}
              </h1>
              <p className="mb-3 text-balance text-lg text-white/95 sm:mb-4 md:text-xl">
                {hero?.tagline ?? "Eat. Sip. Hang out."}
              </p>
              <p className="mx-auto mb-8 max-w-xl text-balance text-base text-white/85 sm:mb-9">
                {hero?.description ??
                  "Your local food truck court for great eats, events, and family fun in Northlake, TX."}
              </p>
              <div
                className="htp-hero-cta-grid"
                role="group"
                aria-label="Key links"
              >
                <Link href="/events" className="htp-btn-primary htp-hero-cta-primary">
                  See what&apos;s on this week
                </Link>
                <Link href="/markets" className="htp-btn-secondary htp-hero-cta-outline">
                  Market Sign-Ups
                </Link>
                <Link
                  href="/our-food-trucks"
                  className="htp-btn-secondary htp-hero-cta-outline"
                >
                  Our Food Trucks
                </Link>
                <Link
                  href="/contact-us"
                  className="htp-btn-secondary htp-hero-cta-outline"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionWave
        fill="htp-cream"
        className="relative z-10 -mt-10 sm:-mt-14"
      />

      {/* Hours */}
      <section className="htp-surface-cream">
        <div className="max-w-content mx-auto px-4 pb-24 pt-2">
          <h2 className="htp-section-heading mb-10">
            {hoursData?.heading ?? "When We\u2019re Pourin\u2019"}
          </h2>
          <div className="htp-card max-w-2xl mx-auto p-8">
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 md:grid-cols-7">
              {(hoursData?.hours ?? []).map(({ day, time }) => (
                <div key={day}>
                  <p className="font-display text-sm uppercase tracking-[0.04em] text-htp-navy">
                    {day}
                  </p>
                  <p className="mt-1 text-sm text-htp-ink">{time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionWave fill="htp-bg" className="relative z-10" />

      {/* Visit Us */}
      <section className="htp-surface">
        <div className="max-w-content mx-auto px-4 pb-24 pt-2">
          <h2 className="htp-section-heading mb-10">
            {visitUs?.heading ?? "Visit Us"}
          </h2>
          <div className="htp-card-highlight max-w-2xl mx-auto p-8 text-center">
            <p className="text-lg text-htp-ink">
              {visitUs?.address ?? "8150 Thompson Rd, Northlake, TX 76247"}
            </p>
            <a
              href={`mailto:${visitUs?.email ?? "info@hilltoptruckpark.com"}`}
              className="mt-1 inline-block text-lg font-medium text-htp-red hover:underline"
            >
              {visitUs?.email ?? "info@hilltoptruckpark.com"}
            </a>
          </div>
        </div>
      </section>

      {values && (
        <>
          <SectionWave fill="htp-cream-2" className="relative z-10" />
          <section className="htp-surface-cream-2">
            <div className="max-w-content mx-auto px-4 pb-24 pt-2">
              <h2 className="htp-section-heading mb-8">{values.heading}</h2>
              <p className="mx-auto max-w-3xl text-center text-htp-ink leading-[1.55]">
                {values.body}
              </p>
            </div>
          </section>
        </>
      )}

      {enjoy && (
        <>
          {values ? (
            <SectionWave
              fill="htp-bg"
              className="relative z-10"
              flip
            />
          ) : (
            <SectionWave fill="htp-cream" className="relative z-10" />
          )}
          <section
            className={values ? "htp-surface" : "htp-surface-cream"}
          >
            <div className="max-w-content mx-auto px-4 pb-24 pt-2">
              <h2 className="htp-section-heading mb-8">{enjoy.heading}</h2>
              <p className="mx-auto max-w-3xl text-center text-htp-ink leading-[1.55]">
                {enjoy.body}
              </p>
            </div>
          </section>
        </>
      )}

      {drinkUp && (
        <>
          <SectionWave
            fill={(!enjoy && values) || (enjoy && !values) ? "htp-bg" : "htp-cream"}
            className="relative z-10"
            flip={Boolean(values && !enjoy)}
          />
          <section
            className={
              (!enjoy && values) || (enjoy && !values)
                ? "htp-surface"
                : "htp-surface-cream"
            }
          >
            <div className="max-w-content mx-auto px-4 pb-24 pt-2">
              <h2 className="htp-section-heading mb-8">{drinkUp.heading}</h2>
              <p className="mx-auto max-w-3xl text-center text-htp-ink leading-[1.55]">
                {drinkUp.body}
              </p>
            </div>
          </section>
        </>
      )}

      {foodTruckCta && (
        <>
          <SectionWave fill="htp-bg" className="relative z-10" />
          <section className="htp-surface">
            <div className="max-w-content mx-auto px-4 pb-24 pt-2 text-center">
              <div className="htp-card-highlight mx-auto max-w-2xl p-8 sm:p-10">
                <h2 className="htp-section-heading mb-4 sm:mb-6 !text-htp-h2">
                  {foodTruckCta.heading}
                </h2>
                <Link
                  href={foodTruckCta.link_href}
                  className="htp-btn-primary inline-flex"
                >
                  {foodTruckCta.link_text}
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

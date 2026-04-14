import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageMap";
import { getPageSections, CMS_REVALIDATE } from "@/lib/cms";

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

  const heroImg = getImageUrl(
    "https://static.wixstatic.com/media/51d5cc_dfd6534550a14e14af0cc44b5a2c7825~mv2.png"
  );

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[400px] flex items-center justify-center bg-htp-bg px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src={hero?.logo_src ?? "/images/IMG_0935.png"}
              alt="Hilltop Truck Park"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </div>
          <h1 className="font-display text-htp-h1 md:text-5xl lg:text-[3.5rem] text-htp-navy uppercase tracking-[0.04em] mb-6">
            {hero?.heading ?? "Hilltop Truck Park"}
          </h1>
          <p className="text-lg md:text-xl text-htp-ink/90 mb-8 leading-[1.55]">
            {hero?.tagline ?? "Eat. Sip. Hang out."}
          </p>
          <p className="text-base text-htp-ink/80 mb-10 max-w-xl mx-auto">
            {hero?.description ?? "Your local food truck court for great eats, events, and family fun in Northlake, TX."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/events"
              className="px-8 py-3 bg-htp-red text-htp-bg rounded-btn font-medium hover:bg-[#a32e28] transition-colors"
            >
              See what&apos;s on this week
            </Link>
            <Link
              href="/our-food-trucks"
              className="px-8 py-3 border-2 border-htp-navy text-htp-navy rounded-btn font-medium hover:bg-htp-navy/10 transition-colors"
            >
              Our Food Trucks
            </Link>
            <Link
              href="/contact-us"
              className="px-8 py-3 border-2 border-htp-navy text-htp-navy rounded-btn font-medium hover:bg-htp-navy/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="py-24 px-4 bg-htp-cream">
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-12">
            {hoursData?.heading ?? "When We\u2019re Pourin\u2019"}
          </h2>
          <div className="bg-htp-bg border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-center">
              {(hoursData?.hours ?? []).map(({ day, time }) => (
                <div key={day}>
                  <p className="font-display text-htp-navy uppercase tracking-[0.04em] text-sm">
                    {day}
                  </p>
                  <p className="text-htp-ink text-sm mt-1">{time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-24 px-4">
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-12">
            {visitUs?.heading ?? "Visit Us"}
          </h2>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto text-center">
            <p className="text-lg text-htp-ink mb-2">{visitUs?.address ?? "8150 Thompson Rd, Northlake, TX 76247"}</p>
            <a
              href={`mailto:${visitUs?.email ?? "info@hilltoptruckpark.com"}`}
              className="text-htp-red hover:underline text-lg font-medium"
            >
              {visitUs?.email ?? "info@hilltoptruckpark.com"}
            </a>
          </div>
        </div>
      </section>

      {/* Values */}
      {values && (
        <section className="py-24 px-4 bg-htp-cream">
          <div className="max-w-content mx-auto">
            <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-8">
              {values.heading}
            </h2>
            <p className="text-htp-ink leading-[1.55] max-w-3xl mx-auto text-center">
              {values.body}
            </p>
          </div>
        </section>
      )}

      {/* Enjoy */}
      {enjoy && (
        <section className="py-24 px-4">
          <div className="max-w-content mx-auto">
            <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-8">
              {enjoy.heading}
            </h2>
            <p className="text-htp-ink leading-[1.55] max-w-3xl mx-auto text-center">
              {enjoy.body}
            </p>
          </div>
        </section>
      )}

      {/* Drink up */}
      {drinkUp && (
        <section className="py-24 px-4 bg-htp-cream">
          <div className="max-w-content mx-auto">
            <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-8">
              {drinkUp.heading}
            </h2>
            <p className="text-htp-ink leading-[1.55] max-w-3xl mx-auto text-center">
              {drinkUp.body}
            </p>
          </div>
        </section>
      )}

      {/* Food Truck CTA */}
      {foodTruckCta && (
        <section className="py-24 px-4">
          <div className="max-w-content mx-auto text-center">
            <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] mb-6">
              {foodTruckCta.heading}
            </h2>
            <Link
              href={foodTruckCta.link_href}
              className="inline-block px-8 py-3 bg-htp-red text-htp-bg rounded-btn font-medium hover:bg-[#a32e28] transition-colors"
            >
              {foodTruckCta.link_text}
            </Link>
          </div>
        </section>
      )}

      {/* Hero image */}
      <section className="py-24 px-4 bg-htp-cream">
        <div className="max-w-content mx-auto">
          <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden">
            <Image
              src={heroImg}
              alt="Hilltop Truck Park"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </div>
      </section>
    </>
  );
}

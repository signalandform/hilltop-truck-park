import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageMap";

export default function HomePage() {
  const heroImg = getImageUrl(
    "https://static.wixstatic.com/media/51d5cc_dfd6534550a14e14af0cc44b5a2c7825~mv2.png"
  );

  const hours = [
    { day: "MON", time: "4–10PM" },
    { day: "TUES", time: "2–10PM" },
    { day: "WED", time: "12–10PM" },
    { day: "THU", time: "12–10PM" },
    { day: "FRI", time: "12–10PM" },
    { day: "SAT", time: "12–10PM" },
    { day: "SUN", time: "10–10PM" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[400px] flex items-center justify-center bg-htp-bg px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/IMG_0935.png"
              alt="Hilltop Truck Park"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </div>
          <h1 className="font-display text-htp-h1 md:text-5xl lg:text-[3.5rem] text-htp-navy uppercase tracking-[0.04em] mb-6">
            Hilltop Truck Park
          </h1>
          <p className="text-lg md:text-xl text-htp-ink/90 mb-8 leading-[1.55]">
            Eat. Sip. Hang out.
          </p>
          <p className="text-base text-htp-ink/80 mb-10 max-w-xl mx-auto">
            Your local food truck court for great eats, events, and family fun in Northlake, TX.
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

      {/* When We're Pourin' - Hours */}
      <section className="py-24 px-4 bg-htp-cream">
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-12">
            When We&apos;re Pourin&apos;
          </h2>
          <div className="bg-htp-bg border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-center">
              {hours.map(({ day, time }) => (
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

      {/* Visit Us / Location */}
      <section className="py-24 px-4">
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-12">
            Visit Us
          </h2>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto text-center">
            <p className="text-lg text-htp-ink mb-2">8150 Thompson Rd, Northlake, TX 76247</p>
            <a
              href="mailto:info@hilltoptruckpark.com"
              className="text-htp-red hover:underline text-lg font-medium"
            >
              info@hilltoptruckpark.com
            </a>
          </div>
        </div>
      </section>

      {/* What we do - Core values */}
      <section className="py-24 px-4 bg-htp-cream">
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-8">
            What we do...And we do it top shelf.
          </h2>
          <p className="text-htp-ink leading-[1.55] max-w-3xl mx-auto text-center">
            At Hilltop in Northlake, Texas, our success comes from living our core values every day.
            We put people first, focusing on what matters most to our guests and team, while
            delivering quality and an authentic Texas experience with integrity. Our purpose is to
            lead—capturing the heart and spirit of Texas—while innovating and improving. We foster
            open communication, respond quickly, fix what needs fixing, and adapt with purpose.
            Above all, we work hard and have fun, staying close to our customers and executing the
            basics every day to bring our values to life.
          </p>
        </div>
      </section>

      {/* Enjoy */}
      <section className="py-24 px-4">
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-8">
            Enjoy!
          </h2>
          <p className="text-htp-ink leading-[1.55] max-w-3xl mx-auto text-center">
            Where locals come to eat, sip, and kick back! Hilltop Truck Bar in Northlake, Texas,
            offers covered outdoor seating, a laid-back vibe, and plenty of room to hang out. Enjoy
            live music every weekend and exciting events all week long—making it the perfect spot
            for a night out with friends or just soaking in the local atmosphere.
          </p>
        </div>
      </section>

      {/* Drink up */}
      <section className="py-24 px-4 bg-htp-cream">
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] text-center mb-8">
            Drink up!
          </h2>
          <p className="text-htp-ink leading-[1.55] max-w-3xl mx-auto text-center">
            Grab an ice-cold beer and kick back at Hilltop Truck Bar—the perfect spot to hang out
            with friends, relax, and enjoy the local vibes. Whether you&apos;re stopping by after
            work or spending the evening out, we&apos;ve got the drinks, the atmosphere, and the
            good times waiting for you!
          </p>
        </div>
      </section>

      {/* Food Truck CTA */}
      <section className="py-24 px-4">
        <div className="max-w-content mx-auto text-center">
          <h2 className="font-display text-htp-h2 md:text-4xl text-htp-navy uppercase tracking-[0.04em] mb-6">
            Are you a Food Truck interested in scheduling with us?
          </h2>
          <Link
            href="/vendor-requests"
            className="inline-block px-8 py-3 bg-htp-red text-htp-bg rounded-btn font-medium hover:bg-[#a32e28] transition-colors"
          >
            Click Here
          </Link>
        </div>
      </section>

      {/* Image section */}
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

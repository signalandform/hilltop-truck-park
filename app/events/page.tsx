import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events | Hilltop Truck Park",
  description: "Upcoming events at Hilltop Truck Park in Northlake, TX.",
};

const events = [
  {
    slug: "live-music-night",
    title: "Live Music Night",
    description: "Join us for live music, great food, and a lively atmosphere under the string lights.",
    date: "Fridays",
  },
  {
    slug: "twilight-market",
    title: "Twilight Market",
    description: "Local vendors, fresh produce, and community vibes as the sun sets.",
    date: "Select Saturdays",
  },
  {
    slug: "foam-party",
    title: "Foam Party",
    description: "Summer foam parties for the whole family. Check dates for upcoming events.",
    date: "Summer weekends",
  },
];

export default function EventsPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          This Week on the Hill
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Hilltop Truck Park hosts farmers markets, live music, themed nights, crawfish boils, foam
          parties, and more throughout the year. Browse our events below.
        </p>
        <p className="mb-12">
          <Link href="/market-sign-ups" className="text-htp-red hover:underline font-medium">
            View market sign-ups →
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 hover:border-htp-red/50 transition-colors block"
            >
              <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
                {event.title}
              </h2>
              <p className="text-sm text-htp-ink/80 mb-4">{event.date}</p>
              <p className="text-htp-ink leading-[1.55] mb-6">{event.description}</p>
              <span className="text-htp-red font-medium hover:underline">Learn more →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

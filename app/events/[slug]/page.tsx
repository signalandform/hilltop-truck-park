import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const events: Record<
  string,
  { title: string; date: string; description: string }
> = {
  "live-music-night": {
    title: "Live Music Night",
    date: "Fridays",
    description:
      "Join us for live music, great food, and a lively atmosphere under the string lights. Local bands and artists take the stage while our food trucks serve up the best eats in DFW.",
  },
  "twilight-market": {
    title: "Twilight Market",
    date: "Select Saturdays",
    description:
      "Local vendors, fresh produce, and community vibes as the sun sets. Browse handmade goods, pick up seasonal produce, and enjoy the Hilltop Truck Park atmosphere.",
  },
  "foam-party": {
    title: "Foam Party",
    date: "Summer weekends",
    description:
      "Summer foam parties for the whole family. Cool off, have fun, and make memories. Check our calendar for upcoming foam party dates.",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(events).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = events[slug];
  if (!event) return { title: "Event | Hilltop Truck Park" };
  return {
    title: `${event.title} | Hilltop Truck Park`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = events[slug];
  if (!event) notFound();

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <Link
          href="/events"
          className="text-htp-red hover:underline text-sm mb-8 inline-block font-medium"
        >
          ← Back to Events
        </Link>
        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto">
          <h1 className="font-display text-htp-h1 md:text-4xl text-htp-navy uppercase tracking-[0.04em] mb-4">
            {event.title}
          </h1>
          <p className="text-htp-ink/80 mb-6">{event.date}</p>
          <p className="text-htp-ink leading-[1.55] mb-8">{event.description}</p>
          <Link
            href="/contact-us"
            className="inline-block px-6 py-3 bg-htp-red text-white rounded-btn font-medium hover:bg-[#a32e28] transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}

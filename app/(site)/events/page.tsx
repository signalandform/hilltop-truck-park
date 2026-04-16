import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getUpcomingEvents, getPastEvents, CMS_REVALIDATE } from "@/lib/cms";

export const revalidate = CMS_REVALIDATE;

export const metadata: Metadata = {
  title: "Events | Hilltop Truck Park",
  description: "Upcoming events, farmers markets, and twilight markets at Hilltop Truck Park in Northlake, TX.",
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

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Events
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Hilltop Truck Park hosts farmers markets, twilight markets, live music, and more
          throughout the year. Sign up for upcoming events below.
        </p>

        {/* Upcoming Events */}
        {upcoming.length > 0 ? (
          <>
            <h2 className="font-display text-htp-h2 md:text-3xl text-htp-navy uppercase tracking-[0.04em] mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {upcoming.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="bg-htp-cream border border-htp-line rounded-card shadow-sm overflow-hidden hover:border-htp-red/50 transition-colors block text-left"
                >
                  {event.image_url && (
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {event.event_date && (
                      <p className="text-xs font-medium text-htp-red uppercase tracking-wider mb-2">
                        {formatDate(event.event_date)}
                      </p>
                    )}
                    <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-sm text-htp-ink/60 mb-3">{event.location}</p>
                    )}
                    <p className="text-htp-ink text-sm leading-[1.55] mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <span className="inline-block px-4 py-2 bg-htp-red text-white rounded-btn text-sm font-medium">
                      {event.signup_enabled ? "Join Us!" : "Learn More"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-xl mx-auto mb-16">
            <p className="text-htp-ink leading-[1.55]">
              No upcoming events right now. Follow us on social media for the latest updates, or
              check back soon!
            </p>
          </div>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <>
            <h2 className="font-display text-htp-h3 text-htp-navy/60 uppercase tracking-[0.04em] mb-6">
              Past Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 opacity-70">
              {past.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-4 hover:border-htp-line/80 transition-colors block text-left"
                >
                  {event.event_date && (
                    <p className="text-xs text-htp-ink/50 mb-1">
                      {formatDate(event.event_date)}
                    </p>
                  )}
                  <h3 className="font-display text-sm text-htp-navy uppercase tracking-[0.04em]">
                    {event.title}
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

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getUpcomingEvents, CMS_REVALIDATE, type CmsEvent } from "@/lib/cms";
import { Badge } from "@/components/ui/Badge";

export const revalidate = CMS_REVALIDATE;

export const metadata: Metadata = {
  title: "Events | Hilltop Truck Park",
  description:
    "Ticketed events, paint classes, raffles, and more at Hilltop Truck Park in Northlake, TX.",
};

function EventCard({ event }: { event: CmsEvent }) {
  return (
    <article className="htp-card overflow-hidden flex flex-col text-left">
      {event.image_url && (
        <div className="relative w-full aspect-[4/3] bg-htp-navy/5">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {event.date_label && (
            <p className="text-xs font-medium text-htp-red uppercase tracking-wider">
              {event.date_label}
            </p>
          )}
          {event.tag && <Badge>{event.tag}</Badge>}
        </div>
        <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
          {event.title}
        </h3>
        {event.location && (
          <p className="text-sm text-htp-ink/60 mb-3">{event.location}</p>
        )}
        <p className="text-htp-ink text-sm leading-[1.55] mb-4 flex-1">
          {event.description}
        </p>
        {event.price && (
          <p className="text-sm font-medium text-htp-navy mb-4">{event.price}</p>
        )}
        {event.capacity_limit !== null && (
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-htp-red mb-4">
            Limited to {event.capacity_limit} spot
            {event.capacity_limit !== 1 ? "s" : ""}
          </p>
        )}
        {event.cta_href ? (
          <a
            href={event.cta_href}
            target={event.cta_href.startsWith("http") ? "_blank" : undefined}
            rel={event.cta_href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="htp-btn-primary !px-4 !py-2 self-start !text-sm"
          >
            {event.cta_label || "Learn More"}
          </a>
        ) : (
          <span className="inline-block self-start rounded-btn border border-htp-line px-4 py-2 text-sm font-medium text-htp-ink/60">
            {event.cta_label || "Learn More"}
          </span>
        )}
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const upcoming = await getUpcomingEvents();

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-6">
          Events on the Hill
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-4 max-w-2xl mx-auto">
          Ticketed events, paint classes, raffles, and the kind of nights you&apos;ll be talking
          about long after the lights go down. Here&apos;s what&apos;s happening at Hilltop.
        </p>
        <p className="text-sm text-htp-ink/70 leading-[1.55] mb-12 max-w-2xl mx-auto">
          Looking for farmers markets or vendor sign-ups?{" "}
          <Link href="/markets" className="text-htp-red hover:underline font-medium">
            Head over to our Markets page.
          </Link>
        </p>

        {upcoming.length > 0 ? (
          <>
            <h2 className="font-display text-htp-h2 md:text-3xl text-htp-navy uppercase tracking-[0.04em] mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-xl mx-auto mb-16">
            <p className="text-htp-ink leading-[1.55]">
              No upcoming events right now. Follow us on social media for announcements, or
              check back soon!
            </p>
          </div>
        )}

        <div className="htp-card-highlight mx-auto mt-20 max-w-2xl p-8">
          <h2 className="font-display text-htp-h3 uppercase tracking-[0.04em] text-htp-navy mb-3">
            Want to host something at Hilltop?
          </h2>
          <p className="text-htp-ink leading-[1.55] mb-4">
            Birthday parties, fundraisers, private events — we&apos;d love to hear what you&apos;re
            cooking up.
          </p>
          <Link href="/contact-us" className="htp-btn-primary inline-flex">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}

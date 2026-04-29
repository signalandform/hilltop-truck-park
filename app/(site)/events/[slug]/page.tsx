import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CMS_REVALIDATE,
  getEvent,
  getEventSlugs,
  type CmsEvent,
} from "@/lib/cms";
import { EventSignupForm } from "@/components/EventSignupForm";
import { Badge } from "@/components/ui/Badge";

export const revalidate = CMS_REVALIDATE;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event | Hilltop Truck Park" };

  return {
    title: `${event.title} | Hilltop Truck Park`,
    description: event.description,
  };
}

function formatDate(event: CmsEvent) {
  if (event.date_label) return event.date_label;
  if (!event.event_date) return null;
  return new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const dateLabel = formatDate(event);
  const remaining =
    event.capacity_limit === null
      ? null
      : Math.max(0, event.capacity_limit - event.reserved_count);

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <Link
          href="/events"
          className="text-htp-red hover:underline text-sm mb-8 inline-block font-medium"
        >
          ← Back to Events
        </Link>

        <article className="htp-card overflow-hidden max-w-2xl mx-auto text-left">
          {event.image_url && (
            <div className="relative w-full aspect-[4/3] bg-htp-navy/5">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {dateLabel && (
                <p className="text-sm font-medium text-htp-red uppercase tracking-wider">
                  {dateLabel}
                </p>
              )}
              {event.tag && <Badge>{event.tag}</Badge>}
            </div>

            <h1 className="font-display text-htp-h1 md:text-4xl text-htp-navy uppercase tracking-[0.04em] mb-4">
              {event.title}
            </h1>

            {event.location && (
              <p className="text-htp-ink/60 mb-4">{event.location}</p>
            )}

            <p className="text-htp-ink leading-[1.55] mb-5">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              {event.price && (
                <p className="rounded-full border border-htp-line px-4 py-2 text-sm font-medium text-htp-navy">
                  {event.price}
                </p>
              )}
              {event.capacity_limit !== null && (
                <p className="rounded-full border border-htp-line px-4 py-2 text-sm font-medium text-htp-red">
                  {remaining} of {event.capacity_limit} spot
                  {event.capacity_limit !== 1 ? "s" : ""} left
                </p>
              )}
            </div>

            <EventSignupForm
              eventId={event.id}
              eventTitle={event.title}
              capacityLimit={event.capacity_limit}
              reservedCount={event.reserved_count}
            />
          </div>
        </article>
      </div>
    </section>
  );
}

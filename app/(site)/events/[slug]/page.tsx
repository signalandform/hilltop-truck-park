import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEvent, getEventSlugs, CMS_REVALIDATE } from "@/lib/cms";

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

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
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
        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm overflow-hidden max-w-2xl mx-auto">
          {event.image_url && (
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}
          <div className="p-8">
          <h1 className="font-display text-htp-h1 md:text-4xl text-htp-navy uppercase tracking-[0.04em] mb-4">
            {event.title}
          </h1>
          <p className="text-htp-ink/80 mb-6">{event.date_label}</p>
          <p className="text-htp-ink leading-[1.55] mb-8">{event.description}</p>
          <Link
            href="/contact-us"
            className="inline-block px-6 py-3 bg-htp-red text-white rounded-btn font-medium hover:bg-[#a32e28] transition-colors"
          >
            Get in touch
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

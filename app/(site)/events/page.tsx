import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events | Hilltop Truck Park",
  description:
    "Ticketed events, paint classes, raffles, and more at Hilltop Truck Park in Northlake, TX.",
};

type CustomerEvent = {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  location: string;
  description: string;
  price?: string;
  tag?: "Ticketed" | "Raffle" | "Class" | "Ladies Night";
  ctaLabel: string;
  ctaHref: string;
};

const WIX_EVENTS_URL = "https://www.hilltoptruckpark.com/events-2";

const EVENTS: CustomerEvent[] = [
  {
    slug: "vegas-night",
    title: "Vegas Night",
    date: "Saturday, June 20, 2026",
    isoDate: "2026-06-20",
    location: "Hilltop Truck Park — Northlake, TX",
    description:
      "This is as close to the Vegas Strip as it gets without leaving town! Whether you're betting big or just playing for fun, it's going to be a night of non-stop excitement.",
    tag: "Ticketed",
    ctaLabel: "Buy Tickets",
    ctaHref: WIX_EVENTS_URL,
  },
  {
    slug: "denago-rover-xl-raffle",
    title: "2026 Denago Rover XL Raffle",
    date: "Drawing Saturday, April 25, 2026",
    isoDate: "2026-04-25",
    location: "Hilltop Truck Park — Northlake, TX",
    description:
      "Your chance to win a brand-new electric golf car valued at $9,995. Forward-facing rear seats, arm rests, side steps, and CarPlay. Winner announced when 200 tickets are sold — does not have to be present.",
    tag: "Raffle",
    ctaLabel: "Buy Tickets",
    ctaHref: WIX_EVENTS_URL,
  },
  {
    slug: "food-trailer-raffle",
    title: "Food Trailer Raffle",
    date: "Drawing Thursday, May 14, 2026",
    isoDate: "2026-05-14",
    location: "Hilltop Truck Park — Northlake, TX",
    description:
      "Looking to upgrade or start your mobile food business? Now is your chance! Winner drawn once 660 tickets are sold — no end date at this time.",
    price: "$50 / ticket",
    tag: "Raffle",
    ctaLabel: "Buy Tickets",
    ctaHref: WIX_EVENTS_URL,
  },
  {
    slug: "paint-class-highland-cow",
    title: "Paint Class — Highland Cow",
    date: "Wednesday, May 13, 2026",
    isoDate: "2026-05-13",
    location: "8150 Thompson Rd, Northlake, TX",
    description:
      "Ladies Night + Paint Night = a total no-brainer. Ticket includes all paint supplies, instructor, and one glass of wine or champagne! $10 cocktails and $4 drafts while the kids play.",
    price: "$40 / ticket",
    tag: "Ladies Night",
    ctaLabel: "Reserve Your Spot",
    ctaHref: WIX_EVENTS_URL,
  },
  {
    slug: "paint-class-bluebonnets",
    title: "Paint Class — Bluebonnets",
    date: "Wednesday, April 15, 2026",
    isoDate: "2026-04-15",
    location: "8150 Thompson Rd, Northlake, TX",
    description:
      "Ladies Night + Paint Night = a total no-brainer. Ticket includes all paint supplies, instructor, and a glass of wine or champagne. Grab the girls, sip $10 cocktails, and enjoy $4 drafts while the kids play.",
    price: "$40 / ticket",
    tag: "Ladies Night",
    ctaLabel: "View Details",
    ctaHref: WIX_EVENTS_URL,
  },
  {
    slug: "all-you-can-eat-crawfish",
    title: "All You Can Eat Crawfish",
    date: "Friday, April 17, 2026",
    isoDate: "2026-04-17",
    location: "8150 Thompson Rd, Northlake, TX",
    description:
      "All you can eat crawfish — includes one draft beer. A Hilltop tradition you don't want to miss.",
    tag: "Ticketed",
    ctaLabel: "View Details",
    ctaHref: WIX_EVENTS_URL,
  },
];

function EventCard({ event, past = false }: { event: CustomerEvent; past?: boolean }) {
  return (
    <article
      className={`bg-htp-cream border border-htp-line rounded-card shadow-sm overflow-hidden flex flex-col text-left ${
        past ? "opacity-75" : ""
      }`}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-medium text-htp-red uppercase tracking-wider">
            {event.date}
          </p>
          {event.tag && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-htp-navy bg-htp-navy/10 px-2 py-0.5 rounded-full">
              {event.tag}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-htp-ink/60 mb-3">{event.location}</p>
        <p className="text-htp-ink text-sm leading-[1.55] mb-4 flex-1">
          {event.description}
        </p>
        {event.price && (
          <p className="text-sm font-medium text-htp-navy mb-4">{event.price}</p>
        )}
        {!past ? (
          <a
            href={event.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block self-start px-4 py-2 bg-htp-red text-white rounded-btn text-sm font-medium hover:bg-[#a32e28] transition-colors"
          >
            {event.ctaLabel}
          </a>
        ) : (
          <span className="inline-block self-start px-4 py-2 border border-htp-line text-htp-ink/60 rounded-btn text-sm font-medium">
            Past Event
          </span>
        )}
      </div>
    </article>
  );
}

export default function EventsPage() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const sorted = [...EVENTS].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  const upcoming = sorted.filter((e) => e.isoDate >= todayIso);
  const past = sorted.filter((e) => e.isoDate < todayIso).reverse();

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
                <EventCard key={event.slug} event={event} />
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

        {past.length > 0 && (
          <>
            <h2 className="font-display text-htp-h3 text-htp-navy/60 uppercase tracking-[0.04em] mb-6">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) => (
                <EventCard key={event.slug} event={event} past />
              ))}
            </div>
          </>
        )}

        <div className="mt-20 bg-htp-cream border border-htp-line rounded-card p-8 max-w-2xl mx-auto">
          <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-3">
            Want to host something at Hilltop?
          </h2>
          <p className="text-htp-ink leading-[1.55] mb-4">
            Birthday parties, fundraisers, private events — we&apos;d love to hear what you&apos;re
            cooking up.
          </p>
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

"use client";

import { useEffect, useState } from "react";
import {
  MarketsGalleryMarquee,
  type MarketGallerySlide,
} from "@/components/MarketsGalleryMarquee";
import { supabase } from "@/lib/supabase";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  preferred_date: "",
  preferred_time: "",
  guest_count: "",
  child_name: "",
  child_age: "",
  package_interest: "",
  add_ons: [] as string[],
  notes: "",
};

const packages = [
  {
    name: "Rent One Side",
    price: "$300",
    description: "Best for larger parties.",
    details: [
      "12 tables",
      "Turf wall for balloons/decor",
      "Blocking off to the public",
      "Full access to bounce houses",
      "Not eligible Fridays & Saturdays after 5 PM",
    ],
  },
  {
    name: "Rent 5 Tables",
    price: "$150",
    description: "Great for smaller celebrations.",
    details: [
      "5 reserved tables",
      "Turf wall for decor if needed",
      "Eligible any day, any time",
      "Full access to bounce houses",
    ],
  },
];

const addOns = [
  "Characters - $400 for 2 hours",
  "DJ Gogi - $100/hr",
  "Private Bar - $400",
  "Princess Appearance - $400 for 2 princesses",
  "Foam Machine - $300, $100 each additional hour",
  "Face Painter - $10 per face",
  "Basketball Hoops Trailer - $500 for 4 hours",
  "Mini Horses - $300 for 2 hours",
];

type PartyGalleryContent = {
  images?: { src?: unknown; alt?: unknown }[];
};

function buildPartyGallerySlides(
  content: PartyGalleryContent | null,
): MarketGallerySlide[] {
  const images = Array.isArray(content?.images) ? content.images : [];
  return images
    .map((image) => {
      const src = typeof image.src === "string" ? image.src.trim() : "";
      const alt = typeof image.alt === "string" ? image.alt.trim() : "";
      return src ? { src, alt: alt || "Hilltop Truck Park birthday party" } : null;
    })
    .filter((image): image is MarketGallerySlide => image !== null)
    .slice(0, 14);
}

export default function BookYourPartyPage() {
  const [form, setForm] = useState(EMPTY);
  const [partyGallerySlides, setPartyGallerySlides] = useState<MarketGallerySlide[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase
      .from("cms_page_content")
      .select("content")
      .eq("page_slug", "book-your-party")
      .eq("section_key", "gallery")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setPartyGallerySlides(
          buildPartyGallerySlides((data?.content as PartyGalleryContent | null) ?? null),
        );
      });
  }, []);

  const update = (key: keyof typeof EMPTY, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAddOn = (value: string) => {
    setForm((prev) => ({
      ...prev,
      add_ons: prev.add_ons.includes(value)
        ? prev.add_ons.filter((item) => item !== value)
        : [...prev.add_ons, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.from("cms_party_inquiries").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      preferred_date: form.preferred_date.trim() || null,
      preferred_time: form.preferred_time.trim() || null,
      guest_count: form.guest_count.trim() || null,
      child_name: form.child_name.trim() || null,
      child_age: form.child_age.trim() || null,
      package_interest: form.package_interest.trim() || null,
      add_ons: form.add_ons,
      notes: form.notes.trim() || null,
    });

    if (error) {
      setErrorMsg("Something went wrong. Please try again or email us directly.");
      setStatus("error");
      return;
    }

    setStatus("sent");
    setForm(EMPTY);
  };

  const inputClass =
    "w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent";

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <p className="font-accent text-xl tracking-[0.14em] text-htp-red mb-3">
          Celebrate Big on the Hill
        </p>
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-6">
          Book Your Party!
        </h1>
        <p className="text-lg text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Birthday parties at Hilltop Truck Park include food trucks, a full bar, bounce houses,
          fun, easy setup, and easy cleanup.
        </p>

        <div className="grid gap-6 mb-10 md:grid-cols-2">
          {packages.map((pkg) => (
            <article
              key={pkg.name}
              className="htp-card p-6 text-left"
            >
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h2 className="font-display text-htp-h3 uppercase tracking-[0.04em] text-htp-navy">
                  {pkg.name}
                </h2>
                <p className="font-display text-xl text-htp-red">{pkg.price}</p>
              </div>
              <p className="text-sm font-medium text-htp-ink/70 mb-4">{pkg.description}</p>
              <ul className="space-y-2 text-sm text-htp-ink leading-[1.5]">
                {pkg.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="text-htp-red" aria-hidden>★</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="htp-card-highlight p-6 mb-12 text-left">
          <h2 className="font-display text-htp-h3 uppercase tracking-[0.04em] text-htp-navy mb-4">
            Fun Add-Ons
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map((item) => (
              <div key={item} className="rounded-card border border-htp-line bg-htp-cream p-3 text-sm text-htp-ink">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-htp-ink/70">
            Add-on availability may vary. Both party options include full access to public bounce
            houses.
          </p>
        </div>

        <MarketsGalleryMarquee images={partyGallerySlides} />

        {status === "sent" ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-card p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Party Inquiry Sent!
            </h3>
            <p className="text-sm">
              Thanks for reaching out. We&apos;ll review your party details and get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-htp-red hover:underline text-sm font-medium"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-3xl mx-auto text-left"
          >
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-6">
              Birthday Party Inquiry
            </h2>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className={inputClass} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Guest Count</label>
                  <input type="text" value={form.guest_count} onChange={(e) => update("guest_count", e.target.value)} placeholder="Approx. number of guests" className={inputClass} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Preferred Date</label>
                  <input type="date" value={form.preferred_date} onChange={(e) => update("preferred_date", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Preferred Time</label>
                  <input type="text" value={form.preferred_time} onChange={(e) => update("preferred_time", e.target.value)} placeholder="e.g. 2–4 PM" className={inputClass} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Birthday Child&apos;s Name</label>
                  <input type="text" value={form.child_name} onChange={(e) => update("child_name", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Birthday Child&apos;s Age</label>
                  <input type="text" value={form.child_age} onChange={(e) => update("child_age", e.target.value)} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-htp-ink mb-2">Package Interest</label>
                <select
                  value={form.package_interest}
                  onChange={(e) => update("package_interest", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Choose a package...</option>
                  <option value="Rent One Side - $300">Rent One Side - $300</option>
                  <option value="Rent 5 Tables - $150">Rent 5 Tables - $150</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-htp-ink mb-2">
                  Add-Ons You&apos;re Interested In
                </legend>
                <div className="grid gap-2 md:grid-cols-2">
                  {addOns.map((item) => (
                    <label key={item} className="flex items-start gap-2 text-sm text-htp-ink">
                      <input
                        type="checkbox"
                        checked={form.add_ons.includes(item)}
                        onChange={() => toggleAddOn(item)}
                        className="mt-1 w-4 h-4 rounded border-htp-line"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className="block text-sm font-medium text-htp-ink mb-2">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={4}
                  placeholder="Tell us anything else about your party plans."
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="px-6 py-2.5 bg-htp-red text-htp-bg rounded-btn font-medium hover:bg-[#a32e28] transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Submitting..." : "Submit Party Inquiry"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

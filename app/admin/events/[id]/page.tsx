"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "@/components/admin/ImageUpload";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type Form = {
  title: string;
  slug: string;
  description: string;
  event_date: string;
  date_label: string;
  location: string;
  price: string;
  tag: string;
  image_url: string;
  cta_label: string;
  cta_href: string;
  sort_order: number;
  is_published: boolean;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  description: "",
  event_date: "",
  date_label: "",
  location: "Hilltop Truck Park — Northlake, TX",
  price: "",
  tag: "",
  image_url: "",
  cta_label: "Buy Tickets",
  cta_href: "https://www.hilltoptruckpark.com/events-2",
  sort_order: 0,
  is_published: false,
};

const TAG_SUGGESTIONS = ["Ticketed", "Raffle", "Class", "Ladies Night", "Family"];

export default function EventEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<Form>(EMPTY);
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("cms_events")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { router.replace("/admin/events"); return; }
        setForm({
          title: data.title,
          slug: data.slug,
          description: data.description,
          event_date: data.event_date ?? "",
          date_label: data.date_label ?? "",
          location: data.location ?? "",
          price: data.price ?? "",
          tag: data.tag ?? "",
          image_url: data.image_url ?? "",
          cta_label: data.cta_label ?? "Buy Tickets",
          cta_href: data.cta_href ?? "",
          sort_order: data.sort_order,
          is_published: data.is_published,
        });
        setAutoSlug(false);
        setLoading(false);
      });
  }, [id, isNew, router]);

  const update = (key: keyof Form, value: string | number | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && autoSlug) next.slug = slugify(value as string);
      return next;
    });
  };

  const handleSave = async () => {
    setError("");
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      event_date: form.event_date || null,
      date_label: form.date_label.trim(),
      location: form.location.trim() || null,
      price: form.price.trim() || null,
      tag: form.tag.trim() || null,
      image_url: form.image_url.trim() || null,
      cta_label: form.cta_label.trim() || "Buy Tickets",
      cta_href: form.cta_href.trim(),
      sort_order: form.sort_order,
      is_published: form.is_published,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error: err } = await supabase.from("cms_events").insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from("cms_events").update(payload).eq("id", id);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    router.push("/admin/events");
  };

  if (loading) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/events" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to Events
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {isNew ? "New Event" : "Edit Event"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-800 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Vegas Night"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug
              {autoSlug && isNew && <span className="text-slate-400 font-normal ml-1">(auto)</span>}
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setAutoSlug(false); update("slug", e.target.value); }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Date</label>
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => update("event_date", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">Used for sorting upcoming vs past</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date Label</label>
            <input
              type="text"
              value={form.date_label}
              onChange={(e) => update("date_label", e.target.value)}
              placeholder='e.g. "Saturday, June 20, 2026"'
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">Shown on the card</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tag</label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => update("tag", e.target.value)}
              placeholder="Ticketed, Raffle, Class..."
              list="tag-suggestions"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <datalist id="tag-suggestions">
              {TAG_SUGGESTIONS.map((t) => <option key={t} value={t} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder='e.g. "$40 / ticket" (optional)'
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update("sort_order", parseInt(e.target.value, 10) || 0)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">Lower = earlier (tiebreaker after date)</p>
          </div>
        </div>

        <ImageUpload
          value={form.image_url}
          onChange={(url) => update("image_url", url)}
          folder="events"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA Label</label>
            <input
              type="text"
              value={form.cta_label}
              onChange={(e) => update("cta_label", e.target.value)}
              placeholder='e.g. "Buy Tickets"'
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA Link</label>
            <input
              type="url"
              value={form.cta_href}
              onChange={(e) => update("cta_href", e.target.value)}
              placeholder="https://..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">Ticket purchase / details URL</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={form.is_published}
              onChange={(e) => update("is_published", e.target.checked)}
              className="rounded border-slate-300"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
              Published
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

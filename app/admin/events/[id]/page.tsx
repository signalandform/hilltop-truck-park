"use client";

import { useEffect, useState, useCallback } from "react";
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
  date_label: string;
  event_date: string;
  location: string;
  signup_enabled: boolean;
  image_url: string;
  sort_order: number;
  is_published: boolean;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  description: "",
  date_label: "",
  event_date: "",
  location: "Northlake",
  signup_enabled: true,
  image_url: "",
  sort_order: 0,
  is_published: false,
};

type TicketType = {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number | null;
  sort_order: number;
  is_active: boolean;
  signups: number;
};

type TicketDraft = {
  name: string;
  description: string;
  price: string;
  capacity: string;
};

const EMPTY_DRAFT: TicketDraft = { name: "", description: "", price: "50", capacity: "" };

export default function EventEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<Form>(EMPTY);
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");
  const [signupCount, setSignupCount] = useState(0);

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketDraft, setTicketDraft] = useState<TicketDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<TicketDraft>(EMPTY_DRAFT);
  const [ticketSaving, setTicketSaving] = useState(false);

  const loadTicketTypes = useCallback(async () => {
    const [typesRes, countsRes] = await Promise.all([
      supabase
        .from("cms_event_ticket_types")
        .select("*")
        .eq("event_id", id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("cms_event_signups")
        .select("ticket_type_id")
        .eq("event_id", id)
        .not("ticket_type_id", "is", null),
    ]);

    const counts: Record<string, number> = {};
    for (const row of countsRes.data ?? []) {
      const tid = row.ticket_type_id as string;
      counts[tid] = (counts[tid] ?? 0) + 1;
    }

    setTicketTypes(
      (typesRes.data ?? []).map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description ?? "",
        price: Number(t.price),
        capacity: t.capacity,
        sort_order: t.sort_order,
        is_active: t.is_active,
        signups: counts[t.id] ?? 0,
      })),
    );
  }, [id]);

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
          date_label: data.date_label,
          event_date: data.event_date ?? "",
          location: data.location ?? "Northlake",
          signup_enabled: data.signup_enabled,
          image_url: data.image_url ?? "",
          sort_order: data.sort_order,
          is_published: data.is_published,
        });
        setAutoSlug(false);
        setLoading(false);
      });

    supabase
      .from("cms_event_signups")
      .select("id", { count: "exact", head: true })
      .eq("event_id", id)
      .then(({ count }) => setSignupCount(count ?? 0));

    loadTicketTypes();
  }, [id, isNew, router, loadTicketTypes]);

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
      date_label: form.date_label.trim(),
      event_date: form.event_date || null,
      location: form.location.trim() || null,
      signup_enabled: form.signup_enabled,
      image_url: form.image_url.trim() || null,
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

  const handleAddTicketType = async () => {
    if (!ticketDraft.name.trim()) return;
    setTicketSaving(true);
    const { error: err } = await supabase.from("cms_event_ticket_types").insert({
      event_id: id,
      name: ticketDraft.name.trim(),
      description: ticketDraft.description.trim() || null,
      price: parseFloat(ticketDraft.price) || 0,
      capacity: ticketDraft.capacity ? parseInt(ticketDraft.capacity, 10) : null,
      sort_order: ticketTypes.length,
    });
    if (err) { setError(err.message); setTicketSaving(false); return; }
    setTicketDraft(EMPTY_DRAFT);
    await loadTicketTypes();
    setTicketSaving(false);
  };

  const handleUpdateTicketType = async (typeId: string) => {
    if (!editDraft.name.trim()) return;
    setTicketSaving(true);
    const { error: err } = await supabase
      .from("cms_event_ticket_types")
      .update({
        name: editDraft.name.trim(),
        description: editDraft.description.trim() || null,
        price: parseFloat(editDraft.price) || 0,
        capacity: editDraft.capacity ? parseInt(editDraft.capacity, 10) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", typeId);
    if (err) { setError(err.message); setTicketSaving(false); return; }
    setEditingId(null);
    await loadTicketTypes();
    setTicketSaving(false);
  };

  const handleToggleActive = async (typeId: string, active: boolean) => {
    await supabase
      .from("cms_event_ticket_types")
      .update({ is_active: active, updated_at: new Date().toISOString() })
      .eq("id", typeId);
    await loadTicketTypes();
  };

  const handleDeleteTicketType = async (typeId: string, signups: number) => {
    const msg = signups > 0
      ? `This ticket type has ${signups} sign-up(s). Deleting it will unlink those registrations. Continue?`
      : "Delete this ticket type?";
    if (!confirm(msg)) return;
    await supabase.from("cms_event_ticket_types").delete().eq("id", typeId);
    await loadTicketTypes();
  };

  const startEditing = (t: TicketType) => {
    setEditingId(t.id);
    setEditDraft({
      name: t.name,
      description: t.description,
      price: t.price.toString(),
      capacity: t.capacity?.toString() ?? "",
    });
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
        <div className="flex items-center gap-3">
          {!isNew && signupCount > 0 && (
            <Link
              href={`/admin/events/${id}/signups`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {signupCount} sign-up{signupCount !== 1 ? "s" : ""} →
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-slate-800 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date Label</label>
            <input
              type="text"
              value={form.date_label}
              onChange={(e) => update("date_label", e.target.value)}
              placeholder='e.g. "Sat, Apr 18"'
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="signup_enabled"
              checked={form.signup_enabled}
              onChange={(e) => update("signup_enabled", e.target.checked)}
              className="rounded border-slate-300"
            />
            <label htmlFor="signup_enabled" className="text-sm font-medium text-slate-700">
              Enable Sign-ups
            </label>
          </div>
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

      {/* Ticket Types Section */}
      {!isNew && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Ticket Types</h2>
          <p className="text-xs text-slate-500 mb-4">
            Define ticket categories for this event. Each type can have its own price and capacity limit.
          </p>

          {ticketTypes.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-3 py-2 font-medium text-slate-600">Name</th>
                    <th className="text-right px-3 py-2 font-medium text-slate-600">Price</th>
                    <th className="text-center px-3 py-2 font-medium text-slate-600">Capacity</th>
                    <th className="text-center px-3 py-2 font-medium text-slate-600">Signups</th>
                    <th className="text-center px-3 py-2 font-medium text-slate-600">Active</th>
                    <th className="text-right px-3 py-2 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketTypes.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0">
                      {editingId === t.id ? (
                        <>
                          <td className="px-3 py-2" colSpan={4}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <input
                                type="text"
                                value={editDraft.name}
                                onChange={(e) => setEditDraft((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Name"
                                className="border border-slate-300 rounded px-2 py-1 text-sm"
                              />
                              <input
                                type="text"
                                value={editDraft.description}
                                onChange={(e) => setEditDraft((p) => ({ ...p, description: e.target.value }))}
                                placeholder="Description (optional)"
                                className="border border-slate-300 rounded px-2 py-1 text-sm"
                              />
                              <input
                                type="number"
                                value={editDraft.price}
                                onChange={(e) => setEditDraft((p) => ({ ...p, price: e.target.value }))}
                                placeholder="Price"
                                min="0"
                                step="0.01"
                                className="border border-slate-300 rounded px-2 py-1 text-sm"
                              />
                              <input
                                type="number"
                                value={editDraft.capacity}
                                onChange={(e) => setEditDraft((p) => ({ ...p, capacity: e.target.value }))}
                                placeholder="Capacity (blank=unlimited)"
                                min="0"
                                className="border border-slate-300 rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center" colSpan={2}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateTicketType(t.id)}
                                disabled={ticketSaving}
                                className="text-xs font-medium text-green-600 hover:text-green-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-xs font-medium text-slate-500 hover:text-slate-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2">
                            <span className="font-medium text-slate-900">{t.name}</span>
                            {t.description && (
                              <span className="block text-xs text-slate-500">{t.description}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-700">
                            ${t.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-center text-slate-700">
                            {t.capacity ?? "∞"}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={t.capacity !== null && t.signups >= t.capacity ? "text-red-600 font-medium" : "text-slate-700"}>
                              {t.signups}{t.capacity !== null ? `/${t.capacity}` : ""}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => handleToggleActive(t.id, !t.is_active)}
                              className={`text-xs font-medium ${t.is_active ? "text-green-600" : "text-slate-400"}`}
                            >
                              {t.is_active ? "Yes" : "No"}
                            </button>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEditing(t)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTicketType(t.id, t.signups)}
                                className="text-xs font-medium text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add new ticket type */}
          <div className="border border-dashed border-slate-300 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-600 mb-3">Add Ticket Type</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={ticketDraft.name}
                onChange={(e) => setTicketDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="Name (e.g. Vendor)"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={ticketDraft.description}
                onChange={(e) => setTicketDraft((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description (optional)"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={ticketDraft.price}
                onChange={(e) => setTicketDraft((p) => ({ ...p, price: e.target.value }))}
                placeholder="Price"
                min="0"
                step="0.01"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={ticketDraft.capacity}
                  onChange={(e) => setTicketDraft((p) => ({ ...p, capacity: e.target.value }))}
                  placeholder="Capacity (blank=∞)"
                  min="0"
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddTicketType}
                  disabled={ticketSaving || !ticketDraft.name.trim()}
                  className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

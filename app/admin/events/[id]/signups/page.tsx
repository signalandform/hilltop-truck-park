"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { CmsEventSignup } from "@/lib/cms";

type EventSummary = {
  title: string;
  event_date: string | null;
  capacity_limit: number | null;
  reserved_count: number;
};

type Form = {
  name: string;
  email: string;
  phone: string;
  partySize: string;
  message: string;
};

const EMPTY_FORM: Form = {
  name: "",
  email: "",
  phone: "",
  partySize: "1",
  message: "",
};

function formatDate(value: string | null) {
  if (!value) return "No date set";
  return new Date(value + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSubmittedAt(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventSignupsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [signups, setSignups] = useState<CmsEventSignup[]>([]);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [eventRes, signupsRes] = await Promise.all([
      supabase
        .from("cms_events")
        .select("title, event_date, capacity_limit, reserved_count")
        .eq("id", id)
        .single(),
      supabase
        .from("cms_event_signups")
        .select("*")
        .eq("event_id", id)
        .order("created_at", { ascending: false }),
    ]);

    if (eventRes.error) {
      setError(eventRes.error.message);
    } else {
      setEvent(eventRes.data);
    }

    if (signupsRes.error) {
      setError(signupsRes.error.message);
    } else {
      setSignups(signupsRes.data ?? []);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const remaining =
    event?.capacity_limit === null || event?.capacity_limit === undefined
      ? null
      : Math.max(0, event.capacity_limit - event.reserved_count);

  const update = (key: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");

    const partySize = Number(form.partySize);
    if (!Number.isInteger(partySize) || partySize <= 0) {
      setError("Party size must be a whole number greater than zero.");
      return;
    }

    if (remaining !== null && partySize > remaining) {
      setError(`Only ${remaining} spot${remaining !== 1 ? "s" : ""} remain.`);
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from("cms_event_signups").insert({
      event_id: id,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      party_size: partySize,
      message: form.message.trim() || null,
      source: "cms",
    });

    if (insertError) {
      setError(
        insertError.message.toLowerCase().includes("capacity")
          ? "This reservation would exceed the event capacity."
          : insertError.message,
      );
      setSaving(false);
      return;
    }

    setForm(EMPTY_FORM);
    setStatus("Reservation added.");
    setSaving(false);
    await loadData();
  };

  const handleDelete = async (signupId: string) => {
    if (!confirm("Remove this reservation?")) return;
    setError("");
    setStatus("");

    const { error: deleteError } = await supabase
      .from("cms_event_signups")
      .delete()
      .eq("id", signupId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setStatus("Reservation removed.");
    await loadData();
  };

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/admin/events/${id}`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to Event
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Reservations: {event?.title ?? "Event"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {event ? formatDate(event.event_date) : "Loading event..."}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      {status && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6">
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900">Submissions</h2>
              {event && (
                <p className="text-sm text-slate-500">
                  {event.reserved_count} reserved
                  {event.capacity_limit !== null
                    ? ` / ${event.capacity_limit} capacity`
                    : " / unlimited capacity"}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
          ) : signups.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No reservations yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Phone</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Party</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Message</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup) => (
                  <tr key={signup.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{signup.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${signup.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {signup.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{signup.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-center text-slate-700">
                      {signup.party_size}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {signup.message ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {signup.source === "cms" ? "CMS" : "Public"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatSubmittedAt(signup.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(signup.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
          <h2 className="font-semibold text-slate-900 mb-1">Add Reservation</h2>
          <p className="text-xs text-slate-500 mb-4">
            Manually add a reservation for phone or walk-up requests.
            {remaining !== null
              ? ` ${remaining} spot${remaining !== 1 ? "s" : ""} remaining.`
              : " Capacity is unlimited."}
          </p>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Party Size *
                </label>
                <input
                  type="number"
                  min="1"
                  max={remaining ?? undefined}
                  step="1"
                  value={form.partySize}
                  onChange={(e) => update("partySize", e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={saving || remaining === 0}
              className="w-full bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Adding..." : "Add Reservation"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

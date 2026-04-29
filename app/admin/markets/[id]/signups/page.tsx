"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Signup = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  ticket_type_id: string | null;
  created_at: string;
};

type TicketType = {
  id: string;
  name: string;
  capacity: number | null;
  is_active: boolean;
  signups: number;
};

type Form = {
  name: string;
  email: string;
  phone: string;
  ticketTypeId: string;
  message: string;
};

const EMPTY_FORM: Form = {
  name: "",
  email: "",
  phone: "",
  ticketTypeId: "",
  message: "",
};

function spotsRemaining(type: TicketType) {
  if (type.capacity === null) return null;
  return Math.max(0, type.capacity - type.signups);
}

function formatSubmittedAt(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MarketSignupsPage() {
  const { id } = useParams<{ id: string }>();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [marketTitle, setMarketTitle] = useState("");
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [marketRes, signupsRes, typesRes] = await Promise.all([
      supabase.from("cms_markets").select("title").eq("id", id).single(),
      supabase
        .from("cms_market_signups")
        .select("*")
        .eq("market_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("cms_market_ticket_types")
        .select("id, name, capacity, is_active, sort_order")
        .eq("market_id", id)
        .order("sort_order", { ascending: true }),
    ]);

    if (marketRes.error || signupsRes.error || typesRes.error) {
      setError(
        marketRes.error?.message ??
          signupsRes.error?.message ??
          typesRes.error?.message ??
          "Unable to load market sign-ups.",
      );
      setLoading(false);
      return;
    }

    setMarketTitle(marketRes.data?.title ?? "Market");

    const loadedSignups = (signupsRes.data ?? []) as Signup[];
    setSignups(loadedSignups);

    const counts: Record<string, number> = {};
    for (const signup of loadedSignups) {
      if (!signup.ticket_type_id) continue;
      counts[signup.ticket_type_id] = (counts[signup.ticket_type_id] ?? 0) + 1;
    }

    const loadedTypes = (typesRes.data ?? []).map((type) => ({
      id: type.id,
      name: type.name,
      capacity: type.capacity,
      is_active: type.is_active,
      signups: counts[type.id] ?? 0,
    }));

    setTicketTypes(loadedTypes);
    setForm((prev) => {
      if (prev.ticketTypeId || loadedTypes.length === 0) return prev;
      const firstAvailable = loadedTypes.find((type) => spotsRemaining(type) !== 0);
      return { ...prev, ticketTypeId: firstAvailable?.id ?? loadedTypes[0].id };
    });
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const update = (key: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedTicketType =
    ticketTypes.find((type) => type.id === form.ticketTypeId) ?? null;
  const selectedRemaining = selectedTicketType ? spotsRemaining(selectedTicketType) : null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (ticketTypes.length > 0 && !selectedTicketType) {
      setError("Select a ticket type.");
      return;
    }

    if (selectedRemaining === 0) {
      setError("This ticket type is already at capacity.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("cms_market_signups").insert({
      market_id: id,
      ticket_type_id: selectedTicketType?.id ?? null,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setForm((prev) => ({
      ...EMPTY_FORM,
      ticketTypeId: prev.ticketTypeId,
    }));
    setStatus("Sign-up added.");
    setSaving(false);
    await loadData();
  };

  const handleDelete = async (signupId: string) => {
    if (!confirm("Remove this sign-up?")) return;
    setError("");
    setStatus("");

    const { error: deleteError } = await supabase
      .from("cms_market_signups")
      .delete()
      .eq("id", signupId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setStatus("Sign-up removed.");
    await loadData();
  };

  return (
    <>
      <div className="mb-6">
        <Link href={`/admin/markets/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Market
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Sign-ups: {marketTitle}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {signups.length} registration{signups.length !== 1 ? "s" : ""}
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
              <h2 className="font-semibold text-slate-900">Sign-ups</h2>
              {ticketTypes.length > 0 && (
                <p className="text-sm text-slate-500">
                  {ticketTypes
                    .map((type) => {
                      const remaining = spotsRemaining(type);
                      return `${type.name}: ${type.signups}${
                        type.capacity !== null ? `/${type.capacity}` : ""
                      }${remaining === 0 ? " full" : ""}`;
                    })
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
          ) : signups.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No sign-ups yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Ticket Type</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Message</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup) => {
                  const ticketType = signup.ticket_type_id
                    ? ticketTypes.find((type) => type.id === signup.ticket_type_id)
                    : null;

                  return (
                    <tr key={signup.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{signup.name}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${signup.email}`} className="text-blue-600 hover:underline">{signup.email}</a>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {ticketType?.name ?? (signup.ticket_type_id ? "Unknown" : "—")}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{signup.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{signup.message ?? "—"}</td>
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
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
          <h2 className="font-semibold text-slate-900 mb-1">Add Sign-up</h2>
          <p className="text-xs text-slate-500 mb-4">
            Manually add a market registration for phone, email, or walk-up requests.
          </p>

          <form onSubmit={handleAdd} className="space-y-4">
            {ticketTypes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ticket Type *</label>
                <select
                  value={form.ticketTypeId}
                  onChange={(e) => update("ticketTypeId", e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select ticket type</option>
                  {ticketTypes.map((type) => {
                    const remaining = spotsRemaining(type);
                    return (
                      <option key={type.id} value={type.id} disabled={remaining === 0}>
                        {type.name}
                        {!type.is_active ? " (inactive)" : ""}
                        {type.capacity !== null ? ` - ${remaining} remaining` : " - unlimited"}
                      </option>
                    );
                  })}
                </select>
                {selectedTicketType && (
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedRemaining === null
                      ? "Capacity is unlimited."
                      : `${selectedRemaining} spot${selectedRemaining !== 1 ? "s" : ""} remaining.`}
                  </p>
                )}
              </div>
            )}

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
              disabled={saving || selectedRemaining === 0}
              className="w-full bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Adding..." : "Add Sign-up"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

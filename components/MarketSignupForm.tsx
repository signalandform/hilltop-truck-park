"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CmsMarketTicketType } from "@/lib/cms";

type Props = {
  marketId: string;
  marketTitle: string;
  ticketTypes: CmsMarketTicketType[];
  signupCounts: Record<string, number>;
};

function formatPrice(price: number) {
  return price === 0 ? "Free" : `$${price.toFixed(2)}`;
}

function spotsRemaining(type: CmsMarketTicketType, counts: Record<string, number>) {
  if (type.capacity === null) return null;
  return Math.max(0, type.capacity - (counts[type.id] ?? 0));
}

export function MarketSignupForm({
  marketId,
  marketTitle,
  ticketTypes,
  signupCounts: initialCounts,
}: Props) {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [counts, setCounts] = useState(initialCounts);

  const hasTicketTypes = ticketTypes.length > 0;

  const allSoldOut =
    hasTicketTypes &&
    ticketTypes.every((t) => {
      const remaining = spotsRemaining(t, counts);
      return remaining !== null && remaining <= 0;
    });

  const selectedType = ticketTypes.find((t) => t.id === selectedTypeId) ?? null;

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.from("cms_market_signups").insert({
      market_id: marketId,
      ticket_type_id: selectedTypeId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim() || null,
    });

    if (error) {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    if (selectedTypeId) {
      setCounts((prev) => ({
        ...prev,
        [selectedTypeId]: (prev[selectedTypeId] ?? 0) + 1,
      }));
    }

    setStatus("sent");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  if (status === "sent") {
    return (
      <div className="bg-htp-cream border border-htp-line text-htp-ink rounded-card p-6 mt-8">
        <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
          You&apos;re Signed Up!
        </h3>
        <p className="text-sm">
          Thanks for signing up for {marketTitle}
          {selectedType ? ` (${selectedType.name})` : ""}. We&apos;ll see you there!
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setSelectedTypeId(null);
          }}
          className="mt-3 text-htp-red hover:underline text-sm font-medium"
        >
          Sign up another person
        </button>
      </div>
    );
  }

  if (allSoldOut) {
    return (
      <div className="bg-htp-cream-2 border border-htp-line text-htp-ink rounded-card p-6 mt-8">
        <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
          This Market is Sold Out
        </h3>
        <p className="text-sm">All ticket types are currently at capacity. Check back later or contact us for more info.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-htp-line pt-8">
      <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-4 text-center">
        {hasTicketTypes ? "Select a Ticket" : "Sign Up for This Market"}
      </h3>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {errorMsg}
        </div>
      )}

      {hasTicketTypes && !selectedTypeId && (
        <div className="space-y-3">
          {ticketTypes.map((type) => {
            const remaining = spotsRemaining(type, counts);
            const isSoldOut = remaining !== null && remaining <= 0;

            return (
              <button
                key={type.id}
                onClick={() => !isSoldOut && setSelectedTypeId(type.id)}
                disabled={isSoldOut}
                className={`w-full text-left border rounded-lg p-4 transition-colors ${
                  isSoldOut
                    ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                    : "border-htp-line bg-htp-bg hover:border-htp-red hover:bg-htp-cream cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-htp-navy">{type.name}</span>
                    {type.description && (
                      <p className="text-xs text-htp-ink/60 mt-0.5">{type.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-htp-navy">{formatPrice(type.price)}</span>
                    {isSoldOut ? (
                      <p className="text-xs font-medium text-red-600 mt-0.5">Sold Out</p>
                    ) : remaining !== null ? (
                      <p className="text-xs text-htp-ink/60 mt-0.5">
                        {remaining} spot{remaining !== 1 ? "s" : ""} left
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {(selectedTypeId || !hasTicketTypes) && (
        <form onSubmit={handleSubmit} className="text-left">
          {selectedType && (
            <div className="flex items-center justify-between bg-htp-bg border border-htp-line rounded-lg p-3 mb-4">
              <div>
                <span className="font-medium text-htp-navy text-sm">{selectedType.name}</span>
                <span className="text-htp-ink/60 text-sm ml-2">{formatPrice(selectedType.price)}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTypeId(null)}
                className="text-xs text-htp-red hover:underline font-medium"
              >
                Change
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-htp-ink mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-htp-ink mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-htp-ink mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-htp-ink mb-1">Message (optional)</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className="htp-btn-primary disabled:opacity-50"
              >
                {status === "sending" ? "Signing Up..." : "Register"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

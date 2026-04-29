"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  eventId: string;
  eventTitle: string;
  capacityLimit: number | null;
  reservedCount: number;
};

type Status = "idle" | "sending" | "sent" | "error";

function spotsRemaining(capacityLimit: number | null, reservedCount: number) {
  if (capacityLimit === null) return null;
  return Math.max(0, capacityLimit - reservedCount);
}

export function EventSignupForm({
  eventId,
  eventTitle,
  capacityLimit,
  reservedCount,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    partySize: "1",
    message: "",
  });
  const [localReservedCount, setLocalReservedCount] = useState(reservedCount);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const remaining = spotsRemaining(capacityLimit, localReservedCount);
  const partySize = Number(form.partySize);
  const isSoldOut = remaining !== null && remaining <= 0;
  const partySizeExceedsRemaining =
    remaining !== null && Number.isInteger(partySize) && partySize > remaining;

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    if (!Number.isInteger(partySize) || partySize <= 0) {
      setErrorMsg("Party size must be at least 1.");
      setStatus("error");
      return;
    }

    if (remaining !== null && partySize > remaining) {
      setErrorMsg(`Only ${remaining} spot${remaining !== 1 ? "s" : ""} left.`);
      setStatus("error");
      return;
    }

    const { error } = await supabase.from("cms_event_signups").insert({
      event_id: eventId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      party_size: partySize,
      message: form.message.trim() || null,
    });

    if (error) {
      setErrorMsg(
        error.message.toLowerCase().includes("capacity")
          ? "This event is at capacity for that party size."
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
      return;
    }

    setLocalReservedCount((prev) => prev + partySize);
    setForm({ name: "", email: "", phone: "", partySize: "1", message: "" });
    setStatus("sent");
  };

  return (
    <div className="mt-5 border-t border-htp-line pt-5">
      <h4 className="font-display text-base text-htp-navy uppercase tracking-[0.04em] mb-2">
        Reserve Your Spot
      </h4>
      {remaining !== null && (
        <p className="text-xs text-htp-ink/60 mb-3">
          {remaining > 0
            ? `${remaining} spot${remaining !== 1 ? "s" : ""} remaining`
            : "This event is currently at capacity."}
        </p>
      )}

      {status === "sent" && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 mb-3">
          Thanks! Your reservation for {eventTitle} has been received.
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-3">
          {errorMsg}
        </div>
      )}

      {isSoldOut ? (
        <p className="text-sm text-htp-ink/70">
          Reservations are full. Please check back later or contact us for more info.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-htp-ink mb-1">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className="w-full rounded-btn border border-htp-line bg-htp-bg px-3 py-2 text-sm text-htp-ink focus:border-transparent focus:outline-none focus:ring-2 focus:ring-htp-red"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-htp-ink mb-1">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                className="w-full rounded-btn border border-htp-line bg-htp-bg px-3 py-2 text-sm text-htp-ink focus:border-transparent focus:outline-none focus:ring-2 focus:ring-htp-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_8rem]">
            <div>
              <label className="block text-xs font-medium text-htp-ink mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full rounded-btn border border-htp-line bg-htp-bg px-3 py-2 text-sm text-htp-ink focus:border-transparent focus:outline-none focus:ring-2 focus:ring-htp-red"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-htp-ink mb-1">
                Amount *
              </label>
              <input
                type="number"
                min="1"
                max={remaining ?? undefined}
                step="1"
                value={form.partySize}
                onChange={(e) => update("partySize", e.target.value)}
                required
                className="w-full rounded-btn border border-htp-line bg-htp-bg px-3 py-2 text-sm text-htp-ink focus:border-transparent focus:outline-none focus:ring-2 focus:ring-htp-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-htp-ink mb-1">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              rows={2}
              className="w-full rounded-btn border border-htp-line bg-htp-bg px-3 py-2 text-sm text-htp-ink focus:border-transparent focus:outline-none focus:ring-2 focus:ring-htp-red"
            />
          </div>

          {partySizeExceedsRemaining && (
            <p className="text-xs text-red-600">
              Reduce party size to {remaining} or fewer.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending" || partySizeExceedsRemaining}
            className="htp-btn-primary !px-4 !py-2 !text-sm disabled:opacity-50"
          >
            {status === "sending" ? "Reserving..." : "Reserve"}
          </button>
        </form>
      )}
    </div>
  );
}

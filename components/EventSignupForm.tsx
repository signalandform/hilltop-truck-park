"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  eventId: string;
  eventTitle: string;
};

export function EventSignupForm({ eventId, eventTitle }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.from("cms_event_signups").insert({
      event_id: eventId,
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

    setStatus("sent");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-card p-6 mt-8">
        <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-2">
          You&apos;re Signed Up!
        </h3>
        <p className="text-sm">
          Thanks for signing up for {eventTitle}. We&apos;ll see you there!
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-3 text-htp-red hover:underline text-sm font-medium"
        >
          Sign up another person
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t border-htp-line pt-8 text-left">
      <h3 className="font-display text-lg text-htp-navy uppercase tracking-[0.04em] mb-4 text-center">
        Sign Up for This Event
      </h3>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {errorMsg}
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
            className="px-8 py-3 bg-htp-red text-white rounded-btn font-medium hover:bg-[#a32e28] transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "Signing Up..." : "Join Us!"}
          </button>
        </div>
      </div>
    </form>
  );
}

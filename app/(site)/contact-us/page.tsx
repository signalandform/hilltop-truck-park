"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { SocialLinks } from "@/components/SocialLinks";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.from("cms_contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });

    if (error) {
      setErrorMsg("Something went wrong. Please try again or email us directly.");
      setStatus("error");
      return;
    }

    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Contact Us
        </h1>
        <div className="space-y-8 text-htp-ink leading-[1.55] mb-12">
          <p className="text-lg max-w-2xl mx-auto">
            Have questions? Reach out to us at Hilltop Truck Park. We&apos;d love to hear from you.
          </p>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-6 max-w-xl mx-auto">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Address
            </h2>
            <p>8150 Thompson Rd, Northlake, TX 76247</p>
          </div>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-6 max-w-xl mx-auto">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Email
            </h2>
            <a
              href="mailto:info@hilltoptruckpark.com"
              className="text-htp-red hover:underline font-medium"
            >
              info@hilltoptruckpark.com
            </a>
          </div>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-6 max-w-xl mx-auto">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-4">
              Follow Us
            </h2>
            <SocialLinks label="Hilltop Truck Park social links" />
          </div>
        </div>

        {status === "sent" ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-card p-8 max-w-xl mx-auto">
            <h3 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Message Sent!
            </h3>
            <p className="text-sm">Thank you for reaching out. We&apos;ll get back to you soon.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-htp-red hover:underline text-sm font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-xl mx-auto text-left"
          >
            <h3 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-6">
              Send Us a Message
            </h3>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-htp-ink mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-htp-ink mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-htp-ink mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink focus:outline-none focus:ring-2 focus:ring-htp-red focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="px-6 py-2.5 bg-htp-red text-htp-bg rounded-btn font-medium hover:bg-[#a32e28] transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

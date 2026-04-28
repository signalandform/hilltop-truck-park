"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  food_truck_name: "",
  time_in_business: "",
  website: "",
  rig_size: "",
  dates_requested: "",
  food_type: "",
  booked_before: "",
  health_permit: "",
  inspect_rig: false,
};

export default function VendorRequestsPage() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.from("cms_vendor_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      food_truck_name: form.food_truck_name.trim() || null,
      time_in_business: form.time_in_business.trim() || null,
      website: form.website.trim() || null,
      rig_size: form.rig_size.trim() || null,
      dates_requested: form.dates_requested.trim() || null,
      food_type: form.food_type.trim() || null,
      booked_before: form.booked_before.trim() || null,
      health_permit: form.health_permit.trim() || null,
      inspect_rig: form.inspect_rig,
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
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Hilltop Vendor Space Request
        </h1>
        <p className="text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Hilltop is a full service facility with bathrooms, seating, and full bar on site. We are
          family and pet friendly, and we love working with you. We have water, dump, grease
          disposal, and power on site. Propane and ice are available for purchase. If you would like
          to book space, please fill out the form below.
        </p>

        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 mb-12 max-w-2xl mx-auto text-left">
          <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-4">
            Note the following before proceeding
          </h2>
          <ul className="space-y-3 text-htp-ink leading-[1.55] text-sm list-disc list-inside">
            <li>
              <strong>Permits:</strong> You must have a valid permit from the TX Department of
              Health. You must have a valid fire inspection permit from the Denton County Fire
              Marshall. Hilltop is in Unincorporated Denton County so no additional permits are
              required.
            </li>
            <li>
              You must be able to pull, park, and unload your equipment effectively and efficiently
              without assistance.
            </li>
            <li>
              Your equipment must be visibly pleasing, clean, and in good working order.
            </li>
            <li>
              You must have cords for power that are in good condition and sufficient for your
              rig&apos;s needs. We offer 20, 30, and 50 amp power.
            </li>
            <li>
              On your scheduled date, you must arrive in a timeframe sufficient to set up and be
              open at the time published on your schedule.
            </li>
            <li>
              <strong>Cancellation Policy:</strong> Cancellations in less than 72 hours will be
              charged for the full day. (Emergency situations can be taken into consideration.) No
              calls/no shows will not be refunded and will not be rescheduled.
            </li>
          </ul>
        </div>

        {status === "sent" ? (
          <div className="bg-htp-cream border border-htp-line text-htp-ink rounded-card p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Request Submitted!
            </h3>
            <p className="text-sm">
              Thank you for your interest. We&apos;ll review your request and get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-htp-red hover:underline text-sm font-medium"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto text-left"
          >
            <h3 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-6">
              Vendor Space Request Form
            </h3>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Food Truck Name</label>
                  <input type="text" value={form.food_truck_name} onChange={(e) => update("food_truck_name", e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Time in Business</label>
                  <input type="text" value={form.time_in_business} onChange={(e) => update("time_in_business", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Website or Social Media</label>
                  <input type="text" value={form.website} onChange={(e) => update("website", e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Rig Length and Width</label>
                  <input type="text" value={form.rig_size} onChange={(e) => update("rig_size", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Type of Food Served</label>
                  <input type="text" value={form.food_type} onChange={(e) => update("food_type", e.target.value)} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-htp-ink mb-2">Dates &amp; Times Requested</label>
                <input type="text" value={form.dates_requested} onChange={(e) => update("dates_requested", e.target.value)} className={inputClass} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Booked with us before?</label>
                  <input type="text" value={form.booked_before} onChange={(e) => update("booked_before", e.target.value)} placeholder="Yes / No" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-htp-ink mb-2">Valid TX Health Permit?</label>
                  <input type="text" value={form.health_permit} onChange={(e) => update("health_permit", e.target.value)} placeholder="Yes / No" className={inputClass} />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inspect_rig"
                  checked={form.inspect_rig}
                  onChange={(e) => update("inspect_rig", e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-htp-line"
                />
                <label htmlFor="inspect_rig" className="text-sm text-htp-ink leading-snug">
                  I will allow Hilltop to inspect my rig upon arrival for safety and cleanliness.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="px-6 py-2.5 bg-htp-red text-htp-bg rounded-btn font-medium hover:bg-[#a32e28] transition-colors disabled:opacity-50 mt-2"
              >
                {status === "sending" ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

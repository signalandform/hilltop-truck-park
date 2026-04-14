"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  food_truck_name: string | null;
  time_in_business: string | null;
  website: string | null;
  rig_size: string | null;
  dates_requested: string | null;
  food_type: string | null;
  booked_before: string | null;
  health_permit: string | null;
  inspect_rig: boolean;
  is_read: boolean;
  created_at: string;
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-sm text-slate-900">{value}</div>
    </div>
  );
}

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cms_vendor_submissions")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { router.replace("/admin/vendors"); return; }
        setItem(data);
        setLoading(false);
        if (!data.is_read) {
          supabase.from("cms_vendor_submissions").update({ is_read: true }).eq("id", id).then(() => {});
        }
      });
  }, [id, router]);

  if (loading || !item) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/vendors" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Vendor Requests
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Vendor Request: {item.food_truck_name || item.name}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
        <div className="text-xs text-slate-500 mb-4">
          Received {new Date(item.created_at).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" value={item.name} />
          <Field label="Email" value={item.email} />
          <Field label="Phone" value={item.phone} />
          <Field label="Food Truck Name" value={item.food_truck_name} />
          <Field label="Time in Business" value={item.time_in_business} />
          <Field label="Website / Social" value={item.website} />
          <Field label="Rig Size" value={item.rig_size} />
          <Field label="Food Type" value={item.food_type} />
          <Field label="Dates Requested" value={item.dates_requested} />
          <Field label="Booked Before?" value={item.booked_before} />
          <Field label="TX Health Permit?" value={item.health_permit} />
          <Field label="Allows Rig Inspection" value={item.inspect_rig ? "Yes" : "No"} />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <a
            href={`mailto:${item.email}?subject=Re: Vendor Space Request – ${item.food_truck_name || "Hilltop Truck Park"}`}
            className="inline-block bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </>
  );
}

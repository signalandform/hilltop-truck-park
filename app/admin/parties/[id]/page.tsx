"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type PartyInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  guest_count: string | null;
  child_name: string | null;
  child_age: string | null;
  package_interest: string | null;
  add_ons: string[];
  notes: string | null;
  is_read: boolean;
  created_at: string;
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-sm text-slate-900 whitespace-pre-wrap">{value}</div>
    </div>
  );
}

export default function PartyInquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<PartyInquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cms_party_inquiries")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          router.replace("/admin/parties");
          return;
        }
        setItem(data);
        setLoading(false);
        if (!data.is_read) {
          supabase
            .from("cms_party_inquiries")
            .update({ is_read: true })
            .eq("id", id)
            .then(() => {});
        }
      });
  }, [id, router]);

  if (loading || !item) return <div className="text-slate-500 text-sm">Loading...</div>;

  const replySubject = encodeURIComponent("Re: Birthday Party Inquiry at Hilltop Truck Park");

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/parties" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Party Inquiries
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Party Inquiry: {item.name}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl">
        <div className="text-xs text-slate-500 mb-4">
          Received{" "}
          {new Date(item.created_at).toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" value={item.name} />
          <Field label="Email" value={item.email} />
          <Field label="Phone" value={item.phone} />
          <Field label="Preferred Date" value={item.preferred_date} />
          <Field label="Preferred Time" value={item.preferred_time} />
          <Field label="Guest Count" value={item.guest_count} />
          <Field label="Birthday Child" value={item.child_name} />
          <Field label="Birthday Child Age" value={item.child_age} />
          <Field label="Package Interest" value={item.package_interest} />
        </div>

        {item.add_ons.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 mb-2">Add-Ons</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-900">
              {item.add_ons.map((addOn) => (
                <li key={addOn}>{addOn}</li>
              ))}
            </ul>
          </div>
        )}

        {item.notes && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Field label="Notes" value={item.notes} />
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100">
          <a
            href={`mailto:${item.email}?subject=${replySubject}`}
            className="inline-block bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </>
  );
}

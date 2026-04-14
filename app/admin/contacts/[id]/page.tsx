"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cms_contact_submissions")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { router.replace("/admin/contacts"); return; }
        setItem(data);
        setLoading(false);
        if (!data.is_read) {
          supabase.from("cms_contact_submissions").update({ is_read: true }).eq("id", id).then(() => {});
        }
      });
  }, [id, router]);

  if (loading || !item) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/contacts" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Contact Submissions
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Message from {item.name}</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Name</div>
            <div className="text-sm text-slate-900 font-medium">{item.name}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Email</div>
            <a href={`mailto:${item.email}`} className="text-sm text-blue-600 hover:underline">{item.email}</a>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Received</div>
          <div className="text-sm text-slate-700">
            {new Date(item.created_at).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Message</div>
          <div className="text-sm text-slate-900 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 border border-slate-100">
            {item.message}
          </div>
        </div>
        <div className="pt-2">
          <a
            href={`mailto:${item.email}?subject=Re: Your message to Hilltop Truck Park`}
            className="inline-block bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </>
  );
}

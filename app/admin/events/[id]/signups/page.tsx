"use client";

import { useEffect, useState } from "react";
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

type TicketTypeMap = Record<string, string>;

export default function EventSignupsPage() {
  const { id } = useParams<{ id: string }>();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [ticketNames, setTicketNames] = useState<TicketTypeMap>({});
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("cms_events").select("title").eq("id", id).single(),
      supabase
        .from("cms_event_signups")
        .select("*")
        .eq("event_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("cms_event_ticket_types")
        .select("id, name")
        .eq("event_id", id),
    ]).then(([eventRes, signupsRes, typesRes]) => {
      setEventTitle(eventRes.data?.title ?? "Event");
      setSignups(signupsRes.data ?? []);
      const names: TicketTypeMap = {};
      for (const t of typesRes.data ?? []) {
        names[t.id] = t.name;
      }
      setTicketNames(names);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async (signupId: string) => {
    if (!confirm("Remove this sign-up?")) return;
    await supabase.from("cms_event_signups").delete().eq("id", signupId);
    setSignups((prev) => prev.filter((s) => s.id !== signupId));
  };

  return (
    <>
      <div className="mb-6">
        <Link href={`/admin/events/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Event
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Sign-ups: {eventTitle}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {signups.length} registration{signups.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
              {signups.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${s.email}`} className="text-blue-600 hover:underline">{s.email}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {s.ticket_type_id ? (ticketNames[s.ticket_type_id] ?? "Unknown") : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{s.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{s.message ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
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
      </div>
    </>
  );
}

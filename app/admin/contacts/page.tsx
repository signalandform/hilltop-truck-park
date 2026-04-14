"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminContactsList() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("cms_contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await supabase.from("cms_contact_submissions").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const unreadCount = items.filter((i) => !i.is_read).length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} submission{items.length !== 1 ? "s" : ""}
            {unreadCount > 0 && <span className="ml-2 text-blue-600 font-medium">{unreadCount} unread</span>}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No submissions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-8"></th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Message</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${!item.is_read ? "bg-blue-50/50" : ""}`}
                  onClick={() => router.push(`/admin/contacts/${item.id}`)}
                >
                  <td className="px-4 py-3">
                    {!item.is_read && <span className="block w-2 h-2 rounded-full bg-blue-500" />}
                  </td>
                  <td className={`px-4 py-3 ${!item.is_read ? "font-semibold" : ""} text-slate-900`}>{item.name}</td>
                  <td className="px-4 py-3 text-slate-500">{item.email}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{item.message}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Delete
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

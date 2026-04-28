"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PartyInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_date: string | null;
  package_interest: string | null;
  is_read: boolean;
  created_at: string;
};

export default function AdminPartiesList() {
  const [items, setItems] = useState<PartyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("cms_party_inquiries")
      .select("id, name, email, phone, preferred_date, package_interest, is_read, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this party inquiry?")) return;
    await supabase.from("cms_party_inquiries").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const unreadCount = items.filter((item) => !item.is_read).length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Party Inquiries</h1>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} {items.length === 1 ? "inquiry" : "inquiries"}
            {unreadCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">{unreadCount} unread</span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No party inquiries yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-8"></th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Preferred Date</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Package</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Received</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                    !item.is_read ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => router.push(`/admin/parties/${item.id}`)}
                >
                  <td className="px-4 py-3">
                    {!item.is_read && <span className="block w-2 h-2 rounded-full bg-blue-500" />}
                  </td>
                  <td className={`px-4 py-3 text-slate-900 ${!item.is_read ? "font-semibold" : ""}`}>
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{item.email}</td>
                  <td className="px-4 py-3 text-slate-500">{item.preferred_date ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{item.package_interest ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
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

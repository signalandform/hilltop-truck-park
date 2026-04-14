"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PageRow = {
  id: string;
  page_slug: string;
  section_key: string;
  updated_at: string;
};

export default function AdminPagesList() {
  const [sections, setSections] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("cms_page_content")
      .select("id, page_slug, section_key, updated_at")
      .order("page_slug", { ascending: true })
      .order("section_key", { ascending: true })
      .then(({ data }) => {
        setSections(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this page section?")) return;
    await supabase.from("cms_page_content").delete().eq("id", id);
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Page Content</h1>
          <p className="text-sm text-slate-500 mt-1">{sections.length} section{sections.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          + New Section
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : sections.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No page content yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Page</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Section</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Last Updated</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => router.push(`/admin/pages/${s.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-slate-900 font-mono text-xs">{s.page_slug}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono text-xs">{s.section_key}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(s.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
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

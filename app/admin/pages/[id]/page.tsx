"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Form = {
  page_slug: string;
  section_key: string;
  content_json: string;
};

const EMPTY: Form = {
  page_slug: "",
  section_key: "",
  content_json: "{\n  \n}",
};

export default function PageSectionEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("cms_page_content")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { router.replace("/admin/pages"); return; }
        setForm({
          page_slug: data.page_slug,
          section_key: data.section_key,
          content_json: JSON.stringify(data.content, null, 2),
        });
        setLoading(false);
      });
  }, [id, isNew, router]);

  const update = (key: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "content_json") {
      try {
        JSON.parse(value);
        setJsonError("");
      } catch {
        setJsonError("Invalid JSON");
      }
    }
  };

  const handleSave = async () => {
    setError("");
    if (!form.page_slug.trim() || !form.section_key.trim()) {
      setError("Page slug and section key are required.");
      return;
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(form.content_json);
    } catch {
      setError("Content must be valid JSON.");
      return;
    }

    setSaving(true);

    const payload = {
      page_slug: form.page_slug.trim(),
      section_key: form.section_key.trim(),
      content: parsed,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error: err } = await supabase.from("cms_page_content").insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from("cms_page_content").update(payload).eq("id", id);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    router.push("/admin/pages");
  };

  if (loading) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/pages" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to Page Content
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {isNew ? "New Page Section" : "Edit Page Section"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !!jsonError}
          className="bg-slate-800 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Page Slug</label>
            <input
              type="text"
              value={form.page_slug}
              onChange={(e) => update("page_slug", e.target.value)}
              placeholder='e.g. "home", "pricing"'
              disabled={!isNew}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Key</label>
            <input
              type="text"
              value={form.section_key}
              onChange={(e) => update("section_key", e.target.value)}
              placeholder='e.g. "hero", "hours", "visit_us"'
              disabled={!isNew}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">Content (JSON)</label>
            {jsonError && <span className="text-red-500 text-xs">{jsonError}</span>}
          </div>
          <textarea
            value={form.content_json}
            onChange={(e) => update("content_json", e.target.value)}
            rows={18}
            spellCheck={false}
            className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:border-transparent ${
              jsonError
                ? "border-red-300 focus:ring-red-500"
                : "border-slate-300 focus:ring-blue-500"
            }`}
          />
        </div>
      </div>
    </>
  );
}

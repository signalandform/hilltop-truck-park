"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type JsonObject = Record<string, unknown>;

type Form = {
  page_slug: string;
  section_key: string;
  content: JsonObject;
};

const EMPTY: Form = {
  page_slug: "",
  section_key: "",
  content: {},
};

function humanizeKey(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inputTypeForKey(key: string) {
  if (key.includes("email")) return "email";
  if (key.includes("url") || key.includes("href") || key.includes("src")) return "url";
  return "text";
}

function isLongText(key: string, value: string) {
  return key.includes("body") || key.includes("description") || value.length > 90;
}

function emptyValueForArray(items: unknown[]) {
  const firstObject = items.find(
    (item): item is JsonObject =>
      item !== null && !Array.isArray(item) && typeof item === "object",
  );

  if (firstObject) {
    return Object.fromEntries(Object.keys(firstObject).map((key) => [key, ""]));
  }

  return "";
}

function parseScalarValue(previousValue: unknown, nextValue: string) {
  if (typeof previousValue === "number") {
    const parsed = Number(nextValue);
    return Number.isFinite(parsed) ? parsed : previousValue;
  }
  return nextValue;
}

export default function PageSectionEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");

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
          content:
            data.content && typeof data.content === "object" && !Array.isArray(data.content)
              ? (data.content as JsonObject)
              : {},
        });
        setLoading(false);
      });
  }, [id, isNew, router]);

  const update = (key: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateContentValue = (key: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      },
    }));
  };

  const updateArrayItem = (
    key: string,
    index: number,
    value: unknown,
    objectField?: string,
  ) => {
    setForm((prev) => {
      const items = Array.isArray(prev.content[key]) ? [...prev.content[key]] : [];
      if (objectField) {
        const current = items[index];
        const currentObject =
          current !== null && typeof current === "object" && !Array.isArray(current)
            ? (current as JsonObject)
            : {};
        items[index] = { ...currentObject, [objectField]: value };
      } else {
        items[index] = value;
      }

      return {
        ...prev,
        content: {
          ...prev.content,
          [key]: items,
        },
      };
    });
  };

  const addArrayItem = (key: string, items: unknown[]) => {
    updateContentValue(key, [...items, emptyValueForArray(items)]);
  };

  const removeArrayItem = (key: string, index: number) => {
    setForm((prev) => {
      const items = Array.isArray(prev.content[key]) ? [...prev.content[key]] : [];
      items.splice(index, 1);
      return {
        ...prev,
        content: {
          ...prev.content,
          [key]: items,
        },
      };
    });
  };

  const handleSave = async () => {
    setError("");
    if (!form.page_slug.trim() || !form.section_key.trim()) {
      setError("Page slug and section key are required.");
      return;
    }

    setSaving(true);

    const payload = {
      page_slug: form.page_slug.trim(),
      section_key: form.section_key.trim(),
      content: form.content,
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

  const contentEntries = Object.entries(form.content);

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
          {!isNew && (
            <p className="text-sm text-slate-500 mt-1">
              {humanizeKey(form.page_slug)} / {humanizeKey(form.section_key)}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
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

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Page</label>
            <input
              type="text"
              value={form.page_slug}
              onChange={(e) => update("page_slug", e.target.value)}
              placeholder='e.g. "home", "pricing"'
              disabled={!isNew}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            />
            {!isNew && <p className="text-xs text-slate-400 mt-1">Internal key: {form.page_slug}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
            <input
              type="text"
              value={form.section_key}
              onChange={(e) => update("section_key", e.target.value)}
              placeholder='e.g. "hero", "hours", "visit_us"'
              disabled={!isNew}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            />
            {!isNew && <p className="text-xs text-slate-400 mt-1">Internal key: {form.section_key}</p>}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Editable Content</h2>
          <p className="text-sm text-slate-500 mb-5">
            Edit the text and lists below. The site will save this in the format it already uses.
          </p>

          {contentEntries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
              No fields yet. Existing page sections will show editable fields here.
            </div>
          ) : (
            <div className="space-y-5">
              {contentEntries.map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {humanizeKey(key)}
                  </label>

                  {typeof value === "boolean" ? (
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateContentValue(key, e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      Enabled
                    </label>
                  ) : typeof value === "string" || typeof value === "number" ? (
                    isLongText(key, String(value)) ? (
                      <textarea
                        value={String(value)}
                        onChange={(e) =>
                          updateContentValue(key, parseScalarValue(value, e.target.value))
                        }
                        rows={4}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <input
                        type={typeof value === "number" ? "number" : inputTypeForKey(key)}
                        value={String(value)}
                        onChange={(e) =>
                          updateContentValue(key, parseScalarValue(value, e.target.value))
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )
                  ) : Array.isArray(value) ? (
                    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                      {value.length === 0 ? (
                        <p className="text-sm text-slate-500">No items yet.</p>
                      ) : (
                        value.map((item, index) => {
                          const itemObject =
                            item !== null && typeof item === "object" && !Array.isArray(item)
                              ? (item as JsonObject)
                              : null;

                          return (
                            <div key={index} className="rounded-lg border border-slate-200 bg-white p-3">
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <p className="text-xs font-medium text-slate-500">
                                  {humanizeKey(key)} #{index + 1}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem(key, index)}
                                  className="text-xs font-medium text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>

                              {itemObject ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {Object.entries(itemObject).map(([itemKey, itemValue]) => (
                                    <label key={itemKey} className="block">
                                      <span className="block text-xs font-medium text-slate-500 mb-1">
                                        {humanizeKey(itemKey)}
                                      </span>
                                      <input
                                        type={inputTypeForKey(itemKey)}
                                        value={String(itemValue ?? "")}
                                        onChange={(e) =>
                                          updateArrayItem(key, index, e.target.value, itemKey)
                                        }
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={String(item ?? "")}
                                  onChange={(e) => updateArrayItem(key, index, e.target.value)}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              )}
                            </div>
                          );
                        })
                      )}

                      <button
                        type="button"
                        onClick={() => addArrayItem(key, value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        + Add {humanizeKey(key).replace(/s$/, "")}
                      </button>
                    </div>
                  ) : value !== null && typeof value === "object" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                      {Object.entries(value as JsonObject).map(([nestedKey, nestedValue]) => (
                        <label key={nestedKey} className="block">
                          <span className="block text-xs font-medium text-slate-500 mb-1">
                            {humanizeKey(nestedKey)}
                          </span>
                          <input
                            type={inputTypeForKey(nestedKey)}
                            value={String(nestedValue ?? "")}
                            onChange={(e) =>
                              updateContentValue(key, {
                                ...(value as JsonObject),
                                [nestedKey]: e.target.value,
                              })
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value=""
                      onChange={(e) => updateContentValue(key, e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

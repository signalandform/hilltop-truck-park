"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Form = {
  name: string;
  cuisine: string;
  blurb: string;
  image_url: string;
  website_url: string;
  sort_order: number;
  is_active: boolean;
};

const EMPTY: Form = {
  name: "",
  cuisine: "",
  blurb: "",
  image_url: "",
  website_url: "",
  sort_order: 0,
  is_active: true,
};

function normalizeExternalUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export default function TruckEditor() {
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
      .from("cms_food_trucks")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { router.replace("/admin/trucks"); return; }
        setForm({
          name: data.name,
          cuisine: data.cuisine,
          blurb: data.blurb ?? "",
          image_url: data.image_url ?? "",
          website_url: data.website_url ?? "",
          sort_order: data.sort_order,
          is_active: data.is_active,
        });
        setLoading(false);
      });
  }, [id, isNew, router]);

  const update = (key: keyof Form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError("");
    if (!form.name.trim() || !form.cuisine.trim()) {
      setError("Name and cuisine are required.");
      return;
    }
    const websiteUrl = normalizeExternalUrl(form.website_url);
    if (form.website_url.trim() && !websiteUrl) {
      setError("Outbound link must be a valid http(s) URL.");
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      cuisine: form.cuisine.trim(),
      blurb: form.blurb.trim() || null,
      image_url: form.image_url.trim() || null,
      website_url: websiteUrl,
      sort_order: form.sort_order,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error: err } = await supabase.from("cms_food_trucks").insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from("cms_food_trucks").update(payload).eq("id", id);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    router.push("/admin/trucks");
  };

  if (loading) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/trucks" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to Food Trucks
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {isNew ? "New Food Truck" : "Edit Food Truck"}
          </h1>
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

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine</label>
            <input
              type="text"
              value={form.cuisine}
              onChange={(e) => update("cuisine", e.target.value)}
              placeholder='e.g. "Tex-Mex", "BBQ"'
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Outbound Link
          </label>
          <input
            type="url"
            value={form.website_url}
            onChange={(e) => update("website_url", e.target.value)}
            placeholder="https://instagram.com/foodtruck"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-slate-500">
            Optional website, menu, Instagram, or ordering link shown on the public food truck card.
          </p>
        </div>

        <ImageUpload
          value={form.image_url}
          onChange={(url) => update("image_url", url)}
          folder="trucks"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Blurb</label>
          <textarea
            value={form.blurb}
            onChange={(e) => update("blurb", e.target.value)}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
            className="rounded border-slate-300"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
            Active
          </label>
        </div>
      </div>
    </>
  );
}

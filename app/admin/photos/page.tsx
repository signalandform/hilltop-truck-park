"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { GalleryPhoto } from "@/lib/cms";

type StagedFile = {
  id: string;
  file: File;
  previewUrl: string;
  progress: "pending" | "uploading" | "done" | "error";
  error?: string;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const SUPABASE_PUBLIC_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cms-images/`;

function storagePathFromUrl(url: string): string | null {
  if (!url.startsWith(SUPABASE_PUBLIC_PREFIX)) return null;
  return url.slice(SUPABASE_PUBLIC_PREFIX.length);
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      setUploadError(error.message);
    } else {
      setPhotos(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const publishedCount = photos.filter((p) => p.is_published).length;
  const featuredCount = photos.filter((p) => p.is_featured).length;

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError("");

    const next: StagedFile[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        next.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: "",
          progress: "error",
          error: "Not an image",
        });
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        next.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: "",
          progress: "error",
          error: "File must be under 10 MB",
        });
        return;
      }
      next.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        progress: "pending",
      });
    });
    setStaged((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeStaged = (id: string) => {
    setStaged((prev) => {
      const item = prev.find((s) => s.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
  };

  const uploadStaged = async () => {
    const queue = staged.filter((s) => s.progress === "pending");
    if (queue.length === 0) return;
    setUploading(true);
    setUploadError("");

    const maxSort =
      photos.reduce((acc, p) => (p.sort_order > acc ? p.sort_order : acc), 0) ?? 0;
    let nextSort = maxSort + 10;

    for (const item of queue) {
      setStaged((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, progress: "uploading" } : s)),
      );

      const ext = item.file.name.split(".").pop() || "jpg";
      const path = `photo-fun/${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("cms-images")
        .upload(path, item.file, { upsert: false, contentType: item.file.type });

      if (uploadErr) {
        setStaged((prev) =>
          prev.map((s) =>
            s.id === item.id
              ? { ...s, progress: "error", error: uploadErr.message }
              : s,
          ),
        );
        continue;
      }

      const { data: pub } = supabase.storage.from("cms-images").getPublicUrl(path);
      const { error: insertErr } = await supabase.from("cms_gallery_photos").insert({
        image_url: pub.publicUrl,
        sort_order: nextSort,
        is_published: true,
      });
      nextSort += 10;

      if (insertErr) {
        setStaged((prev) =>
          prev.map((s) =>
            s.id === item.id
              ? { ...s, progress: "error", error: insertErr.message }
              : s,
          ),
        );
        continue;
      }

      setStaged((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, progress: "done" } : s)),
      );
    }

    setUploading(false);
    await loadPhotos();

    setTimeout(() => {
      setStaged((prev) => {
        prev
          .filter((s) => s.progress === "done")
          .forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
        return prev.filter((s) => s.progress !== "done");
      });
    }, 800);
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    setSavingId(photo.id);

    const { error: delErr } = await supabase
      .from("cms_gallery_photos")
      .delete()
      .eq("id", photo.id);

    if (delErr) {
      alert(`Delete failed: ${delErr.message}`);
      setSavingId(null);
      return;
    }

    const storagePath = storagePathFromUrl(photo.image_url);
    if (storagePath) {
      await supabase.storage.from("cms-images").remove([storagePath]);
    }

    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setSavingId(null);
  };

  const togglePublished = async (photo: GalleryPhoto) => {
    setSavingId(photo.id);
    const { error } = await supabase
      .from("cms_gallery_photos")
      .update({ is_published: !photo.is_published })
      .eq("id", photo.id);
    if (!error) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, is_published: !p.is_published } : p,
        ),
      );
    }
    setSavingId(null);
  };

  const toggleFeatured = async (photo: GalleryPhoto) => {
    setSavingId(photo.id);
    const { error } = await supabase
      .from("cms_gallery_photos")
      .update({ is_featured: !photo.is_featured })
      .eq("id", photo.id);
    if (!error) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, is_featured: !p.is_featured } : p,
        ),
      );
    }
    setSavingId(null);
  };

  const updateCaption = async (photo: GalleryPhoto, value: string) => {
    setSavingId(photo.id);
    const caption = value.trim() === "" ? null : value.trim();
    const { error } = await supabase
      .from("cms_gallery_photos")
      .update({ caption, alt_text: caption })
      .eq("id", photo.id);
    if (!error) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, caption, alt_text: caption } : p,
        ),
      );
    }
    setSavingId(null);
  };

  const updateSort = async (photo: GalleryPhoto, value: number) => {
    if (Number.isNaN(value)) return;
    setSavingId(photo.id);
    const { error } = await supabase
      .from("cms_gallery_photos")
      .update({ sort_order: value })
      .eq("id", photo.id);
    if (!error) {
      setPhotos((prev) =>
        [...prev.map((p) => (p.id === photo.id ? { ...p, sort_order: value } : p))].sort(
          (a, b) => a.sort_order - b.sort_order,
        ),
      );
    }
    setSavingId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Photo Gallery</h1>
          <p className="text-sm text-slate-500 mt-1">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} · {publishedCount}{" "}
            published · {featuredCount} featured
          </p>
        </div>
        <a
          href="/photo-fun"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2"
        >
          View public page ↗
        </a>
      </div>

      {/* Upload panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-1">Upload new photos</h2>
        <p className="text-xs text-slate-500 mb-4">
          JPG, PNG, WEBP or GIF. Up to 10 MB each. Multiple files supported.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="block text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
          {staged.some((s) => s.progress === "pending") && (
            <button
              type="button"
              onClick={uploadStaged}
              disabled={uploading}
              className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${staged.filter((s) => s.progress === "pending").length} photo${
                    staged.filter((s) => s.progress === "pending").length === 1 ? "" : "s"
                  }`}
            </button>
          )}
        </div>

        {uploadError && (
          <p className="text-xs text-red-600 mt-3">{uploadError}</p>
        )}

        {staged.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {staged.map((s) => (
              <li
                key={s.id}
                className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50"
              >
                {s.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.previewUrl}
                    alt=""
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center text-xs text-slate-400 px-2 text-center">
                    {s.file.name}
                  </div>
                )}
                <div className="p-1.5 text-[10px] text-slate-500 truncate">
                  {s.file.name}
                </div>
                {s.progress === "pending" && (
                  <button
                    type="button"
                    onClick={() => removeStaged(s.id)}
                    className="absolute top-1 right-1 bg-white/90 border border-slate-200 rounded-full w-5 h-5 text-xs text-slate-600 hover:text-red-600"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                )}
                {s.progress === "uploading" && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs text-slate-700">
                    Uploading...
                  </div>
                )}
                {s.progress === "done" && (
                  <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center text-xs text-white font-medium">
                    Uploaded
                  </div>
                )}
                {s.progress === "error" && (
                  <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center text-[10px] text-white text-center px-2">
                    <span className="font-medium">Failed</span>
                    <span>{s.error}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gallery grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : photos.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No photos yet. Upload your first photos above.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <li
                key={photo.id}
                className={`group rounded-lg border ${
                  photo.is_published ? "border-slate-200" : "border-slate-200 opacity-60"
                } overflow-hidden flex flex-col bg-white`}
              >
                <div className="relative aspect-square bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.image_url}
                    alt={photo.alt_text ?? ""}
                    className="w-full h-full object-cover"
                  />
                  {photo.is_featured && (
                    <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      FEATURED
                    </span>
                  )}
                  {!photo.is_published && (
                    <span className="absolute top-2 right-2 bg-slate-800 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      HIDDEN
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col gap-2 text-xs">
                  <input
                    type="text"
                    defaultValue={photo.caption ?? ""}
                    onBlur={(e) => {
                      if ((e.target.value || "") !== (photo.caption ?? "")) {
                        updateCaption(photo, e.target.value);
                      }
                    }}
                    placeholder="Add caption / alt text..."
                    className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-400"
                  />

                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-500">Order</label>
                    <input
                      type="number"
                      defaultValue={photo.sort_order}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (v !== photo.sort_order) updateSort(photo, v);
                      }}
                      className="w-16 border border-slate-200 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-slate-400"
                    />
                    {savingId === photo.id && (
                      <span className="text-[10px] text-blue-600">saving...</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={photo.is_published}
                        onChange={() => togglePublished(photo)}
                        className="rounded border-slate-300"
                      />
                      <span>Published</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={photo.is_featured}
                        onChange={() => toggleFeatured(photo)}
                        className="rounded border-slate-300"
                      />
                      <span>Featured</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(photo)}
                    disabled={savingId === photo.id}
                    className="text-red-500 hover:text-red-700 text-xs font-medium self-start mt-1 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

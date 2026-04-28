"use client";

import { useEffect, useRef, useState } from "react";
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

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
};

type GalleryContentRow = {
  id: string;
  content: {
    images?: unknown;
  } | null;
};

type GalleryUpload = {
  id: string;
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
};

const MAX_GALLERY_FILE_BYTES = 10 * 1024 * 1024;

function newGalleryItem(src = "", alt = ""): GalleryItem {
  return {
    id: crypto.randomUUID(),
    src,
    alt,
  };
}

function parseGalleryItems(content: GalleryContentRow["content"]): GalleryItem[] {
  const images = Array.isArray(content?.images) ? content.images : [];
  return images
    .map((image) => {
      if (typeof image === "string") return newGalleryItem(image, "");
      if (!image || typeof image !== "object") return null;
      const candidate = image as { src?: unknown; alt?: unknown };
      const src = typeof candidate.src === "string" ? candidate.src : "";
      const alt = typeof candidate.alt === "string" ? candidate.alt : "";
      return newGalleryItem(src, alt);
    })
    .filter((item): item is GalleryItem => item !== null);
}

function altTextFromFileName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AdminPartiesList() {
  const [items, setItems] = useState<PartyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryContentId, setGalleryContentId] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [gallerySaving, setGallerySaving] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState("");
  const [galleryError, setGalleryError] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryDragActive, setGalleryDragActive] = useState(false);
  const [galleryUploads, setGalleryUploads] = useState<GalleryUpload[]>([]);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
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

    supabase
      .from("cms_page_content")
      .select("id, content")
      .eq("page_slug", "book-your-party")
      .eq("section_key", "gallery")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setGalleryError(error.message);
        } else {
          const row = data as GalleryContentRow | null;
          setGalleryContentId(row?.id ?? null);
          setGalleryItems(parseGalleryItems(row?.content ?? null));
        }
        setGalleryLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this party inquiry?")) return;
    await supabase.from("cms_party_inquiries").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const unreadCount = items.filter((item) => !item.is_read).length;

  const updateGalleryItem = (
    id: string,
    key: "src" | "alt",
    value: string,
  ) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
    setGalleryMessage("");
  };

  const removeGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    setGalleryMessage("");
  };

  const saveGalleryItems = async (
    currentItems: GalleryItem[],
    successMessage = "Party gallery saved.",
  ) => {
    setGallerySaving(true);
    setGalleryError("");
    setGalleryMessage("");

    const images = currentItems
      .map((item) => ({
        src: item.src.trim(),
        alt: item.alt.trim(),
      }))
      .filter((item) => item.src !== "");

    const payload = {
      page_slug: "book-your-party",
      section_key: "gallery",
      content: { images },
      updated_at: new Date().toISOString(),
    };

    if (galleryContentId) {
      const { error } = await supabase
        .from("cms_page_content")
        .update(payload)
        .eq("id", galleryContentId);
      if (error) {
        setGalleryError(error.message);
        setGallerySaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("cms_page_content")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        setGalleryError(error.message);
        setGallerySaving(false);
        return;
      }
      setGalleryContentId(data.id);
    }

    setGalleryItems(images.map((item) => newGalleryItem(item.src, item.alt)));
    setGalleryMessage(successMessage);
    setGallerySaving(false);
  };

  const saveGallery = async () => {
    await saveGalleryItems(galleryItems);
  };

  const uploadGalleryFiles = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    const uploads = selectedFiles.map<GalleryUpload>((file) => {
      if (!file.type.startsWith("image/")) {
        return {
          id: crypto.randomUUID(),
          name: file.name,
          status: "error",
          error: "Not an image",
        };
      }
      if (file.size > MAX_GALLERY_FILE_BYTES) {
        return {
          id: crypto.randomUUID(),
          name: file.name,
          status: "error",
          error: "File must be under 10 MB",
        };
      }
      return {
        id: crypto.randomUUID(),
        name: file.name,
        status: "uploading",
      };
    });

    setGalleryError("");
    setGalleryMessage("");
    setGalleryUploads(uploads);

    const uploadableFiles = selectedFiles
      .map((file, index) => ({ file, upload: uploads[index] }))
      .filter(({ upload }) => upload.status === "uploading");

    if (uploadableFiles.length === 0) {
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
      return;
    }

    setGalleryUploading(true);

    const uploadedItems: GalleryItem[] = [];
    for (const { file, upload } of uploadableFiles) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `party-gallery/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("cms-images")
        .upload(path, file, { upsert: false, contentType: file.type });

      if (uploadError) {
        setGalleryUploads((prev) =>
          prev.map((item) =>
            item.id === upload.id
              ? { ...item, status: "error", error: uploadError.message }
              : item,
          ),
        );
        continue;
      }

      const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
      uploadedItems.push(
        newGalleryItem(data.publicUrl, altTextFromFileName(file.name)),
      );
      setGalleryUploads((prev) =>
        prev.map((item) =>
          item.id === upload.id ? { ...item, status: "done" } : item,
        ),
      );
    }

    if (uploadedItems.length > 0) {
      await saveGalleryItems(
        [...galleryItems, ...uploadedItems],
        `${uploadedItems.length} image${
          uploadedItems.length === 1 ? "" : "s"
        } uploaded and saved.`,
      );
    }

    setGalleryUploading(false);
    setGalleryDragActive(false);
    if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
  };

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

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Book Your Party Photo Gallery
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Controls the slow five-wide gallery on <code>/book-your-party</code>. Upload photos
              or add direct image URLs for birthday parties, bounce houses, foam parties, and add-ons.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/book-your-party"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2"
            >
              View page ↗
            </a>
            <button
              type="button"
              onClick={saveGallery}
              disabled={gallerySaving || galleryLoading}
              className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {gallerySaving ? "Saving..." : "Save Gallery"}
            </button>
          </div>
        </div>

        {galleryError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {galleryError}
          </p>
        )}
        {galleryMessage && (
          <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            {galleryMessage}
          </p>
        )}

        <div
          className={`mt-5 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
            galleryDragActive
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 bg-slate-50"
          }`}
          onDragEnter={(e) => {
            e.preventDefault();
            setGalleryDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setGalleryDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (e.currentTarget === e.target) setGalleryDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setGalleryDragActive(false);
            uploadGalleryFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={galleryFileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) uploadGalleryFiles(e.target.files);
            }}
          />
          <p className="text-sm font-medium text-slate-800">
            Drag and drop party gallery photos here
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Or choose files to upload. Images are saved to Supabase storage and added to this
            gallery automatically.
          </p>
          <button
            type="button"
            onClick={() => galleryFileInputRef.current?.click()}
            disabled={galleryUploading || gallerySaving || galleryLoading}
            className="mt-3 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
          >
            {galleryUploading ? "Uploading..." : "Choose Images"}
          </button>
        </div>

        {galleryUploads.length > 0 && (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {galleryUploads.map((upload) => (
              <li
                key={upload.id}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  upload.status === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : upload.status === "done"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-blue-200 bg-blue-50 text-blue-700"
                }`}
              >
                <span className="block truncate font-medium">{upload.name}</span>
                <span>
                  {upload.status === "uploading"
                    ? "Uploading..."
                    : upload.status === "done"
                      ? "Uploaded"
                      : upload.error}
                </span>
              </li>
            ))}
          </ul>
        )}

        {galleryLoading ? (
          <div className="mt-5 text-sm text-slate-500">Loading gallery settings...</div>
        ) : (
          <div className="mt-5 space-y-3">
            {galleryItems.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                No custom gallery images yet. Add URLs or upload images above.
              </p>
            ) : (
              galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[4.5rem_1fr_1fr_auto]"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-slate-200">
                    {item.src.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                        #{index + 1}
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Image URL
                    </span>
                    <input
                      type="text"
                      value={item.src}
                      onChange={(e) => updateGalleryItem(item.id, "src", e.target.value)}
                      placeholder="/images/photo-fun/example.jpg"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Alt Text
                    </span>
                    <input
                      type="text"
                      value={item.alt}
                      onChange={(e) => updateGalleryItem(item.id, "alt", e.target.value)}
                      placeholder="Birthday party at Hilltop Truck Park"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(item.id)}
                    className="self-end rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}

            <button
              type="button"
              onClick={() => {
                setGalleryItems((prev) => [...prev, newGalleryItem()]);
                setGalleryMessage("");
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              + Add image URL
            </button>
          </div>
        )}
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

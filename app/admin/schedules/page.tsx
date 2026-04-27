"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";

type ScheduleContent = {
  monthly_image_url: string | null;
  weekly_image_url: string | null;
  upcoming_event_image_urls: string[];
  monthly_uploaded_at: string | null;
  weekly_uploaded_at: string | null;
  upcoming_event_uploaded_ats: (string | null)[];
};

type ScheduleKind = "monthly" | "weekly" | "upcoming";

const PAGE_SLUG = "home";
const SECTION_KEY = "schedules";

const EMPTY_CONTENT: ScheduleContent = {
  monthly_image_url: null,
  weekly_image_url: null,
  upcoming_event_image_urls: ["", "", ""],
  monthly_uploaded_at: null,
  weekly_uploaded_at: null,
  upcoming_event_uploaded_ats: [null, null, null],
};

function normalizeStringSlots(value: unknown): string[] {
  if (!Array.isArray(value)) return ["", "", ""];
  return [0, 1, 2].map((index) =>
    typeof value[index] === "string" ? value[index] : "",
  );
}

function normalizeDateSlots(value: unknown): (string | null)[] {
  if (!Array.isArray(value)) return [null, null, null];
  return [0, 1, 2].map((index) =>
    typeof value[index] === "string" ? value[index] : null,
  );
}

function normalizeContent(content: unknown): ScheduleContent {
  const value =
    content && typeof content === "object"
      ? (content as Record<string, unknown>)
      : {};

  return {
    monthly_image_url:
      typeof value.monthly_image_url === "string" ? value.monthly_image_url : null,
    weekly_image_url:
      typeof value.weekly_image_url === "string" ? value.weekly_image_url : null,
    upcoming_event_image_urls: normalizeStringSlots(
      value.upcoming_event_image_urls,
    ),
    monthly_uploaded_at:
      typeof value.monthly_uploaded_at === "string" ? value.monthly_uploaded_at : null,
    weekly_uploaded_at:
      typeof value.weekly_uploaded_at === "string" ? value.weekly_uploaded_at : null,
    upcoming_event_uploaded_ats: normalizeDateSlots(
      value.upcoming_event_uploaded_ats,
    ),
  };
}

function formatSavedDate(value: string | null) {
  if (!value) return "Not uploaded yet";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminSchedulesPage() {
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [content, setContent] = useState<ScheduleContent>(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [savingKind, setSavingKind] = useState<ScheduleKind | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase
      .from("cms_page_content")
      .select("id, content")
      .eq("page_slug", PAGE_SLUG)
      .eq("section_key", SECTION_KEY)
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (loadError) {
          setError(loadError.message);
        } else if (data) {
          setSectionId(data.id);
          setContent(normalizeContent(data.content));
        }
        setLoading(false);
      });
  }, []);

  const persistContent = async (
    nextContent: ScheduleContent,
    kind: ScheduleKind,
  ) => {
    setSavingKind(kind);
    setError("");
    setStatus("");

    const payload = {
      page_slug: PAGE_SLUG,
      section_key: SECTION_KEY,
      content: nextContent,
      updated_at: new Date().toISOString(),
    };

    if (sectionId) {
      const { error: updateError } = await supabase
        .from("cms_page_content")
        .update(payload)
        .eq("id", sectionId);

      if (updateError) {
        setError(updateError.message);
        setSavingKind(null);
        return;
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("cms_page_content")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setSavingKind(null);
        return;
      }
      setSectionId(data.id);
    }

    const label =
      kind === "monthly"
        ? "Monthly"
        : kind === "weekly"
          ? "Weekly"
          : "Upcoming events";
    setStatus(`${label} schedule saved.`);
    setSavingKind(null);
  };

  const handleImageChange = (kind: ScheduleKind, url: string) => {
    const nextContent = {
      ...content,
      [`${kind}_image_url`]: url || null,
      [`${kind}_uploaded_at`]: url ? new Date().toISOString() : null,
    } as ScheduleContent;

    setContent(nextContent);
    void persistContent(nextContent, kind);
  };

  const handleUpcomingEventImageChange = (index: number, url: string) => {
    const nextImageUrls = [...content.upcoming_event_image_urls];
    const nextUploadedAts = [...content.upcoming_event_uploaded_ats];
    nextImageUrls[index] = url;
    nextUploadedAts[index] = url ? new Date().toISOString() : null;

    const nextContent = {
      ...content,
      upcoming_event_image_urls: nextImageUrls,
      upcoming_event_uploaded_ats: nextUploadedAts,
    };

    setContent(nextContent);
    void persistContent(nextContent, "upcoming");
  };

  if (loading) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule Images</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload the monthly, weekly, and upcoming event images shown under Hours on the landing page.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2"
        >
          View landing page ↗
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      {status && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2.5 mb-4">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Monthly Schedule</h2>
            <p className="text-xs text-slate-500 mt-1">
              Current upload: {formatSavedDate(content.monthly_uploaded_at)}
            </p>
          </div>
          <ImageUpload
            value={content.monthly_image_url ?? ""}
            onChange={(url) => handleImageChange("monthly", url)}
            folder="schedules/monthly"
            label="Monthly schedule image"
            helpText="Uploading a new image immediately replaces the This Month image on the landing page."
          />
          {savingKind === "monthly" && (
            <p className="text-xs text-blue-600">Saving monthly schedule...</p>
          )}
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Weekly Schedule</h2>
            <p className="text-xs text-slate-500 mt-1">
              Current upload: {formatSavedDate(content.weekly_uploaded_at)}
            </p>
          </div>
          <ImageUpload
            value={content.weekly_image_url ?? ""}
            onChange={(url) => handleImageChange("weekly", url)}
            folder="schedules/weekly"
            label="Weekly schedule image"
            helpText="Uploading a new image immediately replaces the This Week image on the landing page."
          />
          {savingKind === "weekly" && (
            <p className="text-xs text-blue-600">Saving weekly schedule...</p>
          )}
        </section>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 mt-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
          <p className="text-xs text-slate-500 mt-1">
            Add up to 3 event images. Filled slots are live on the landing page.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-100 bg-slate-50/60 p-4"
            >
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Event image {index + 1}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Current upload:{" "}
                  {formatSavedDate(content.upcoming_event_uploaded_ats[index])}
                </p>
              </div>
              <ImageUpload
                value={content.upcoming_event_image_urls[index] ?? ""}
                onChange={(url) => handleUpcomingEventImageChange(index, url)}
                folder="schedules/upcoming-events"
                label={`Upcoming event image ${index + 1}`}
                helpText="Uploading or removing this image updates the landing page immediately."
              />
            </div>
          ))}
        </div>
        {savingKind === "upcoming" && (
          <p className="text-xs text-blue-600">Saving upcoming events...</p>
        )}
      </section>
    </>
  );
}

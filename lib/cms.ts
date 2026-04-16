import { supabase } from "./supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string;
  author: string | null;
  image_url: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type CmsEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date_label: string;
  event_date: string | null;
  location: string | null;
  signup_enabled: boolean;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FoodTruck = {
  id: string;
  name: string;
  cuisine: string;
  blurb: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PageContent<T = Record<string, unknown>> = {
  id: string;
  page_slug: string;
  section_key: string;
  content: T;
  updated_at: string;
};

// ---------------------------------------------------------------------------
// ISR revalidation interval (seconds)
// ---------------------------------------------------------------------------

export const CMS_REVALIDATE = 60;

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("cms_blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("cms_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBlogSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("cms_blog_posts")
    .select("slug")
    .eq("is_published", true);

  if (error) throw error;
  return (data ?? []).map((r) => r.slug);
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function getEvents(): Promise<CmsEvent[]> {
  const { data, error } = await supabase
    .from("cms_events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data ?? [];
}

export async function getUpcomingEvents(): Promise<CmsEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("cms_events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPastEvents(): Promise<CmsEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("cms_events")
    .select("*")
    .eq("is_published", true)
    .lt("event_date", today)
    .order("event_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getEvent(slug: string): Promise<CmsEvent | null> {
  const { data, error } = await supabase
    .from("cms_events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getEventSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("cms_events")
    .select("slug")
    .eq("is_published", true);

  if (error) throw error;
  return (data ?? []).map((r) => r.slug);
}

// ---------------------------------------------------------------------------
// Food Trucks
// ---------------------------------------------------------------------------

export async function getFoodTrucks(): Promise<FoodTruck[]> {
  const { data, error } = await supabase
    .from("cms_food_trucks")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Page Content
// ---------------------------------------------------------------------------

export async function getPageContent<T = Record<string, unknown>>(
  pageSlug: string,
  sectionKey: string,
): Promise<T | null> {
  const { data, error } = await supabase
    .from("cms_page_content")
    .select("content")
    .eq("page_slug", pageSlug)
    .eq("section_key", sectionKey)
    .maybeSingle();

  if (error) throw error;
  return (data?.content as T) ?? null;
}

export async function getPageSections(
  pageSlug: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase
    .from("cms_page_content")
    .select("section_key, content")
    .eq("page_slug", pageSlug);

  if (error) throw error;
  const sections: Record<string, unknown> = {};
  for (const row of data ?? []) {
    sections[row.section_key] = row.content;
  }
  return sections;
}

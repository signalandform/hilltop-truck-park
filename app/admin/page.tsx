"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Counts = {
  blog: number;
  events: number;
  trucks: number;
  pages: number;
};

const CARDS = [
  { key: "blog" as const, label: "Blog Posts", href: "/admin/blog", description: "Create and manage blog posts" },
  { key: "events" as const, label: "Events", href: "/admin/events", description: "Manage upcoming events" },
  { key: "trucks" as const, label: "Food Trucks", href: "/admin/trucks", description: "Update the truck lineup" },
  { key: "pages" as const, label: "Page Content", href: "/admin/pages", description: "Edit site copy and sections" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ blog: 0, events: 0, trucks: 0, pages: 0 });

  useEffect(() => {
    async function load() {
      const [b, e, t, p] = await Promise.all([
        supabase.from("cms_blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("cms_events").select("id", { count: "exact", head: true }),
        supabase.from("cms_food_trucks").select("id", { count: "exact", head: true }),
        supabase.from("cms_page_content").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        blog: b.count ?? 0,
        events: e.count ?? 0,
        trucks: t.count ?? 0,
        pages: p.count ?? 0,
      });
    }
    load();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Manage your Hilltop Truck Park website content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {counts[card.key]}
            </div>
            <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
              {card.label}
            </div>
            <div className="text-xs text-slate-500 mt-1">{card.description}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

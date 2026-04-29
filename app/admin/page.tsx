"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Counts = {
  blog: number;
  events: number;
  markets: number;
  trucks: number;
  schedules: number;
  pages: number;
  contacts: number;
  parties: number;
  vendors: number;
  crm: number;
};

const CONTENT_CARDS = [
  { key: "blog" as const, label: "Blog Posts", href: "/admin/blog", description: "Create and manage blog posts" },
  { key: "events" as const, label: "Events", href: "/admin/events", description: "Ticketed events, classes, raffles" },
  { key: "markets" as const, label: "Markets", href: "/admin/markets", description: "Manage upcoming markets" },
  { key: "trucks" as const, label: "Food Trucks", href: "/admin/trucks", description: "Update the truck lineup" },
  { key: "schedules" as const, label: "Schedules", href: "/admin/schedules", description: "Upload schedule and event images" },
  { key: "pages" as const, label: "Page Content", href: "/admin/pages", description: "Edit site copy and sections" },
];

const INBOX_CARDS = [
  { key: "contacts" as const, label: "Contact Messages", href: "/admin/contacts", description: "View contact form submissions" },
  { key: "parties" as const, label: "Party Inquiries", href: "/admin/parties", description: "View birthday party inquiries" },
  { key: "vendors" as const, label: "Vendor Requests", href: "/admin/vendors", description: "View vendor space requests" },
];

const CUSTOMER_CARDS = [
  { key: "crm" as const, label: "CRM Customers", href: "/admin/crm", description: "View customer engagement history" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    blog: 0,
    events: 0,
    markets: 0,
    trucks: 0,
    schedules: 0,
    pages: 0,
    contacts: 0,
    parties: 0,
    vendors: 0,
    crm: 0,
  });
  const [unread, setUnread] = useState({ contacts: 0, parties: 0, vendors: 0 });

  useEffect(() => {
    async function load() {
      const [b, e, m, t, s, p, c, pi, v, crm, cu, piu, vu] = await Promise.all([
        supabase.from("cms_blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("cms_events").select("id", { count: "exact", head: true }),
        supabase.from("cms_markets").select("id", { count: "exact", head: true }),
        supabase.from("cms_food_trucks").select("id", { count: "exact", head: true }),
        supabase.from("cms_page_content").select("id", { count: "exact", head: true }).eq("page_slug", "home").eq("section_key", "schedules"),
        supabase.from("cms_page_content").select("id", { count: "exact", head: true }),
        supabase.from("cms_contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("cms_party_inquiries").select("id", { count: "exact", head: true }),
        supabase.from("cms_vendor_submissions").select("id", { count: "exact", head: true }),
        supabase.from("cms_crm_customers").select("id", { count: "exact", head: true }),
        supabase.from("cms_contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("cms_party_inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("cms_vendor_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);
      setCounts({
        blog: b.count ?? 0,
        events: e.count ?? 0,
        markets: m.count ?? 0,
        trucks: t.count ?? 0,
        schedules: s.count ?? 0,
        pages: p.count ?? 0,
        contacts: c.count ?? 0,
        parties: pi.count ?? 0,
        vendors: v.count ?? 0,
        crm: crm.count ?? 0,
      });
      setUnread({
        contacts: cu.count ?? 0,
        parties: piu.count ?? 0,
        vendors: vu.count ?? 0,
      });
    }
    load();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Manage your Hilltop Truck Park website content.</p>

      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Content</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {CONTENT_CARDS.map((card) => (
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

      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Inbox</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {INBOX_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{counts[card.key]}</span>
              {unread[card.key] > 0 && (
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {unread[card.key]} new
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors mt-1">
              {card.label}
            </div>
            <div className="text-xs text-slate-500 mt-1">{card.description}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Customers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CUSTOMER_CARDS.map((card) => (
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

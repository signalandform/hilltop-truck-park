"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { CmsMarket } from "@/lib/cms";

export default function AdminMarketsList() {
  const [markets, setMarkets] = useState<CmsMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("cms_markets")
      .select("*")
      .order("event_date", { ascending: true, nullsFirst: false })
      .then(({ data }) => {
        setMarkets(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this market? This also deletes all sign-ups.")) return;
    await supabase.from("cms_markets").delete().eq("id", id);
    setMarkets((prev) => prev.filter((m) => m.id !== id));
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Markets</h1>
          <p className="text-sm text-slate-500 mt-1">
            {markets.length} market{markets.length !== 1 ? "s" : ""} — manages <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/markets</code> sign-ups
          </p>
        </div>
        <Link
          href="/admin/markets/new"
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          + New Market
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : markets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No markets yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Location</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Sign-ups</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market) => {
                const isPast = market.event_date && new Date(market.event_date + "T00:00:00") < new Date(new Date().toDateString());
                return (
                  <tr
                    key={market.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${isPast ? "opacity-50" : ""}`}
                    onClick={() => router.push(`/admin/markets/${market.id}`)}
                  >
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{formatDate(market.event_date)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{market.title}</td>
                    <td className="px-4 py-3 text-slate-500">{market.location ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      {market.signup_enabled ? (
                        <Link
                          href={`/admin/markets/${market.id}/signups`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          View
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-xs">Off</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          market.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {market.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(market.id); }}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { FoodTruck } from "@/lib/cms";

export default function AdminTrucksList() {
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("cms_food_trucks")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setTrucks(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this food truck?")) return;
    await supabase.from("cms_food_trucks").delete().eq("id", id);
    setTrucks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Food Trucks</h1>
          <p className="text-sm text-slate-500 mt-1">{trucks.length} truck{trucks.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/trucks/new"
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          + New Truck
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : trucks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No food trucks yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Cuisine</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Blurb</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Order</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map((truck) => (
                <tr
                  key={truck.id}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => router.push(`/admin/trucks/${truck.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{truck.name}</td>
                  <td className="px-4 py-3 text-slate-500">{truck.cuisine}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{truck.blurb ?? "—"}</td>
                  <td className="px-4 py-3 text-center text-slate-500">{truck.sort_order}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        truck.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {truck.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(truck.id); }}
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

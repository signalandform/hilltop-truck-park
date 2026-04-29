"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type {
  CmsCrmCustomer,
  CmsCrmInteraction,
  CmsCrmSourceType,
} from "@/lib/cms";

const SOURCE_LABELS: Record<CmsCrmSourceType, string> = {
  contact_form: "Contact",
  vendor_request: "Vendor",
  party_booking: "Party",
  event_signup: "Event",
  market_signup: "Market",
};

const SOURCE_BADGE_CLASSES: Record<CmsCrmSourceType, string> = {
  contact_form: "bg-blue-50 text-blue-700 border-blue-100",
  vendor_request: "bg-amber-50 text-amber-700 border-amber-100",
  party_booking: "bg-pink-50 text-pink-700 border-pink-100",
  event_signup: "bg-violet-50 text-violet-700 border-violet-100",
  market_signup: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFieldLabel(key: string) {
  return key
    .replace(/_id$|_slug$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMetadataValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function metadataRows(metadata: Record<string, unknown>) {
  const hiddenKeys = new Set([
    "event_id",
    "event_slug",
    "market_id",
    "market_slug",
    "ticket_type_id",
  ]);

  return Object.entries(metadata)
    .filter(([key]) => !hiddenKeys.has(key))
    .map(([key, value]) => [formatFieldLabel(key), formatMetadataValue(value)] as const)
    .filter((row): row is readonly [string, string] => row[1] !== null);
}

function sourceLabel(sourceType: CmsCrmSourceType) {
  return SOURCE_LABELS[sourceType] ?? sourceType;
}

function SourceBadge({ sourceType }: { sourceType: CmsCrmSourceType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        SOURCE_BADGE_CLASSES[sourceType] ?? "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      {sourceLabel(sourceType)}
    </span>
  );
}

export default function AdminCrmPage() {
  const [customers, setCustomers] = useState<CmsCrmCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<CmsCrmInteraction[]>([]);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [recentInteractions, setRecentInteractions] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      setError("");

      const recentCutoff = new Date();
      recentCutoff.setDate(recentCutoff.getDate() - 30);

      const [customersRes, interactionsRes, recentRes] = await Promise.all([
        supabase
          .from("cms_crm_customers")
          .select("*")
          .order("last_seen_at", { ascending: false }),
        supabase
          .from("cms_crm_interactions")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("cms_crm_interactions")
          .select("id", { count: "exact", head: true })
          .gte("occurred_at", recentCutoff.toISOString()),
      ]);

      if (customersRes.error) {
        setError(customersRes.error.message);
        setLoading(false);
        return;
      }

      if (interactionsRes.error || recentRes.error) {
        setError(interactionsRes.error?.message ?? recentRes.error?.message ?? "Unable to load CRM stats.");
        setLoading(false);
        return;
      }

      const loadedCustomers = (customersRes.data ?? []) as CmsCrmCustomer[];
      setCustomers(loadedCustomers);
      setSelectedCustomerId((current) => current ?? loadedCustomers[0]?.id ?? null);
      setTotalInteractions(interactionsRes.count ?? 0);
      setRecentInteractions(recentRes.count ?? 0);
      setLoading(false);
    }

    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.email_normalized,
        customer.phone,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [customers, search]);

  useEffect(() => {
    if (filteredCustomers.length === 0) {
      setSelectedCustomerId(null);
      return;
    }

    if (!selectedCustomerId || !filteredCustomers.some((customer) => customer.id === selectedCustomerId)) {
      setSelectedCustomerId(filteredCustomers[0].id);
    }
  }, [filteredCustomers, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomerId) {
      setInteractions([]);
      return;
    }

    let active = true;
    setInteractionsLoading(true);

    supabase
      .from("cms_crm_interactions")
      .select("*")
      .eq("customer_id", selectedCustomerId)
      .order("occurred_at", { ascending: false })
      .then(({ data, error: interactionsError }) => {
        if (!active) return;
        if (interactionsError) {
          setError(interactionsError.message);
          setInteractions([]);
        } else {
          setInteractions((data ?? []) as CmsCrmInteraction[]);
        }
        setInteractionsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCustomerId]);

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">CRM</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track customers by email across contact forms, vendor requests, party bookings, events, and markets.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Customers
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {customers.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Interactions
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {totalInteractions}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Last 30 Days
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {recentInteractions}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_26rem] gap-6">
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Customers</h2>
                <p className="text-xs text-slate-500">
                  {filteredCustomers.length} of {customers.length} customer
                  {customers.length !== 1 ? "s" : ""}
                </p>
              </div>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, or phone"
                className="w-full md:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No CRM customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Phone</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Sources</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-600">Touches</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">First Seen</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => {
                    const active = customer.id === selectedCustomerId;

                    return (
                      <tr
                        key={customer.id}
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                          active ? "bg-blue-50/60" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {customer.name ?? "Unknown customer"}
                          </div>
                          <a
                            href={`mailto:${customer.email}`}
                            onClick={(event) => event.stopPropagation()}
                            className="text-blue-600 hover:underline"
                          >
                            {customer.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {customer.phone ?? "None"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {customer.source_types.map((sourceType) => (
                              <SourceBadge key={sourceType} sourceType={sourceType} />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-700">
                          {customer.interaction_count}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDate(customer.first_seen_at)}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDate(customer.last_seen_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="bg-white rounded-xl border border-slate-200 overflow-hidden h-fit">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="font-semibold text-slate-900">Timeline</h2>
            {selectedCustomer && (
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCustomer.name ?? selectedCustomer.email}
              </p>
            )}
          </div>

          {!selectedCustomer ? (
            <div className="p-6 text-sm text-slate-500">
              Select a customer to view their engagement history.
            </div>
          ) : interactionsLoading ? (
            <div className="p-6 text-sm text-slate-500">Loading timeline...</div>
          ) : interactions.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No interactions recorded for this customer.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {interactions.map((interaction) => {
                const rows = metadataRows(interaction.metadata);

                return (
                  <article key={interaction.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <SourceBadge sourceType={interaction.source_type} />
                        <h3 className="font-medium text-slate-900 mt-2">
                          {interaction.summary}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDateTime(interaction.occurred_at)}
                      </div>
                    </div>

                    {rows.length > 0 && (
                      <dl className="mt-3 space-y-2">
                        {rows.map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-xs text-slate-500">{label}</dt>
                            <dd className="text-sm text-slate-800 whitespace-pre-wrap">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderForm from "@/components/PlaceholderForm";

export const metadata: Metadata = {
  title: "Crawfish Pre-Orders | Hilltop Truck Park",
  description: "Pre-order crawfish for pickup at Hilltop Truck Park in Northlake, TX.",
};

export default function CrawfishPreOrdersPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Crawfish Pre-Orders
        </h1>
        <div className="space-y-6 text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          <p>
            Pre-order crawfish for pickup at Hilltop Truck Park. Check our{" "}
            <Link href="/events" className="text-htp-red hover:underline font-medium">
              Events
            </Link>{" "}
            page for upcoming crawfish dates.
          </p>
          <p>
            Pre-order form and checkout coming soon. For now, please contact us at{" "}
            <a href="mailto:info@hilltoptruckpark.com" className="text-htp-red hover:underline font-medium">
              info@hilltoptruckpark.com
            </a>{" "}
            for crawfish pre-orders.
          </p>
        </div>
        <PlaceholderForm
          title="Pre-Order Form (Coming Soon)"
          message="Crawfish pre-order and checkout will be available soon."
          fields={[
            { name: "name", type: "text", label: "Name" },
            { name: "email", type: "email", label: "Email" },
            { name: "phone", type: "tel", label: "Phone" },
            { name: "quantity", type: "text", label: "Quantity" },
            { name: "date", type: "text", label: "Pickup Date" },
          ]}
        />
      </div>
    </section>
  );
}

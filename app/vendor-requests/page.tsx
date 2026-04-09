import type { Metadata } from "next";
import PlaceholderForm from "@/components/PlaceholderForm";

export const metadata: Metadata = {
  title: "Food Truck Application | Hilltop Truck Park",
  description: "Apply to become a food truck vendor at Hilltop Truck Park in Northlake, TX.",
};

export default function VendorRequestsPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Hilltop Vendor Space Request
        </h1>
        <p className="text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          Hilltop is a full service facility with bathrooms, seating, and full bar on site. We are
          family and pet friendly, and we love working with you. We have water, dump, grease
          disposal, and power on site. Propane and ice are available for purchase. If you would like
          to book space, please fill out the form below.
        </p>

        <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 mb-12 max-w-2xl mx-auto text-left">
          <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-4">
            Note the following before proceeding
          </h2>
          <ul className="space-y-3 text-htp-ink leading-[1.55] text-sm list-disc list-inside">
            <li>
              <strong>Permits:</strong> You must have a valid permit from the TX Department of
              Health. You must have a valid fire inspection permit from the Denton County Fire
              Marshall. Hilltop is in Unincorporated Denton County so no additional permits are
              required.
            </li>
            <li>
              You must be able to pull, park, and unload your equipment effectively and efficiently
              without assistance.
            </li>
            <li>
              Your equipment must be visibly pleasing, clean, and in good working order.
            </li>
            <li>
              You must have cords for power that are in good condition and sufficient for your
              rig&apos;s needs. We offer 20, 30, and 50 amp power.
            </li>
            <li>
              On your scheduled date, you must arrive in a timeframe sufficient to set up and be
              open at the time published on your schedule.
            </li>
            <li>
              <strong>Cancellation Policy:</strong> Cancellations in less than 72 hours will be
              charged for the full day. (Emergency situations can be taken into consideration.) No
              calls/no shows will not be refunded and will not be rescheduled.
            </li>
          </ul>
        </div>

        <PlaceholderForm
          title="Hilltop Vendor Space Request (Coming Soon)"
          message="This form is not yet active. Please email info@hilltoptruckpark.com with your inquiry."
          fields={[
            { name: "name", type: "text", label: "Name" },
            { name: "phone", type: "tel", label: "Phone" },
            { name: "foodTruck", type: "text", label: "Food Truck Name" },
            { name: "timeInBusiness", type: "text", label: "Time in Business" },
            { name: "email", type: "email", label: "Email" },
            { name: "website", type: "text", label: "Website or Social Media Page" },
            { name: "rigSize", type: "text", label: "Rig Length and Width" },
            { name: "datesRequested", type: "text", label: "Dates & Times Requested" },
            { name: "foodType", type: "text", label: "Type of Food Served" },
            { name: "bookedBefore", type: "text", label: "Have you booked with us before?" },
            { name: "healthPermit", type: "text", label: "Do you have a valid TX Health Permit?" },
            {
              name: "inspectRig",
              type: "checkbox",
              label: "I will allow Hilltop to inspect my rig upon arrival for safety and cleanliness.",
            },
            { name: "menu", type: "text", label: "My Menu (Upload coming soon)" },
            {
              name: "fireInspection",
              type: "text",
              label: "Denton Cnty Fire Inspection (Upload coming soon)",
            },
            { name: "healthPermitUpload", type: "text", label: "My TX Health Permit (Upload coming soon)" },
            {
              name: "truckPhoto",
              type: "text",
              label: "Picture of Truck/Trailer (Upload coming soon)",
            },
          ]}
        />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import PlaceholderForm from "@/components/PlaceholderForm";

export const metadata: Metadata = {
  title: "Contact Us | Hilltop Truck Park",
  description: "Get in touch with Hilltop Truck Park in Northlake, TX.",
};

export default function ContactUsPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Contact Us
        </h1>
        <div className="space-y-8 text-htp-ink leading-[1.55] mb-12">
          <p className="text-lg max-w-2xl mx-auto">
            Have questions? Reach out to us at Hilltop Truck Park. We&apos;d love to hear from you.
          </p>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-6 max-w-xl mx-auto">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Address
            </h2>
            <p>8150 Thompson Rd, Northlake, TX 76247</p>
          </div>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-6 max-w-xl mx-auto">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Email
            </h2>
            <a
              href="mailto:info@hilltoptruckpark.com"
              className="text-htp-red hover:underline font-medium"
            >
              info@hilltoptruckpark.com
            </a>
          </div>
        </div>
        <PlaceholderForm
          title="Contact Form (Coming Soon)"
          message="This form is not yet active. Please email us directly at info@hilltoptruckpark.com for now."
        />
      </div>
    </section>
  );
}

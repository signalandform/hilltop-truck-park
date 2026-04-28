import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "@/components/SocialLinks";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/markets", label: "Markets" },
  { href: "/our-food-trucks", label: "Our Food Trucks" },
  { href: "/book-your-party", label: "Book Your Party!" },
  { href: "/photo-fun", label: "Photo Fun!" },
  { href: "/vendor-requests", label: "Vendor Requests" },
  { href: "/contact-us", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t-4 border-htp-red bg-htp-navy-footer text-htp-cream shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/images/IMG_0935.png"
                alt="Hilltop Truck Park"
                width={168}
                height={48}
                className="h-12 w-auto opacity-95"
              />
            </Link>
            <p className="text-htp-cream/90 text-sm">
              8150 Thompson Rd, Northlake, TX 76247
              <br />
              <a href="mailto:info@hilltoptruckpark.com" className="text-htp-red hover:underline">
                info@hilltoptruckpark.com
              </a>
              <br />
              <a href="mailto:jack@signalandformllc.com" className="text-htp-red hover:underline">
                jack@signalandformllc.com
              </a>
            </p>
            <SocialLinks
              className="mt-5"
              label="Hilltop Truck Park social links"
              variant="footer"
            />
          </div>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-htp-cream/90 transition-colors hover:text-htp-red"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

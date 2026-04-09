import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/market-sign-ups", label: "Market Sign Ups" },
  { href: "/our-food-trucks", label: "Our Food Trucks" },
  { href: "/online-store", label: "Online Store" },
  { href: "/crawfish-pre-orders", label: "Crawfish Pre-orders" },
  { href: "/photo-fun", label: "Photo Fun!" },
  { href: "/vendor-requests", label: "Vendor Requests" },
  { href: "/contact-us", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-htp-navy border-t border-htp-navy/80">
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
            <p className="text-white/90 text-sm">
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
          </div>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/90 hover:text-htp-red transition-colors"
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

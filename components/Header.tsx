"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-htp-navy border-b border-htp-navy/80">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/IMG_0935.png"
              alt="Hilltop Truck Park"
              width={200}
              height={56}
              className="h-14 w-auto"
              priority
            />
          </Link>
          <button
            type="button"
            className="md:hidden p-2 text-htp-bg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <nav
            className={`${mobileMenuOpen ? "block" : "hidden"} md:flex absolute md:relative top-[88px] md:top-0 left-0 right-0 md:left-auto md:right-auto bg-htp-navy md:bg-transparent border-b md:border-b-0 border-htp-navy/80 md:border-0 py-4 md:py-0 px-4 md:px-0 z-10 max-h-[70vh] md:max-h-none overflow-y-auto md:overflow-visible`}
            aria-label="Main navigation"
          >
            <div className="flex flex-col md:flex-row md:items-center md:flex-wrap gap-4 md:gap-6">
              {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-white border-b-2 border-htp-red pb-1"
                      : "text-white hover:text-htp-red"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

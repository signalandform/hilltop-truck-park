import type { SVGProps } from "react";

const socialLinks = [
  {
    href: "https://www.facebook.com/hilltoptruckpark/",
    label: "Facebook",
    Icon: FacebookIcon,
  },
  {
    href: "https://www.instagram.com/hilltoptruckpark/",
    label: "Instagram",
    Icon: InstagramIcon,
  },
];

type SocialLinksVariant = "light" | "dark" | "footer";

type SocialLinksProps = {
  className?: string;
  label?: string;
  variant?: SocialLinksVariant;
};

const variantClasses: Record<SocialLinksVariant, string> = {
  light:
    "border-white/45 bg-white/10 text-white hover:border-white hover:bg-white/20 focus-visible:outline-white",
  dark:
    "border-htp-line bg-htp-cream text-htp-navy hover:border-htp-red hover:bg-htp-red hover:text-htp-bg focus-visible:outline-htp-red",
  footer:
    "border-htp-cream/25 bg-htp-cream/5 text-htp-cream hover:border-htp-red hover:bg-htp-red hover:text-htp-bg focus-visible:outline-htp-red",
};

export function SocialLinks({
  className = "",
  label = "Social links",
  variant = "dark",
}: SocialLinksProps) {
  return (
    <nav className={className} aria-label={label}>
      <div className="flex items-center justify-center gap-3">
        {socialLinks.map(({ href, label, Icon }) => (
          <a
            key={href}
            href={href}
            aria-label={`Visit Hilltop Truck Park on ${label}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-px hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:hover:translate-y-0 motion-reduce:transition-colors ${variantClasses[variant]}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </nav>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.04 3.69 9.22 8.5 9.98v-7.06H7.97v-2.92h2.53V9.83c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.77l-.44 2.92h-2.33v7.06A10.01 10.01 0 0 0 22 12.06Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect width="16" height="16" x="4" y="4" rx="4" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="2" />
      <path
        d="M16.75 7.25h.01"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

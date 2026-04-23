import type { Metadata } from "next";
import { Bebas_Neue, Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-oswald",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hilltop Truck Park | Food Truck Court | Northlake, TX",
  description:
    "Hilltop Truck Park is a food truck court in Northlake, TX. Enjoy great food, events, and community at 8150 Thompson Rd.",
  metadataBase: new URL("https://hilltoptruckpark.signalandform.net"),
  icons: {
    icon: "/images/IMG_0935.png",
  },
  openGraph: {
    title: "Hilltop Truck Park | Food Truck Court | Northlake, TX",
    description:
      "Hilltop Truck Park is a food truck court in Northlake, TX. Enjoy great food, events, and community.",
    url: "https://hilltoptruckpark.signalandform.net",
    siteName: "Hilltop Truck Park",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} ${bebas.variable} font-sans antialiased bg-htp-bg text-htp-ink`}
      >
        {children}
      </body>
    </html>
  );
}

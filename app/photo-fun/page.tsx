import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Photo Fun! | Hilltop Truck Park",
  description: "Foam parties, photo ops, and family fun at Hilltop Truck Park in Northlake, TX.",
};

const galleryImages = [
  "/images/static.wixstatic.com_media_51d5cc_dfd6534550a14e14af0cc44b5a2c7825_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_55a1e364cb02496c9d7b717103d8fa2a_mv2.jpg",
  "/images/static.wixstatic.com_media_51d5cc_6c4aa4a5816f4d2b9443a5ca4d394941_mv2.jpg",
  "/images/static.wixstatic.com_media_51d5cc_90c1566be8eb48ee98a50bf7c0c6e36f_mv2.jpg",
  "/images/static.wixstatic.com_media_51d5cc_0fe74e97e63245a58b501cb976d23894_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_a57cad5558424ad7ac95bad8f9a02968_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_45fddf0b4cbf4639abd503211c76a360_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_c1576ea2500c4ba2bdb5c90e0cc4c67c_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_effc9fd85cf1450a973a2700c3ba7ba7_mv2.jpg",
  "/images/static.wixstatic.com_media_51d5cc_f43326b088324a08b15ab0289b014a2e_mv2.jpg",
  "/images/static.wixstatic.com_media_cdd0d9_9032e3cdea0c4055b68871f1bcda41d2_mv2.jpg",
  "/images/static.wixstatic.com_media_cdd0d9_926ec8482640468dbdd30259190d88a4_mv2.jpg",
  "/images/static.wixstatic.com_media_cdd0d9_be5c782bd8ea42d9aaf0ba6bb32385b6_mv2.png",
  "/images/static.wixstatic.com_media_cdd0d9_bf9b358fcd184e2b9e5cd41b4772dedc_mv2.png",
  "/images/static.wixstatic.com_media_cdd0d9_c89dd8e20598456eb293768fae59d202_mv2.jpg",
  "/images/static.wixstatic.com_media_cdd0d9_ce545533959542658498845b711f2478_mv2.png",
  "/images/static.wixstatic.com_media_cdd0d9_d7e7de3facba4e5da4e0ff0c20da72ef_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_193d08261d2a469eadaaa401d401fd18_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_6f4e8398e9464dd2a8ad6ce0175cda70_mv2.png",
  "/images/static.wixstatic.com_media_51d5cc_d3cd933fb5f24346801aefcc5cbcaaf8_mv2.jpg",
];

export default function PhotoFunPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Photo Fun!
        </h1>
        <div className="space-y-8 text-htp-ink leading-[1.55] mb-12">
          <p className="text-lg max-w-2xl mx-auto">
            Hilltop Truck Park is the perfect spot for family photos, group shots, and making
            memories. Enjoy our outdoor setup, colorful murals, and seasonal activities.
          </p>
          <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-2xl mx-auto text-left">
            <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
              Foam Parties
            </h2>
            <p>
              Foam parties are held weekly during the summer! Check our{" "}
              <Link href="/events" className="text-htp-red hover:underline font-medium">
                Events
              </Link>{" "}
              calendar for dates and times.
            </p>
          </div>
          <p>
            Bring the family, grab some food from our trucks, and capture the fun at Hilltop Truck
            Park.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 auto-rows-[120px]">
          {galleryImages.map((src, i) => (
            <div
              key={i}
              className={`relative rounded-card overflow-hidden ${
                (i === 0 || i === 5 || i === 10) ? "col-span-2 row-span-2" : ""
              }`}
            >
              <Image
                src={src}
                alt={`Hilltop Truck Park photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Hilltop Truck Park",
  description: "News, updates, and announcements from Hilltop Truck Park in Northlake, TX.",
};

const posts = [
  {
    slug: "2025-up-coming",
    title: "2025 Up & Coming!",
    excerpt:
      "A peek into what to expect for 2025 at Hilltop Truck Park — infrared heaters, new lighting, enclosures, and so many events.",
    date: "2025-01-17",
  },
];

export default function BlogPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-8">
          Blog
        </h1>
        <p className="text-htp-ink leading-[1.55] mb-12 max-w-2xl mx-auto">
          News, updates, and announcements from Hilltop Truck Park.
        </p>
        <div className="space-y-8 max-w-2xl mx-auto text-left">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-htp-line pb-8">
              <h2 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-htp-red transition-colors">
                  {post.title}
                </Link>
              </h2>
              <time
                dateTime={post.date}
                className="text-sm text-htp-ink/80 block mb-4"
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <p className="text-htp-ink leading-[1.55]">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block mt-4 text-htp-red hover:underline font-medium"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

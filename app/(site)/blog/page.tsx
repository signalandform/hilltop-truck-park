import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts, CMS_REVALIDATE } from "@/lib/cms";

export const revalidate = CMS_REVALIDATE;

export const metadata: Metadata = {
  title: "Blog | Hilltop Truck Park",
  description: "News, updates, and announcements from Hilltop Truck Park in Northlake, TX.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

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
              {post.published_at && (
                <time
                  dateTime={post.published_at}
                  className="text-sm text-htp-ink/80 block mb-4"
                >
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {post.excerpt && (
                <p className="text-htp-ink leading-[1.55]">{post.excerpt}</p>
              )}
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

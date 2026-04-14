import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogSlugs, CMS_REVALIDATE } from "@/lib/cms";

export const revalidate = CMS_REVALIDATE;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog | Hilltop Truck Park" };
  return {
    title: `${post.title} | Hilltop Truck Park Blog`,
    description: post.excerpt ?? `Read "${post.title}" on the Hilltop Truck Park blog.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <section className="py-24 px-4">
      <div className="max-w-content mx-auto text-center">
        <Link
          href="/blog"
          className="text-htp-red hover:underline text-sm mb-8 inline-block font-medium"
        >
          ← Back to Blog
        </Link>
        <article className="max-w-2xl mx-auto text-left">
          <h1 className="font-display text-htp-h1 md:text-5xl text-htp-navy uppercase tracking-[0.04em] mb-4">
            {post.title}
          </h1>
          <div className="flex gap-4 text-sm text-htp-ink/80 mb-8">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.author && <span>by {post.author}</span>}
          </div>
          <div
            className="text-htp-ink leading-[1.55]"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        </article>
      </div>
    </section>
  );
}

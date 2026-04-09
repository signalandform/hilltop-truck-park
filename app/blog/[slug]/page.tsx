import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const posts: Record<
  string,
  { title: string; date: string; author?: string; content: React.ReactNode }
> = {
  "2025-up-coming": {
    title: "2025 Up & Coming!",
    date: "2025-01-17",
    author: "Rebecca Williams",
    content: (
      <>
        <p className="mb-6 text-htp-ink leading-[1.55]">
          Hello friends and welcome to our first blog post! To kick off our new page, we thought a
          peek into what to expect for 2025 would be a great place to start.
        </p>
        <p className="mb-4 text-htp-ink leading-[1.55]">Here are the highlights:</p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-htp-ink leading-[1.55]">
          <li>Mounted, infrared heaters on both sides of the seating area</li>
          <li>Adjustable, wrap-around enclosures on both sides of the seating area</li>
          <li>New overhead lighting on both sides of the seating area</li>
          <li>Jellyfish lighting around the building to add ambiance and a cozy feel</li>
          <li>EVENTS! So many events coming in 2025</li>
        </ul>
        <p className="text-htp-ink leading-[1.55]">
          We&apos;re excited for the year ahead and can&apos;t wait to share it with you. Stay tuned
          for more updates!
        </p>
      </>
    ),
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Blog | Hilltop Truck Park" };
  return {
    title: `${post.title} | Hilltop Truck Park Blog`,
    description: `Read "${post.title}" on the Hilltop Truck Park blog.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];
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
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.author && <span>by {post.author}</span>}
          </div>
          <div className="text-htp-ink leading-[1.55]">
            {post.content}
          </div>
        </article>
      </div>
    </section>
  );
}

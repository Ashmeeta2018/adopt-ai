import Link from 'next/link';

import type { PostSummary } from '@/lib/blog';
import { Eyebrow, Hairline } from '@adopt-ai/ui-web';

import { PostMeta } from './PostMeta';

interface RelatedPostsProps {
  posts: PostSummary[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <aside>
      <Eyebrow className="mb-7">More field notes</Eyebrow>
      <div className="flex flex-col">
        {posts.map((post, i) => (
          <div key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block py-6">
              <PostMeta
                date={post.date}
                category={post.category}
                readMinutes={post.readMinutes}
                className="mb-2"
              />
              <h3
                className="font-display text-[22px] leading-snug tracking-[-0.02em]
                           group-hover:text-accent transition-colors duration-150"
              >
                {post.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.55] text-ink/60 line-clamp-2">
                {post.dek}
              </p>
            </Link>
            {i < posts.length - 1 && <Hairline />}
          </div>
        ))}
      </div>
    </aside>
  );
}

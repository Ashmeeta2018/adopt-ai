import { Eyebrow, Hairline } from '@adopt-ai/ui-web';
import Link from 'next/link';

import { PostMeta } from './PostMeta';

import type { PostSummary } from '@/lib/blog';

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
              <h3 className="font-display group-hover:text-accent text-[22px] leading-snug tracking-[-0.02em] transition-colors duration-150">
                {post.title}
              </h3>
              <p className="text-ink/60 mt-2 line-clamp-2 text-[14.5px] leading-[1.55]">
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

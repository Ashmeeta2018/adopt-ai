import { Button, EmberText, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav current={null} />
      <section className="px-14 py-40 text-center">
        <h1
          className="font-display"
          style={{ fontSize: 96, letterSpacing: '-0.05em', lineHeight: 0.98 }}
        >
          <EmberText>Lost the trail.</EmberText>
        </h1>
        <p className="mx-auto mt-8 max-w-[460px] text-[17px] leading-[1.55] text-ink/65">
          The page you&rsquo;re after either moved, never existed, or is still on the way.
          Try the home page.
        </p>
        <div className="mt-10">
          <Link href="/">
            <Button variant="primary">Take me home</Button>
          </Link>
        </div>
      </section>
      <SiteFooter dark={false} />
    </main>
  );
}

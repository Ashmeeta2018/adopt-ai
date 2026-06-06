import { EmberText, Eyebrow, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a 30-minute working session with Adopt AI.',
};

export default function ContactPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav current={null} />
      <section className="px-14 py-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Eyebrow className="mb-5">Talk to us</Eyebrow>
            <h1
              className="font-display"
              style={{ fontSize: 80, letterSpacing: '-0.04em', lineHeight: 0.98 }}
            >
              Tell us about the workflow <EmberText>eating someone&rsquo;s day.</EmberText>
            </h1>
            <p className="mt-8 max-w-[480px] text-[19px] leading-[1.55] text-ink/65">
              A 30-minute call, no deck. If we can&rsquo;t show you the math on how it pays back,
              we won&rsquo;t take the project.
            </p>

            <div className="mt-12 space-y-3 font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/55">
              <div>hello@adoptai.com</div>
              <div>+1 (555) 382-3830</div>
              <div>500 Enterprise Way, Suite 100 · Orlando, FL 32801</div>
              <div>Press · press@adoptai.com</div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
      <SiteFooter dark={false} />
    </main>
  );
}

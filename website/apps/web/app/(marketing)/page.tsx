import { SiteFooter, SiteNav } from '@adopt-ai/ui-web';

import { Approach } from '@/components/home/Approach';
import { CaseStudyHighlight } from '@/components/home/CaseStudyHighlight';
import { Cta } from '@/components/home/Cta';
import { Faq } from '@/components/home/Faq';
import { HeroCinematic } from '@/components/home/HeroCinematic';
import { ServicesBento } from '@/components/home/ServicesBento';
import { SocialProofStrip } from '@/components/home/SocialProofStrip';

export default function HomePage() {
  return (
    <main className="relative bg-void text-cream">
      <div className="absolute inset-0 grid-bg-dark opacity-50" aria-hidden />
      <SiteNav dark current="home" sticky={false} />
      <HeroCinematic />
      <SocialProofStrip />
      <ServicesBento />
      <CaseStudyHighlight />
      <Approach />
      <Faq />
      <Cta />
      <SiteFooter dark />
    </main>
  );
}

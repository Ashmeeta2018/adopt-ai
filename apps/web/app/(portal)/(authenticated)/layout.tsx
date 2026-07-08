import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { PortalShell } from '@/components/portal/PortalShell';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Portal — Adopt AI',
  description: 'Monitor your agents, runs, and weekly reports.',
};

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/portal');
  }

  return <PortalShell>{children}</PortalShell>;
}

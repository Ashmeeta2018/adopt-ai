'use client';

import { Eyebrow, GlassCard } from '@adopt-ai/ui-web';

import { trpc } from '@/lib/trpc/client';

// ── Display helpers ────────────────────────────────────────────

/** "Ada Lovelace" → "AL",  "ada" → "A",  "" → "?" */
function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || '?'
  );
}

const PLAN_DISPLAY: Record<string, { label: string; billing: string }> = {
  spark: { label: 'Spark', billing: '$149 / mo operate' },
  lift:  { label: 'Lift',  billing: '$499 / mo operate' },
  scale: { label: 'Scale', billing: 'from $799 / mo operate' },
};

const ROLE_DISPLAY: Record<string, string> = {
  OWNER:  'Owner',
  ADMIN:  'Admin',
  MEMBER: 'Member',
};

// ── Page ──────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data, isLoading } = trpc.portal.getSettings.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  const plan     = PLAN_DISPLAY[data.organisation.plan] ?? { label: data.organisation.plan, billing: '—' };
  const roleText = ROLE_DISPLAY[data.role] ?? data.role;
  const avatar   = initials(data.user.name || data.user.email);

  const sections = [
    {
      title: 'Account',
      items: [
        { label: 'Email', value: data.user.email },
        { label: 'Name',  value: data.user.name || '—' },
        { label: 'Role',  value: roleText },
      ],
    },
    {
      title: 'Workspace',
      items: [
        { label: 'Organisation', value: data.organisation.name },
        { label: 'Plan',         value: plan.label },
        { label: 'Billing',      value: plan.billing },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help center',            value: 'help.adoptai.com' },
        { label: 'Status page',            value: 'status.adoptai.com' },
        { label: 'Contact your architect', value: 'hello@adoptai.com' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow tone="cream">Workspace configuration</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold text-cream">Settings</h1>
      </div>

      <div className="flex items-start gap-8">
        {/* Avatar — initials derived from the signed-in user's name */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/10">
            <span className="font-display text-2xl font-semibold text-cream">{avatar}</span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-cream/40">{roleText}</p>
        </div>

        {/* Sections */}
        <div className="flex-1 space-y-6">
          {sections.map((section) => (
            <GlassCard key={section.title} variant="dark">
              <div className="p-6">
                <Eyebrow tone="cream">{section.title}</Eyebrow>
                <div className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-cream/[0.08] pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-body text-sm text-cream/60">{item.label}</span>
                      <span className="font-mono text-sm text-cream">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

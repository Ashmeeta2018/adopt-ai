'use client';

import { requestMagicLinkInput } from '@adopt-ai/api-contract';
import { Button, GlassCard } from '@adopt-ai/ui-web';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { trpc } from '@/lib/trpc/client';

type FormValues = z.infer<typeof requestMagicLinkInput>;

export function PortalLoginCard() {
  const [sent, setSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Rate-limit guard — checked server-side before Auth.js sends the email.
  const rateLimitCheck = trpc.auth.requestMagicLink.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(requestMagicLinkInput),
    defaultValues: { callbackPath: '/portal/dashboard' },
  });

  const onSubmit = async (data: FormValues) => {
    setAuthError(null);
    // 1. Server-side rate-limit check (throws TRPCError on violation).
    await rateLimitCheck.mutateAsync(data);
    // 2. Trigger Auth.js magic-link email via Resend provider.
    const result = await signIn('resend', {
      email: data.email,
      callbackUrl: data.callbackPath ?? '/portal/dashboard',
      redirect: false,
    });
    if (result?.error) {
      setAuthError('Unable to send sign-in link. Please try again.');
      return;
    }
    setSent(true);
  };

  return (
    <GlassCard dark padding={36} className="w-full max-w-[460px]">
      <h1 className="font-display text-[40px] tracking-[-0.03em] text-cream">Welcome back.</h1>
      <p className="mt-3 text-[15px] text-cream/65">
        Sign in to monitor your agents, runs, and weekly reports.
      </p>

      {sent ? (
        <div className="mt-8 rounded-xl border border-hairline-dark bg-[rgba(248,244,238,0.04)] p-5">
          <p className="text-cream/85">
            Check your inbox — we just sent you a sign-in link.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3" noValidate>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-xl border border-hairline-dark bg-[rgba(248,244,238,0.04)] px-4 py-3 text-[15px] text-cream outline-none placeholder:text-cream/40 focus:border-accent"
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="text-[12px] text-error">{errors.email.message}</p>
          )}
          {authError && (
            <p className="text-[12px] text-error">{authError}</p>
          )}
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send me a sign-in link'}
          </Button>
        </form>
      )}

      <div className="my-6 flex items-center gap-3 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/40">
        <span className="h-px flex-1 bg-hairline-dark" />
        OR
        <span className="h-px flex-1 bg-hairline-dark" />
      </div>

      <Button
        variant="ghost"
        dark
        className="w-full"
        type="button"
        onClick={() => signIn('okta', { callbackUrl: '/portal/dashboard' })}
      >
        Continue with SSO (Okta) ↗
      </Button>

      <div className="mt-6 flex justify-between font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/45">
        <span>Forgot password?</span>
        <span>Request access</span>
      </div>
    </GlassCard>
  );
}

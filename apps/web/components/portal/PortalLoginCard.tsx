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
    try {
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
    } catch {
      setAuthError('Something went wrong. Please try again.');
    }
  };

  return (
    <GlassCard dark padding={36} className="w-full max-w-[460px]">
      <h1 className="font-display text-cream text-[40px] tracking-[-0.03em]">Welcome back.</h1>
      <p className="text-cream/65 mt-3 text-[15px]">
        Sign in to monitor your agents, runs, and weekly reports.
      </p>

      {sent ? (
        <div className="border-hairline-dark mt-8 rounded-xl border bg-[rgba(248,244,238,0.04)] p-5">
          <p className="text-cream/85">Check your inbox — we just sent you a sign-in link.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="mt-8 space-y-3"
          noValidate
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="border-hairline-dark text-cream placeholder:text-cream/40 focus:border-accent w-full rounded-xl border bg-[rgba(248,244,238,0.04)] px-4 py-3 text-[15px] outline-none"
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="text-error text-[12px]">{errors.email.message}</p>
          )}
          {authError && <p className="text-error text-[12px]">{authError}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send me a sign-in link'}
          </Button>
        </form>
      )}

      <div className="text-eyebrow text-cream/40 my-6 flex items-center gap-3 font-mono uppercase tracking-[0.18em]">
        <span className="bg-hairline-dark h-px flex-1" />
        OR
        <span className="bg-hairline-dark h-px flex-1" />
      </div>

      <Button
        variant="ghost"
        dark
        className="w-full"
        type="button"
        onClick={() => void signIn('okta', { callbackUrl: '/portal/dashboard' })}
      >
        Continue with SSO (Okta) ↗
      </Button>

      <div className="text-eyebrow text-cream/45 mt-6 flex justify-between font-mono uppercase tracking-[0.18em]">
        <span>Forgot password?</span>
        <span>Request access</span>
      </div>
    </GlassCard>
  );
}

'use client';

import { contactSubmitInput, type ContactSubmitInput } from '@adopt-ai/api-contract';
import { Button } from '@adopt-ai/ui-web';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { trpc } from '@/lib/trpc/client';

const engagementLabels: Record<ContactSubmitInput['engagement'], string> = {
  spark: 'Spark · $2,400',
  lift: 'Lift · $5,800',
  scale: 'Scale · from $12k',
  'not-sure': 'Not sure yet',
};

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const submit = trpc.marketing.contact.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactSubmitInput>({
    resolver: zodResolver(contactSubmitInput),
    defaultValues: { engagement: 'not-sure' },
  });

  const engagement = watch('engagement');

  if (submitted) {
    return (
      <div className="rounded-3xl border border-hairline bg-paper p-10">
        <h3 className="font-display text-[32px] leading-tight">Got it. We&rsquo;ll be in touch.</h3>
        <p className="mt-4 text-ink/65">
          We read every message ourselves. Expect a reply within one business day — usually
          sooner.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => submit.mutate(data))}
      className="rounded-3xl border border-hairline bg-paper p-8 shadow-card-light"
      noValidate
    >
      {/* Honeypot — bots fill this; humans never see it. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register('hp')}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Your name" error={errors.name?.message}>
          <input
            type="text"
            className="w-full rounded-xl border border-hairline bg-paper px-3.5 py-3 font-body text-[15px] text-ink transition-colors focus:border-accent focus:outline-none"
            autoComplete="name"
            {...register('name')}
          />
        </Field>
        <Field label="Work email" error={errors.email?.message}>
          <input
            type="email"
            className="w-full rounded-xl border border-hairline bg-paper px-3.5 py-3 font-body text-[15px] text-ink transition-colors focus:border-accent focus:outline-none"
            autoComplete="email"
            {...register('email')}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Company" error={errors.company?.message}>
          <input
            type="text"
            className="w-full rounded-xl border border-hairline bg-paper px-3.5 py-3 font-body text-[15px] text-ink transition-colors focus:border-accent focus:outline-none"
            autoComplete="organization"
            {...register('company')}
          />
        </Field>
      </div>

      <div className="mt-6">
        <div className="mb-2 font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/60">
          Engagement
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(engagementLabels) as ContactSubmitInput['engagement'][]).map((key) => {
            const active = engagement === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setValue('engagement', key)}
                className={
                  active
                    ? 'rounded-full bg-ink px-4 py-2 text-[13px] text-cream'
                    : 'rounded-full border border-hairline px-4 py-2 text-[13px]'
                }
              >
                {engagementLabels[key]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Field label="The workflow" error={errors.workflow?.message}>
          <textarea
            rows={5}
            className="w-full rounded-xl border border-hairline bg-paper px-3.5 py-3 font-body text-[15px] text-ink transition-colors focus:border-accent focus:outline-none min-h-[140px] resize-y"
            placeholder="What does someone on the team do today that you wish they didn't have to?"
            {...register('workflow')}
          />
        </Field>
      </div>

      {submit.isError && (
        <p className="mt-4 text-[13px] text-error" role="alert">
          {submit.error.message}
        </p>
      )}

      <div className="mt-7">
        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Request a working session'}
        </Button>
      </div>
      <p className="mt-5 text-center font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/50">
        We never share your email. Ever.
      </p>

    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/60">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-[12px] text-error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

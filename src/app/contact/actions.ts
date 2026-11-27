'use server';

import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { createSupabaseClient } from '@/lib/supabase/server';

export type ContactFormResult = { ok: true } | { ok: false; error: string };

const MAX_LENGTHS = { name: 200, email: 320, subject: 300, message: 10_000 };

export async function submitContactForm(formData: FormData): Promise<ContactFormResult> {
  return Sentry.withServerActionInstrumentation(
    'submitContactForm',
    {
      headers: await headers(),
      recordResponse: true,
    },
    async (): Promise<ContactFormResult> => {
      const name = String(formData.get('name') ?? '').trim();
      const email = String(formData.get('email') ?? '').trim();
      const subject = String(formData.get('subject') ?? '').trim();
      const message = String(formData.get('message') ?? '').trim();

      if (
        !name ||
        !email ||
        !subject ||
        !message ||
        name.length > MAX_LENGTHS.name ||
        email.length > MAX_LENGTHS.email ||
        subject.length > MAX_LENGTHS.subject ||
        message.length > MAX_LENGTHS.message ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return { ok: false, error: 'Please check the form fields and try again.' };
      }

      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from('contact_submissions')
        .insert({ name, email, subject, message });

      if (error) {
        Sentry.logger.error('Contact form insert failed', {
          table: 'contact_submissions',
          error: error.message,
        });
        return { ok: false, error: 'Something went wrong. Please try again later.' };
      }

      Sentry.metrics.count('contact_form.submitted', 1, {
        attributes: { status: 'success' },
      });
      Sentry.logger.info('Contact form submitted', {
        subject_length: subject.length,
        message_length: message.length,
      });

      return { ok: true };
    }
  );
}

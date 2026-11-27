'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (!code) {
      router.replace('/dashboard');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      if (exchangeError) {
        setError(exchangeError.message);
        return;
      }
      router.replace(next.startsWith('/') ? next : '/dashboard');
    });
  }, [router, searchParams]);

  if (error) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white p-6 text-black antialiased dark:bg-[#050505] dark:text-white">
        <div className="w-full max-w-sm rounded-3xl bg-gray-100 p-6 text-center dark:bg-[#1a1a1a]">
          <h1 className="text-lg font-medium">Authentication failed</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <Link href="/signup" className="mt-4 inline-block text-sm underline underline-offset-2">
            Back to sign up
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-white p-6 text-black antialiased dark:bg-[#050505] dark:text-white">
      <div className="w-full max-w-sm rounded-3xl bg-gray-100 p-6 text-center dark:bg-[#1a1a1a]">
        <h1 className="text-lg font-medium">Signing you in…</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Just a moment.</p>
      </div>
    </section>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-screen items-center justify-center bg-white p-6 text-black antialiased dark:bg-[#050505] dark:text-white">
          <div className="w-full max-w-sm rounded-3xl bg-gray-100 p-6 text-center dark:bg-[#1a1a1a]">
            <h1 className="text-lg font-medium">Signing you in…</h1>
          </div>
        </section>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}

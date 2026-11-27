'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type EmailVerificationProps = Readonly<{
  email: string;
  onBack: () => void;
}>;

const initialCodeFields = Array.from({ length: 6 }, (_, index) => ({
  id: `code-${index}`,
  value: '',
}));

export function EmailVerification({ email, onBack }: EmailVerificationProps) {
  const router = useRouter();
  const [code, setCode] = useState(initialCodeFields);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const codeValue = code.map((field) => field.value).join('');
  const codeComplete = codeValue.length === 6;

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    if (value && !/\d/.test(value)) return;

    setError(null);
    setResendNotice(null);
    const newCode = code.map((field, fieldIndex) =>
      fieldIndex === index ? { ...field, value } : field
    );
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(code[index + 1].id) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index].value && index > 0) {
      const prevInput = document.getElementById(code[index - 1].id) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleContinue = async () => {
    if (!codeComplete || isVerifying) return;
    setIsVerifying(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: codeValue,
      type: 'signup',
    });

    setIsVerifying(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    router.replace('/dashboard');
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    setError(null);
    setResendNotice(null);

    const supabase = getSupabaseBrowserClient();
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    setIsResending(false);
    if (resendError) {
      setError(resendError.message);
      return;
    }
    setResendNotice('A new code is on its way.');
  };

  return (
    <section className="h-screen overflow-hidden bg-white p-2 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white">
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-[340px]">
          <div className="rounded-3xl bg-gray-100 p-5 dark:bg-[#1a1a1a]">
            <button
              type="button"
              onClick={onBack}
              className="mb-3 text-xs underline underline-offset-2"
            >
              Back
            </button>
            <h1 className="mb-1.5 text-lg font-medium text-black dark:text-white">
              Enter your one-time password
            </h1>
            <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">
              We've sent a code to{' '}
              <span className="font-medium text-black dark:text-white">{email}</span>. Please enter
              it below.
            </p>

            <div className="mb-4">
              <div className="flex justify-center gap-1.5">
                {code.map((field, index) => (
                  <input
                    key={field.id}
                    id={field.id}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={field.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="size-10 rounded-lg border border-gray-300 bg-white px-2 text-center text-base font-medium text-black transition-all outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-white dark:focus:border-gray-400 dark:focus:ring-gray-700"
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="mb-3 text-center text-xs text-red-600 dark:text-red-400">{error}</p>
            )}
            {resendNotice && (
              <p className="mb-3 text-center text-xs text-emerald-600 dark:text-emerald-400">
                {resendNotice}
              </p>
            )}

            <button
              onClick={handleContinue}
              disabled={!codeComplete || isVerifying}
              className="flex h-9 w-full items-center justify-center rounded-lg bg-black text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {isVerifying ? 'Verifying…' : 'Continue'}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-xs text-gray-600 underline underline-offset-2 transition-colors hover:text-black disabled:opacity-50 dark:text-gray-400 dark:hover:text-white"
              >
                {isResending ? 'Sending…' : 'Having trouble? Resend code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

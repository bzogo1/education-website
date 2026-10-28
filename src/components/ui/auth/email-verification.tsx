import { useState } from 'react';

type EmailVerificationProps = Readonly<{
  email: string;
  onBack: () => void;
}>;

const initialCodeFields = Array.from({ length: 6 }, (_, index) => ({
  id: `code-${index}`,
  value: '',
}));

export function EmailVerification({ email, onBack }: EmailVerificationProps) {
  const [code, setCode] = useState(initialCodeFields);
  const [codeReady, setCodeReady] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = code.map((field, fieldIndex) =>
      fieldIndex === index ? { ...field, value } : field
    );
    setCode(newCode);
    setCodeReady(false);

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

  const handleContinue = () => {
    setCodeReady(code.map((field) => field.value).join('').length === 6);
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

            <button
              onClick={handleContinue}
              disabled={code.map((field) => field.value).join('').length !== 6}
              className="flex h-9 w-full items-center justify-center rounded-lg bg-black text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {codeReady ? 'Code entered' : 'Continue'}
            </button>

            <div className="mt-4 text-center">
              <button className="text-xs text-gray-600 underline underline-offset-2 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white">
                Having trouble? Resend code
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
}

export function EmailVerification({ email, onBack }: EmailVerificationProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleContinue = () => {
    const verificationCode = code.join("");
    if (verificationCode.length === 6) {
      console.log("Verification code:", verificationCode);
    }
  };

  return (
    <section className="h-screen bg-white p-2 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white overflow-hidden">
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-[340px]">
          <div className="rounded-3xl bg-gray-100 p-5 dark:bg-[#1a1a1a]">
            <h1 className="text-lg font-medium text-black dark:text-white mb-1.5">
              Enter your one-time password
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              We've sent a code to <span className="font-medium text-black dark:text-white">{email}</span>. Please enter it below.
            </p>

            <div className="mb-4">
              <div className="flex gap-1.5 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="size-10 rounded-lg border border-gray-300 bg-white px-2 text-center text-base font-medium text-black outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-white dark:focus:border-gray-400 dark:focus:ring-gray-700 transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={code.join("").length !== 6}
              className="flex h-9 w-full items-center justify-center rounded-lg bg-black text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Continue
            </button>

            <div className="mt-4 text-center">
              <button className="text-xs text-gray-600 underline underline-offset-2 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                Having trouble? Resend code
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

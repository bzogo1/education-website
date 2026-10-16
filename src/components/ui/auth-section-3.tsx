import { useState } from "react";
import type { ReactNode } from "react";
import { FlutedGlass } from "@paper-design/shaders-react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@ark-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { PasswordStrength, usePasswordStrength } from "@/components/interior/password-strength";
import { EmailVerification } from "@/components/ui/auth/email-verification";

const termsText = (
  <>
    By creating an account, you agree to our{" "}
    <a
      href="#"
      className="font-medium text-black/55 underline underline-offset-2 dark:text-white/55"
    >
      Terms of Service
    </a>{" "}
    and{" "}
    <a
      href="#"
      className="font-medium text-black/55 underline underline-offset-2 dark:text-white/55"
    >
      Privacy Policy
    </a>
  </>
);

export default function AuthSectionThree() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);

  const passwordStrength = usePasswordStrength(password);
  const isPasswordStrong = passwordStrength.score === passwordStrength.max && !passwordStrength.guessable;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = formData.firstName && formData.lastName && isEmailValid && isPasswordStrong && termsChecked;

  const handleSubmit = () => {
    if (isFormValid) {
      setShowEmailVerification(true);
    }
  };

  if (showEmailVerification) {
    return <EmailVerification email={formData.email} onBack={() => setShowEmailVerification(false)} />;
  }

  return (
    <section className="h-screen bg-white p-2 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white overflow-hidden">
      <div className="grid h-full gap-4 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Left Side - SignUp Form */}
        <div className="flex items-center justify-center rounded-md border border-black/10 bg-white px-4 py-6 dark:border-white/5 dark:bg-[#0a0a0c] lg:px-10 lg:py-8 xl:px-12">
          <div className="mx-auto w-full max-w-[400px]">
            <div>
              <h1 className="text-2xl font-medium tracking-tight sm:text-3xl text-black dark:text-white">
                Create an account
              </h1>
            </div>

            {/* Social Signup Buttons */}
            <div className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                className="flex h-10 w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <GoogleIcon />
                <span className="whitespace-nowrap">Sign up with Google</span>
              </button>
              <button
                type="button"
                className="flex h-10 w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <GithubIcon />
                <span className="whitespace-nowrap">Sign up with GitHub</span>
              </button>
            </div>

            <div className="my-3 flex items-center gap-3 text-xs font-medium text-black/40 dark:text-white/30">
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              or
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <form className="space-y-2.5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-2 sm:grid-cols-2">
                <InputField
                  label="First name"
                  value={formData.firstName}
                  placeholder="John"
                  type="text"
                  onChange={(value) => setFormData({ ...formData, firstName: value })}
                />
                <InputField
                  label="Last name"
                  value={formData.lastName}
                  placeholder="Doe"
                  type="text"
                  onChange={(value) => setFormData({ ...formData, lastName: value })}
                />
              </div>

              <InputField
                label="Email"
                value={formData.email}
                placeholder="email@example.com"
                type="email"
                onChange={(value) => setFormData({ ...formData, email: value })}
              />

              <div className="space-y-1 text-left w-full">
                <label className="text-[11px] font-semibold text-black/60 dark:text-white/60">
                  Password
                </label>
                <div className="relative flex h-9 items-center rounded-lg border border-black/15 bg-white px-3 dark:border-white/10 dark:bg-white/5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    spellCheck={false}
                    className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                </div>
                <PasswordStrength value={password} className="mt-2" compact />
              </div>

              <div className="space-y-1.5 pt-0.5 text-[10px] leading-3.5 text-black/45 dark:text-white/40">
                <CheckboxLine checked={newsletterChecked} onChange={setNewsletterChecked}>
                  I don't want to receive emails about Postdrips feature updates
                  and best practices.
                </CheckboxLine>
                <CheckboxLine checked={termsChecked} onChange={setTermsChecked}>{termsText}</CheckboxLine>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className="mt-3 flex h-9 w-full items-center justify-center rounded-lg border border-black/40 bg-black text-sm font-medium text-white transition-colors hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Marketing Testimonial and Mockup */}
        <div className="relative flex flex-col overflow-hidden rounded-md bg-linear-to-b from-black to-white p-4 text-white dark:to-[#050505] sm:p-6 lg:p-8">
          {/* Background Shader */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <FlutedGlass
              size={0.89}
              shape="lines"
              angle={0}
              distortionShape="prism"
              distortion={0.5}
              shift={0}
              blur={0}
              edges={0.25}
              stretch={0}
              scale={1.11}
              fit="cover"
              highlights={0.1}
              shadows={0.2}
              grainMixer={0.1}
              grainOverlay={0.1}
              colorBack="#00000000"
              colorHighlight="#FFFFFF"
              colorShadow="#000000"
              className="w-full h-full bg-transparent"
            />
          </div>

          <div className="relative z-10 h-full w-full flex flex-col justify-center">
            <div className="max-w-[350px]">
              <motion.div
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3"
              >
                <img
                  src="https://res.cloudinary.com/harshitproject/image/upload/v1746774430/member-five.png"
                  alt="Charlotte"
                  className="size-8 shrink-0 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <div className="font-semibold leading-tight text-white text-sm">
                    Charlotte
                  </div>
                  <div className="mt-0.5 text-[11px] text-white/60">
                    Design Engineer
                  </div>
                </div>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.8,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-5 text-xl font-light leading-tight tracking-[-0.035em] text-white/90 sm:text-2xl lg:text-[28px]"
              >
                "Every block had the restraint and polish we usually spend weeks
                refining."
              </motion.blockquote>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, y: 72, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 1,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-hidden rounded-xl border border-white/10 bg-black"
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3 py-2 select-none">
                  <div className="size-2 rounded-full bg-white/35" />
                  <div className="size-2 rounded-full bg-white/25" />
                  <div className="size-2 rounded-full bg-white/15" />
                  <span className="ml-3 text-[8px] font-mono tracking-wider text-white/40">
                    solaceui.com/dashboard
                  </span>
                </div>
                <img
                  src="https://res.cloudinary.com/harshitproject/image/upload/v1774017120/hero-light.png"
                  alt="SolaceUI Dashboard App Mockup"
                  className="h-auto w-full object-cover object-top opacity-95 [filter:invert(1)_hue-rotate(180deg)_brightness(0.68)_contrast(1.16)] dark:[filter:none]"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange?: (value: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1 text-left w-full">
      <label className="text-[11px] font-semibold text-black/60 dark:text-white/60">
        {label}
      </label>
      <div className="relative flex h-9 items-center rounded-lg border border-black/15 bg-white px-3 dark:border-white/10 dark:bg-white/5">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/30"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function CheckboxLine({ children, checked, onChange }: { children: ReactNode; checked?: boolean; onChange?: (checked: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className="relative mt-1 size-3.5 shrink-0">
        <Checkbox.Root className="size-full cursor-pointer" checked={checked} onCheckedChange={onChange}>
          <Checkbox.Control className="size-full bg-white border-2 border-gray-300 rounded data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-hover:border-gray-400 dark:bg-gray-900 dark:border-gray-600 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500 dark:data-hover:border-gray-400 transition-all duration-200 flex items-center justify-center">
            <Checkbox.Indicator>
              <CheckIcon className="w-3.5 h-3.5 text-white" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </span>
      <span>{children}</span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

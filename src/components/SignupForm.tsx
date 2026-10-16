"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

function FieldGroup({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  required,
  icon,
  showToggle,
  onToggle,
}: {
  label: string;
  placeholder: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon: React.ReactNode;
  showToggle?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/80">{label}</label>
      <div className="relative flex h-11 items-center rounded-xl border border-white/20 bg-white/5 px-3 focus-within:border-primaryColor focus-within:ring-1 focus-within:ring-primaryColor transition-colors duration-200">
        <span className="shrink-0 text-white/40">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 shrink-0 text-white/40 hover:text-white transition-colors"
            aria-label={showToggle ? "Hide password" : "Show password"}
          >
            {showToggle ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function CheckboxRow({
  checked,
  onChange,
  children,
  required = false,
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <span className="mt-[3px] shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          className="size-4 rounded border border-white/30 bg-transparent text-primaryColor focus:ring-1 focus:ring-primaryColor cursor-pointer"
        />
      </span>
      <span className="text-sm text-white/90 leading-relaxed">{children}</span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function GithubIcon({ width = 18, height = 18 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-1.332-1.456-1.011.109-.995.109-.995 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605 2.665-.3 5.466-1.332 5.466-1.332-1.456-1.011.109-.995.109-.995 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-1.332-1.456-1.011.109-.995.109-.995 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998 0 .395.21.692.825.57C20.565 21.797 24 17.3 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const isComplete =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    agreeTerms;

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden selection:bg-primaryColor/30">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/signup-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          decoding="async"
          loading="eager"
          aria-hidden="true"
        />
      </div>
      {/* Readability overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0b0b0b]/35 via-transparent to-[#050505]/80 pointer-events-none" />
      {/* Ambient glow behind the card */}
      <div className="absolute z-10 -inset-10 blur-[120px] bg-[#91c6ff]/20 opacity-30 pointer-events-none" />

      <main className="relative z-20 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] p-8 md:p-12 ring-1 ring-white/10">
            <span className="absolute inset-0 rounded-[2rem] border border-white/20/60 pointer-events-none" />

            <div className="mx-auto max-w-[24rem] text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Create account
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Join thousands of learners and start your educational journey
                today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldGroup
                  label="First name"
                  placeholder="First name"
                  name="firstName"
                  icon={<User className="size-4 shrink-0 text-white/30" />}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <FieldGroup
                  label="Last name"
                  placeholder="Last name"
                  name="lastName"
                  icon={<User className="size-4 shrink-0 text-white/30" />}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <FieldGroup
                label="Email"
                placeholder="you@example.com"
                type="email"
                name="email"
                icon={<Mail className="size-4 shrink-0 text-white/30" />}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <FieldGroup
                label="Password"
                placeholder="Create a password"
                type={showPassword ? "text" : "password"}
                name="password"
                icon={<Lock className="size-4 shrink-0 text-white/30" />}
                value={formData.password}
                onChange={handleChange}
                required
                showToggle
                onToggle={() => setShowPassword(!showPassword)}
              />

              <FieldGroup
                label="Confirm password"
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                icon={<Lock className="size-4 shrink-0 text-white/30" />}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                showToggle
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <div className="space-y-4 pt-1">
                <CheckboxRow
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                >
                  I agree to the{" "}
                  <a
                    href="/terms-of-service"
                    className="text-primaryColor font-medium underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-primaryColor font-medium underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </CheckboxRow>

                <CheckboxRow
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                >
                  Receive occasional marketing and update emails
                </CheckboxRow>
              </div>

              <button
                type="submit"
                disabled={!isComplete}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primaryColor text-black font-semibold text-sm py-3.5 transition-all duration-200 hover:bg-white hover:shadow-[0_0_24px_rgba(145,198,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create account
              </button>
            </form>

            <div className="mt-10 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
                <span className="mx-4 text-[10px] text-white/40 uppercase tracking-wider">
                  Or continue with
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                >
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                >
                  <GithubIcon width={18} height={18} />
                  <span>Sign in with GitHub</span>
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-white/70">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primaryColor font-medium underline underline-offset-2 hover:text-white transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

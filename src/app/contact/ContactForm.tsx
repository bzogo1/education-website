'use client';

import { useRef, useState, type FormEvent } from 'react';
import { submitContactForm } from './actions';

export default function ContactForm() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fading, setFading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.minHeight = `${wrapper.offsetHeight}px`;
    }
    setFading(true);

    const result = await submitContactForm(new FormData(e.currentTarget));
    setSending(false);

    if (!result.ok) {
      setError(result.error);
      setFading(false);
      return;
    }

    window.setTimeout(() => {
      setSent(true);
      requestAnimationFrame(() => setSuccessVisible(true));
    }, 300);
  };

  return (
    <div
      ref={wrapperRef}
      className="bg-bgDark3 rounded-3xl p-8 sm:p-10"
      id="contact-wrapper"
    >
      <form
        id="contact-form"
        onSubmit={handleSubmit}
        className={sent ? 'hidden' : undefined}
        style={{
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.3s ease' : undefined,
        }}
      >
        <div className="mb-6">
          <label htmlFor="name" className="text-primaryText mb-2 block font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            required
            autoComplete="off"
            className="form-input"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="text-primaryText mb-2 block font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            className="form-input"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="subject" className="text-primaryText mb-2 block font-medium">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="How can we help?"
            required
            autoComplete="off"
            className="form-input"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="message" className="text-primaryText mb-2 block font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us about your project..."
            required
            autoComplete="off"
            className="form-input resize-none"
          />
        </div>
        {error && (
          <p className="text-red-400 mb-4 text-sm" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="contained-button w-full py-3 text-lg disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Send Message'}
        </button>
      </form>
      <div
        id="contact-success"
        className={`flex-col items-center justify-center py-16 text-center transition-opacity duration-500 ${
          sent ? 'flex' : 'hidden'
        } ${sent && successVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-live="polite"
      >
        <div className="bg-primaryColor/20 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="rgb(99, 102, 241)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-primaryText mb-3 text-2xl font-bold">Message sent!</h3>
        <p className="text-secondaryText max-w-sm leading-relaxed">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    </div>
  );
}

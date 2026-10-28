'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { IconPlaceholder } from '@/components/icons/icon-placeholder';
import { X, Globe } from 'lucide-react';

type IconProps = { className?: string; size?: number | string };

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
    </svg>
  );
}

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Courses', href: '/explore' },
      { label: 'Resources', href: '/explore' },
      { label: 'Pricing', href: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Cookie Policy', href: '/' },
    ],
  },
];

const socials = [
  { label: 'Twitter', icon: (p: IconProps) => <X {...p} /> },
  { label: 'Github', icon: (p: IconProps) => <GitHubIcon {...p} /> },
  { label: 'Discord', icon: (p: IconProps) => <Globe {...p} /> },
];

export default function FooterBlock() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("You're subscribed", {
      description: `Confirmation sent to ${email}.`,
    });
  }

  return (
    <>
      <Toaster />
      <footer className="w-full border-t border-white/20 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
            <div className="max-w-sm">
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                  <span className="text-sm font-bold text-white">LS</span>
                </div>
                <span className="text-lg font-bold text-white">tailcast</span>
              </a>
              <h2 className="mt-6 text-xl font-bold tracking-tight text-white">
                Stay ahead in learning
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Get the latest courses, resources, and tips delivered weekly. No spam, unsubscribe
                anytime.
              </p>
              <form onSubmit={handleSubscribe} className="mt-5">
                <Label htmlFor="footer-email" className="sr-only">
                  Email address
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="footer-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black sm:flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={subscribed}
                    className="border-transparent bg-gray-900 text-white hover:bg-gray-800"
                  >
                    {subscribed ? (
                      <>
                        <IconPlaceholder
                          lucide="Check"
                          tabler="IconCheck"
                          hugeicons="Tick02Icon"
                          phosphor="Check"
                          remixicon="RiCheckLine"
                          data-icon="inline-start"
                        />
                        Subscribed
                      </>
                    ) : (
                      <>
                        Subscribe
                        <IconPlaceholder
                          lucide="ArrowRight"
                          tabler="IconArrowRight"
                          hugeicons="ArrowRightIcon"
                          phosphor="ArrowRight"
                          remixicon="RiArrowRightLine"
                          data-icon="inline-start"
                        />
                      </>
                    )}
                  </Button>
                </div>
              </form>
              <p
                className={cn(
                  'mt-3 text-xs text-gray-400 transition-colors',
                  subscribed && 'text-white'
                )}
              >
                {subscribed
                  ? 'Thanks for subscribing. Check your inbox to confirm.'
                  : 'By subscribing you agree to our Privacy Policy.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-sm font-bold tracking-tight text-white">{col.title}</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mt-12" />

          <div className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} tailcast. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="rounded-md border border-white/20 bg-black p-2 text-gray-400 transition-colors hover:text-white"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

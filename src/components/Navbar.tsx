'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function TailcastLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-primaryColor"
      aria-hidden="true"
    >
      <path d="M11.3709 9.59273L8.77816 7L1 14.7782L3.59272 17.3709L11.3709 9.59273Z"></path>
      <path d="M15.2218 7L23 14.7782L20.424 17.3542L15.2218 12.152L10.0197 17.3542L7.44367 14.7782L15.2218 7Z"></path>
    </svg>
  );
}

const navbarLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Blog', href: '/blog' },
  { label: 'Explore', href: '/explore' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname() ?? '/';
  const currentPath = pathname;
  const isHomepage = currentPath === '/' || currentPath === '/index.html';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return currentPath.startsWith(href);
  };

  // Homepage nav background on scroll
  useEffect(() => {
    if (!isHomepage) return;
    const updateNavBackground = () => setScrolled(window.scrollY > 50);
    updateNavBackground();
    window.addEventListener('scroll', updateNavBackground);
    return () => window.removeEventListener('scroll', updateNavBackground);
  }, [isHomepage]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        document.getElementById('mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const navBg = !isHomepage || scrolled ? 'bg-black/70 backdrop-blur-[15px]' : '';

  return (
    <nav
      className={`w-full h-20 flex flex-col justify-center items-center fixed z-40 transition-all duration-300 ${navBg}`}
      id="main-nav"
      data-homepage={isHomepage ? 'true' : 'false'}
      aria-label="Main navigation"
    >
      <div className="relative flex w-11/12 items-center justify-between xl:w-10/12 2xl:w-7xl">
        <div>
          <a href="/#home" aria-label="Home">
            <div className="flex grow basis-0 items-center justify-start">
              <div className="mr-2 text-6xl text-white">
                <TailcastLogo />
              </div>
              <div className="font-['IBM_Plex_Sans'] text-xl font-bold text-white">Tailcast</div>
            </div>
          </a>
        </div>
        <div>
          <div className="hidden h-full pl-12 lg:flex">
            {navbarLinks.map(({ href, label }) => (
              <a
                key={href}
                className="relative flex h-20 cursor-pointer items-center px-4 text-2xl leading-6 font-normal text-white transition duration-200 hover:text-indigo-200 focus-visible:outline-offset-[-4px] lg:text-base lg:font-medium 2xl:px-6"
                href={href}
                {...(isActive(href) ? { 'aria-current': 'page' as const } : {})}
              >
                {label}
                {isActive(href) && (
                  <span className="bg-secondaryColor absolute right-0 bottom-0 left-0 h-0.5 rounded-full" />
                )}
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="hidden grow basis-0 justify-end lg:flex">
            <a
              className="main-border-gray bg-gray-900 hover:bg-gray-800 active:scale-95 transition-transform duration-150 flex rounded-xl pt-2 pr-8 pb-2 pl-6 text-sm text-white ml-4"
              href="/signup"
              aria-label="Get Started"
            >
              <span className="pt-px">Get Started</span>
            </a>
          </div>
        </div>
        <button
          className="border-mainBorder hover:bg-gray-900 flex cursor-pointer flex-col rounded-md border border-solid px-2 py-3 lg:hidden"
          id="mobile-menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <div className="mb-1 h-0.5 w-5 bg-gray-500"></div>
          <div className="mb-1 h-0.5 w-5 bg-gray-500"></div>
          <div className="h-0.5 w-5 bg-gray-500"></div>
        </button>
      </div>
      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-20 z-40 lg:hidden ${menuOpen ? 'block' : 'hidden'}`}
        id="mobile-menu-overlay"
        onClick={() => setMenuOpen(false)}
      />
      {/* Mobile navbar */}
      <div
        className={`bg-black border-gray-800 absolute top-4 left-0 z-50 mt-16 w-full flex-col items-center gap-10 border-y border-solid pt-10 pb-10 lg:hidden ${menuOpen ? 'flex' : 'hidden'}`}
        id="mobile-menu"
        onKeyDown={(e) => {
          if (e.key !== 'Tab') return;
          const menu = e.currentTarget;
          const focusable = menu.querySelectorAll<HTMLElement>('a, button');
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }}
      >
        {navbarLinks.map(({ label, href }) => (
          <a
            key={href}
            className="mobile-nav-link mr-4 ml-4 h-full cursor-pointer pt-2 text-2xl leading-6 font-normal text-white transition duration-300 hover:scale-110 lg:text-base lg:font-medium 2xl:mr-6 2xl:ml-6"
            href={href}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        <div className="flex gap-4">
          <a
            className="outlined-button active:scale-95 transition-transform duration-150 flex pt-2 pr-8 pb-2 pl-6"
            href="/signup"
            aria-label="Login"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

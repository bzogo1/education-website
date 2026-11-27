'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FadeInObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in:not(.is-visible)').forEach((el) => {
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, [pathname]);

  return null;
}

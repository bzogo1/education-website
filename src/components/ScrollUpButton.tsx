'use client';

import { useEffect, useState } from 'react';

export default function ScrollUpButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(document.documentElement.scrollTop > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`main-border-gray-darker bg-bgDark2 hover:bg-bgDark3 fixed right-6 bottom-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl transition ${visible ? '' : 'hidden'}`}
      id="scroll-up-btn"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="35px"
        height="35px"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          d="M4.16732 12.5L10.0007 6.66667L15.834 12.5"
          stroke="rgb(99, 102, 241)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </button>
  );
}

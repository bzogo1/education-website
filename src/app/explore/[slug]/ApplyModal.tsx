'use client';

import { useEffect } from 'react';
import CloseIcon from '@/components/CloseIcon';

export default function ApplyModal({ title }: { title: string }) {
  useEffect(() => {
    const applyModal = document.getElementById('apply-modal') as HTMLDialogElement | null;
    const openBtn = document.getElementById('open-apply-modal');
    const closeBtn = document.getElementById('close-apply-modal');
    const applyForm = document.getElementById('apply-form') as HTMLFormElement | null;
    const applySuccess = document.getElementById('apply-success');

    const onOpen = () => applyModal?.showModal();
    const onClose = () => applyModal?.close();
    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === applyModal) applyModal?.close();
    };
    const onSubmit = (e: Event) => {
      e.preventDefault();
      if (!applyForm) return;
      applyForm.style.transition = 'opacity 0.3s ease';
      applyForm.style.opacity = '0';
      const applyHeader = document.getElementById('apply-header');
      const applyDesc = document.getElementById('apply-desc');
      if (applyHeader) {
        applyHeader.style.transition = 'opacity 0.3s ease';
        applyHeader.style.opacity = '0';
      }
      if (applyDesc) {
        applyDesc.style.transition = 'opacity 0.3s ease';
        applyDesc.style.opacity = '0';
      }
      setTimeout(() => {
        applyForm.classList.add('hidden');
        applyHeader?.classList.add('hidden');
        applyDesc?.classList.add('hidden');
        applySuccess?.classList.remove('hidden');
        applySuccess?.classList.add('flex');
        requestAnimationFrame(() => {
          applySuccess?.classList.remove('opacity-0');
          applySuccess?.classList.add('opacity-100');
        });
      }, 300);
    };

    openBtn?.addEventListener('click', onOpen);
    closeBtn?.addEventListener('click', onClose);
    applyModal?.addEventListener('click', onBackdropClick);
    applyForm?.addEventListener('submit', onSubmit);

    return () => {
      openBtn?.removeEventListener('click', onOpen);
      closeBtn?.removeEventListener('click', onClose);
      applyModal?.removeEventListener('click', onBackdropClick);
      applyForm?.removeEventListener('submit', onSubmit);
    };
  }, []);

  return (
    <dialog id="apply-modal" className="modal-backdrop modal-fullscreen-mobile">
      <div className="bg-bgDark3 relative h-screen w-screen px-6 py-8 md:h-auto md:w-[33.75rem] md:rounded-2xl md:px-8">
        <button className="modal-close-button" id="close-apply-modal" aria-label="Close modal">
          <CloseIcon />
        </button>
        <h2 id="apply-header" className="text-primaryText mb-1 text-xl font-bold">
          Apply for {title}
        </h2>
        <p id="apply-desc" className="text-secondaryText mb-6 text-sm">
          Fill in your details and we'll get back to you within a few days.
        </p>
        <form id="apply-form">
          <div className="mb-4">
            <label htmlFor="apply-name" className="text-primaryText mb-2 block font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="apply-name"
              placeholder="Jane Doe"
              required
              autoComplete="off"
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="apply-email" className="text-primaryText mb-2 block font-medium">
              Email
            </label>
            <input
              type="email"
              id="apply-email"
              placeholder="jane@example.com"
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="apply-portfolio" className="text-primaryText mb-2 block font-medium">
              Portfolio / GitHub
            </label>
            <input
              type="url"
              id="apply-portfolio"
              placeholder="https://github.com/you"
              autoComplete="off"
              className="form-input"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="apply-message" className="text-primaryText mb-2 block font-medium">
              Why this role?
            </label>
            <textarea
              id="apply-message"
              rows={4}
              placeholder="Tell us briefly what excites you about this position..."
              required
              autoComplete="off"
              className="form-input resize-none"
            ></textarea>
          </div>
          <button type="submit" className="contained-button w-full py-2.5 text-base">
            Submit application
          </button>
        </form>
        <div
          id="apply-success"
          className="hidden flex-col items-center justify-center py-12 text-center opacity-0 transition-opacity duration-500"
        >
          <div className="bg-primaryColor/20 mb-5 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              width="32"
              height="32"
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
              ></path>
            </svg>
          </div>
          <h3 className="text-primaryText mb-2 text-xl font-bold">Application sent!</h3>
          <p className="text-secondaryText max-w-xs leading-relaxed">
            Thanks for applying. We'll review your submission and reach out soon.
          </p>
        </div>
      </div>
    </dialog>
  );
}

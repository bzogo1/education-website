'use client';

import { useEffect, useRef } from 'react';

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

function CheckArrowIcon() {
  return (
    <div
      className="mr-4 flex h-5 w-5 items-center justify-center rounded-full bg-transparent"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="20px"
        height="20px"
        className="fill-secondaryColor"
      >
        <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
      </svg>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path>
    </svg>
  );
}

export default function InvitationModal() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    // Open modal when any [data-open-modal] element is clicked.
    // Delegated on document so it also works for elements rendered after
    // client-side navigation.
    const onDocumentClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest?.('[data-open-modal]');
      if (!trigger) return;
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      modal.showModal();
    };
    document.addEventListener('click', onDocumentClick);

    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === modal) modal.close();
    };
    modal.addEventListener('click', onBackdropClick);

    const onClose = () => {
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    };
    modal.addEventListener('close', onClose);

    return () => {
      document.removeEventListener('click', onDocumentClick);
      modal.removeEventListener('click', onBackdropClick);
      modal.removeEventListener('close', onClose);
    };
  }, []);

  return (
    <dialog
      id="invitation-modal"
      className="modal-backdrop"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      <div className="xs:w-[90vw] xs:h-auto xs:max-w-[25rem] xs:rounded-2xl xs:pt-8 bg-bgDarkTransparentLighter main-border-gray-darker xs:block relative flex h-screen w-screen flex-col justify-start overflow-hidden rounded-none px-6 pt-[11vh] pb-8 backdrop-blur-xl lg:w-[53.125rem] lg:max-w-none lg:px-10 lg:pt-8 xl:w-[57.5rem] 2xl:w-[68.75rem] 2xl:px-16 2xl:py-12">
        <button
          className="modal-close-button"
          id="modal-close"
          aria-label="Close modal"
          onClick={() => modalRef.current?.close()}
        >
          <CloseIcon />
        </button>
        <div className="flex">
          <div className="hidden w-1/2 pl-4 lg:inline 2xl:pl-0">
            <h2 className="text-primaryText mt-6 mb-2 text-4xl font-bold tracking-normal 2xl:text-5xl">
              Subscribe Now
            </h2>
            <h2 className="text-secondaryColor text-4xl font-bold tracking-normal 2xl:text-5xl">
              Winter is coming
            </h2>
            <ul className="text-primaryText mt-8 mb-6 2xl:mt-12">
              <li className="mb-4 flex">
                <CheckArrowIcon />
                <span>Vestibulum viverra</span>
              </li>
              <li className="mb-4 flex">
                <CheckArrowIcon />
                <span>Morbi mollis metus pretium</span>
              </li>
              <li className="mb-4 flex">
                <CheckArrowIcon />
                <span>Etiam lectus nunc, commodo</span>
              </li>
            </ul>
          </div>
          <div className="flex w-full flex-col items-center justify-center pt-0 lg:w-1/2">
            <div className="mb-6 flex items-center justify-start pr-6 lg:hidden">
              <div className="mr-2 text-8xl text-white">
                <TailcastLogo />
              </div>
              <div className="font-['IBM_Plex_Sans'] text-3xl font-bold text-white">Tailcast</div>
            </div>
            <h3
              className="text-primaryText mb-5 text-center text-xl leading-snug font-bold 2xl:mb-7 2xl:text-2xl"
              id="modal-title"
            >
              Join 3,953 other developers
            </h3>
            <div className="-m-2 mt-4 flex flex-wrap lg:mt-0">
              <div className="mx-auto w-full p-2 sm:w-4/5">
                <label htmlFor="modal-email" className="sr-only">
                  Email address
                </label>
                <input
                  className="form-input py-4 text-center font-medium"
                  type="email"
                  id="modal-email"
                  placeholder="Your email address"
                />
              </div>
              <div className="mx-auto mt-4 w-full p-2 sm:w-4/5">
                <button
                  className="shadow-4xl bg-primaryColor w-full cursor-pointer rounded-xl px-6 py-4 font-semibold text-black transition duration-200 ease-in-out hover:bg-[#b8dcff] focus:ring focus:ring-[#91c6ff]"
                  type="button"
                  aria-label="Join now"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

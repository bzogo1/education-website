import Link from 'next/link';

export default function PublicPortfolioNotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#08090a] px-6 py-16 text-[#f5f4ef]">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.09] bg-[#101113] px-8 py-10 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-xl bg-[#2f6f4e] font-serif text-base font-bold text-white">
          F
        </span>
        <h1 className="mt-5 font-serif text-2xl font-semibold tracking-[-0.02em]">
          Portfolio not found
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-white/45">
          This portfolio may have been unpublished, renamed, or never existed. Check the link you
          were given.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg border border-white/[0.12] px-4 py-2 text-[12.5px] text-white/70 transition hover:border-white/25 hover:text-white"
          >
            Back to Folio
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#d7e8dc] px-4 py-2 text-[12.5px] font-semibold text-[#0d1a12] transition hover:bg-[#e6f2e9]"
          >
            Create your portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

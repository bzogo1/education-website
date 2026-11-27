import AnimatedBeamDefault from './ui/AnimatedBeamDefault';

export default function FeaturesDiagonal() {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-black">
      <div className="shape-divider-bottom-1665696614">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="bg-bgDark2 fill-bgDark2"
        >
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="bg-black fill-black"></path>
        </svg>
      </div>
      <div className="fade-in w-full bg-black">
        <div className="mx-auto flex flex-col justify-center bg-black pt-12 pb-8 md:w-4/5 lg:flex-row lg:pt-24 lg:pb-20 xl:w-[1050px] 2xl:w-[1150px]">
          <div className="lg:mx-unset mx-auto flex w-3/4 flex-col lg:w-1/2">
            <span className="block-subtitle">Accelerate Your Success</span>
            <h2 className="block-big-title mt-10 mb-8 text-4xl lg:text-5xl">
              Over 100+ connectors for easily accesibiility
            </h2>
            <p className="text-secondaryText mb-16 leading-loose">
              Our platform enables you to launch your data-driven projects with ease. Boost
              productivity and achieve better results. Empower your decision-making with advanced
              analytics
            </p>
            <button
              className="contained-button mr-10 h-12 w-[210px]"
              data-open-modal
              aria-label="Get started"
            >
              Get Started
            </button>
          </div>
          <div className="mx-auto flex w-4/5 justify-center pt-16 lg:w-1/2 lg:pt-0 lg:pl-16">
            <AnimatedBeamDefault />
          </div>
        </div>
      </div>
      <div className="shape-divider-top-1665696661 w-full">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="bg-bgDark2 fill-bgDark2"
        >
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="bg-black fill-black"></path>
        </svg>
      </div>
    </section>
  );
}

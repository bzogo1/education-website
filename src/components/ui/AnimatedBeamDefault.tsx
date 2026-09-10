'use client';

import { AnimatedBeam, Circle, Icons } from '../../../components/uilayouts/animated-beam';
import React, { useRef } from 'react';
import cloudflareIcon from '../../assets/icons/brand/cloudflare.svg';
import githubIcon from '../../assets/icons/brand/github.svg';
import googleCloudIcon from '../../assets/icons/brand/google-cloud.svg';
import supabaseIcon from '../../assets/icons/brand/supabase.svg';
import vercelIcon from '../../assets/icons/brand/vercel.svg';

export default function AnimatedBeamDefault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative mx-auto flex w-full max-w-[500px] items-center justify-center overflow-hidden rounded-lg border bg-muted p-2 shadow-xl sm:p-4 lg:p-10"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <img src={cloudflareIcon} alt="Cloudflare" className="h-full w-full" />
          </Circle>
          <Circle ref={div5Ref} className="p-2">
            <img src={supabaseIcon} alt="Supabase" className="h-full w-full" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref} className="p-2">
            <img src={githubIcon} alt="GitHub" className="h-full w-full" />
          </Circle>
          <Circle ref={div4Ref} className="h-16 w-16 p-3">
            <Icons.logo />
          </Circle>
          <Circle ref={div6Ref} className="p-2">
            <img src={vercelIcon} alt="Vercel" className="h-full w-full" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref} className="p-2">
            <img src={googleCloudIcon} alt="Google Cloud" className="h-full w-full" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        dotted
        gradientStartColor="#00ac47"
        gradientStopColor="#ffba00"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        dotted
        gradientStartColor="#d948ae"
        gradientStopColor="#5b60ff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        dotted
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
        gradientStartColor="#48b0d9"
        gradientStopColor="#67aeff"
        dotted
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
        dotted
        gradientStartColor="#00ac47"
        gradientStopColor="#4fcc5d"
      />
    </div>
  );
}

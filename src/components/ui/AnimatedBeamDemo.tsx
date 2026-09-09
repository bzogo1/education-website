import { useRef } from 'react';
import { AnimatedBeam, Circle } from '../../../components/uilayouts/animated-beam';

const connectors = [
  { label: 'CRM', className: 'bg-cyan-300 text-slate-950' },
  { label: 'API', className: 'bg-amber-300 text-slate-950' },
  { label: 'BI', className: 'bg-rose-300 text-slate-950' },
];

export default function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const firstConnectorRef = useRef<HTMLDivElement>(null);
  const secondConnectorRef = useRef<HTMLDivElement>(null);
  const thirdConnectorRef = useRef<HTMLDivElement>(null);
  const connectorRefs = [firstConnectorRef, secondConnectorRef, thirdConnectorRef];

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 px-6 py-10"
    >
      <div className="absolute inset-x-8 top-8 flex justify-between text-[10px] font-semibold tracking-[0.22em] text-white/45 uppercase">
        <span>Sources</span>
        <span>Workspace</span>
      </div>
      <div className="flex w-full max-w-[310px] items-center justify-between gap-5">
        <div className="flex flex-col gap-5">
          {connectors.map((connector, index) => (
            <Circle
              key={connector.label}
              ref={connectorRefs[index]}
              className={`h-14 w-14 border-white/20 text-xs font-bold ${connector.className}`}
            >
              {connector.label}
            </Circle>
          ))}
        </div>
        <Circle ref={centerRef} className="h-20 w-20 border-cyan-200/50 bg-cyan-400 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.45)]">
          <span className="text-center text-[10px] leading-tight font-bold tracking-[0.12em] uppercase">
            One
            <br />
            view
          </span>
        </Circle>
      </div>
      {connectorRefs.map((connectorRef, index) => (
        <AnimatedBeam
          key={connectors[index].label}
          containerRef={containerRef}
          fromRef={connectorRef}
          toRef={centerRef}
          curvature={(index - 1) * 45}
          pathColor="#67e8f9"
          pathOpacity={0.22}
          gradientStartColor="#fbbf24"
          gradientStopColor="#22d3ee"
          duration={3.5 + index * 0.5}
          delay={index * 0.35}
        />
      ))}
    </div>
  );
}

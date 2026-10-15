"use client";

import { useEffect, useRef, useState } from "react";
import { createRenderer } from "./nextjs-flare-utils/renderer";

export function Flare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas has dimensions
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    const renderer = createRenderer({ canvas });
    void renderer.ready.then(() => {
      setIsLoaded(true);
    });

    return () => renderer.dispose();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ minHeight: '300px' }}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default Flare;

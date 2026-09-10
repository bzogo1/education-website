type RendererOptions = {
  canvas: HTMLCanvasElement;
};

type Renderer = {
  ready: Promise<void>;
  dispose: () => void;
};

export function createRenderer({ canvas }: RendererOptions): Renderer {
  const context = canvas.getContext('2d');
  if (!context) {
    return { ready: Promise.resolve(), dispose: () => undefined };
  }

  let animationFrame = 0;
  let disposed = false;
  let width = 0;
  let height = 0;

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(bounds.width));
    height = Math.max(1, Math.floor(bounds.height));
    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };

  const draw = (time: number) => {
    if (disposed) return;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.max(width, height) * 0.68;
    const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    glow.addColorStop(0, 'rgba(104, 188, 255, 0.2)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'rgba(141, 211, 255, 0.35)';
    context.beginPath();
    context.arc(
      centerX + Math.cos(time * 0.0004) * radius * 0.25,
      centerY + Math.sin(time * 0.0004) * radius * 0.25,
      Math.max(2, Math.min(width, height) * 0.01),
      0,
      Math.PI * 2
    );
    context.fill();
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  animationFrame = requestAnimationFrame(draw);

  return {
    ready: Promise.resolve(),
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    },
  };
}
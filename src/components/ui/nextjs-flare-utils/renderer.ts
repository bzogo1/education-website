type RendererOptions = {
  canvas: HTMLCanvasElement;
};

type Renderer = {
  ready: Promise<void>;
  dispose: () => void;
};

type Particle = {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  alpha: number;
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
  let particles: Particle[] = [];

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(bounds.width));
    height = Math.max(1, Math.floor(bounds.height));
    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    particles = Array.from({ length: 180 }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: Math.random(),
      speed: 0.0008 + Math.random() * 0.002,
      size: 0.4 + Math.random() * 1.8,
      alpha: 0.18 + Math.random() * 0.6,
    }));
  };

  const draw = (time: number) => {
    if (disposed) return;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.max(width, height) * 0.68;
    const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    glow.addColorStop(0, 'rgba(104, 188, 255, 0.2)');
    glow.addColorStop(0.3, 'rgba(34, 104, 186, 0.08)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    context.globalCompositeOperation = 'lighter';
    for (const particle of particles) {
      particle.distance += particle.speed;
      if (particle.distance > 1) particle.distance = 0;

      const wave = Math.sin(time * 0.0005 + particle.angle * 3) * 0.08;
      const x = centerX + Math.cos(particle.angle) * radius * (particle.distance + wave);
      const y = centerY + Math.sin(particle.angle) * radius * (particle.distance + wave);
      const opacity = particle.alpha * (1 - particle.distance);
      context.fillStyle = `rgba(141, 211, 255, ${opacity})`;
      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    }
    context.globalCompositeOperation = 'source-over';
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
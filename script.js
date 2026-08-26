import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const LINES = [...document.querySelectorAll("#headline span")].map((span) =>
  span.textContent.trim().toUpperCase()
);
const BG = "#e9e9e7";
const INK = "#111111";
const CAMERA_Z = 5;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = CAMERA_Z;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const textCanvas = document.createElement("canvas");
const textCtx = textCanvas.getContext("2d");
let textTexture = null;

const textPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ toneMapped: false })
);
scene.add(textPlane);

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.3, 300, 48, 2, 3),
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 1,
    thickness: 0.7,
    ior: 1.45,
    dispersion: 4,
    envMapIntensity: 1,
    toneMapped: false
  })
);
torus.position.z = 2.2;
scene.add(torus);

function drawText(width, height) {
  const dpr = Math.min(window.devicePixelRatio, 2);
  textCanvas.width = Math.round(width * dpr);
  textCanvas.height = Math.round(height * dpr);
  textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  textCtx.fillStyle = BG;
  textCtx.fillRect(0, 0, width, height);
  textCtx.fillStyle = INK;
  textCtx.textAlign = "center";
  textCtx.textBaseline = "middle";

  const maxWidth = width * 0.92;
  const maxHeight = height * 0.78;
  const baseSize = 100;
  const lineGap = 0.98;

  textCtx.font = `900 ${baseSize}px "Inter Tight", sans-serif`;
  const sizes = LINES.map(
    (line) => baseSize * (maxWidth / textCtx.measureText(line).width)
  );
  const totalHeight = sizes.reduce((sum, size) => sum + size * lineGap, 0);
  const fit = Math.min(1, maxHeight / totalHeight);

  let y = height / 2 - (totalHeight * fit) / 2;
  LINES.forEach((line, i) => {
    const size = sizes[i] * fit;
    textCtx.font = `900 ${size}px "Inter Tight", sans-serif`;
    y += (size * lineGap) / 2;
    textCtx.fillText(line, width / 2, y);
    y += (size * lineGap) / 2;
  });

  if (textTexture) {
    textTexture.dispose();
  }
  textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.colorSpace = THREE.SRGBColorSpace;
  textTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textPlane.material.map = textTexture;
  textPlane.material.needsUpdate = true;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const visibleHeight =
    2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const visibleWidth = visibleHeight * camera.aspect;
  textPlane.scale.set(visibleWidth, visibleHeight, 1);

  const torusScale = Math.min(visibleWidth, visibleHeight) * 0.09;
  torus.scale.setScalar(torusScale);

  drawText(width, height);
}

const pointer = new THREE.Vector2();
window.addEventListener("pointermove", (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
});

const clock = new THREE.Clock();

function render() {
  const t = clock.getElapsedTime();

  if (!reducedMotion) {
    torus.rotation.x = t * 0.35 + pointer.y * 0.15;
    torus.rotation.y = t * 0.5 + pointer.x * 0.2;
  } else {
    torus.rotation.set(0.6, 0.4, 0);
  }

  renderer.render(scene, camera);
}

function debounce(fn, delay) {
  let timeoutId;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
}

const debouncedResize = debounce(resize, 150);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  debouncedResize();
});

document.fonts.ready.then(() => {
  resize();
  if (reducedMotion) {
    render();
  } else {
    renderer.setAnimationLoop(render);
  }
});

// Add click listener to transition to main page when clicking nav links
document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('show-main');
  });
});

// Also add click on "Scroll to explore" text
const scrollExploreText = document.querySelector('.meta span:last-child');
if (scrollExploreText) {
  scrollExploreText.addEventListener('click', () => {
    document.body.classList.add('show-main');
  });
  scrollExploreText.style.cursor = 'pointer';
}

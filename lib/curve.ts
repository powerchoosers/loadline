import * as THREE from 'three';
import { loadAt, PEAK_THRESHOLD } from './load-shape';

export { loadAt, PEAK_THRESHOLD };

export type CurveHandle = {
  setMorph: (value: number) => void;
  setGather: (value: number) => void;
  dispose: () => void;
};

type Options = {
  rectA: HTMLElement;
  rectB: HTMLElement | null;
  count: number;
  animate: boolean;
};

const vertexShader = /* glsl */ `
  attribute vec2 aScatter;
  uniform vec4 uRectA;
  uniform vec4 uRectB;
  uniform float uMorph;
  uniform float uGather;
  uniform float uTime;
  uniform float uSize;
  uniform float uAspect;
  uniform float uPointerK;
  uniform vec2 uPointer;
  varying float vPeak;
  varying float vAlpha;

  void main() {
    vec2 c = position.xy;
    float seed = position.z;
    c.y += sin(uTime * 0.7 + seed * 6.2831 + c.x * 9.0) * 0.008 * (1.0 - uMorph * 0.6);

    vec4 r = mix(uRectA, uRectB, uMorph);
    vec2 p = r.xy + c * r.zw;

    float g = clamp(uGather * 1.6 - seed * 0.6, 0.0, 1.0);
    g = 1.0 - pow(1.0 - g, 3.0);
    p = mix(aScatter, p, g);

    vec2 d = p - uPointer;
    d.x *= uAspect;
    float dist = length(d);
    vec2 push = (d / max(dist, 0.0001)) * vec2(1.0 / uAspect, 1.0);
    p += push * uPointerK * 0.07 * exp(-dist * dist * 22.0);

    gl_Position = vec4(p, 0.0, 1.0);

    float sweep = exp(-pow((c.x - fract(uTime * 0.06)) * 9.0, 2.0));
    gl_PointSize = uSize * (0.55 + seed * 0.9) * mix(1.0, 0.62, uMorph) * (1.0 + sweep * 0.8);
    vPeak = smoothstep(${(PEAK_THRESHOLD - 0.04).toFixed(2)}, ${(PEAK_THRESHOLD + 0.05).toFixed(2)}, position.y);
    vAlpha = (0.3 + 0.7 * g) * (0.5 + 0.5 * seed) + sweep * 0.35;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uMint;
  uniform vec3 uAmber;
  varying float vPeak;
  varying float vAlpha;

  void main() {
    float a = smoothstep(0.5, 0.26, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(mix(uMint, uAmber, vPeak), a * vAlpha);
  }
`;

function mulberry(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function createCurve(canvas: HTMLCanvasElement, options: Options): CurveHandle {
  const { rectA, rectB, count, animate } = options;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const rand = mulberry(20261124);
  const days = 28;
  const dayScale = Array.from({ length: days }, () => 0.84 + rand() * 0.16);
  const positions = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 2);
  for (let i = 0; i < count; i += 1) {
    const u = rand();
    const day = Math.floor(rand() * days);
    const weekend = day % 7 >= 5;
    const shape = loadAt(u);
    const v = weekend ? 0.2 + shape * 0.16 : shape * dayScale[day];
    positions[i * 3] = u;
    positions[i * 3 + 1] = v + (rand() - 0.5) * 0.022;
    positions[i * 3 + 2] = rand();
    scatter[i * 2] = (rand() - 0.5) * 2.6;
    scatter[i * 2 + 1] = (rand() - 0.5) * 2.6;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 2));

  const uniforms = {
    uRectA: { value: new THREE.Vector4(-1, -1, 2, 1) },
    uRectB: { value: new THREE.Vector4(-1, -1, 2, 1) },
    uMorph: { value: 0 },
    uGather: { value: animate ? 0 : 1 },
    uTime: { value: 0 },
    uSize: { value: 3.4 * dpr },
    uAspect: { value: 1 },
    uPointerK: { value: 0 },
    uPointer: { value: new THREE.Vector2(9, 9) },
    uMint: { value: new THREE.Vector3(0.616, 0.851, 0.749) },
    uAmber: { value: new THREE.Vector3(0.949, 0.698, 0.416) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(points);
  const camera = new THREE.Camera();

  let width = 0;
  let height = 0;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || (w === width && h === height)) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    uniforms.uAspect.value = w / h;
  };

  const writeRect = (el: HTMLElement | null, target: THREE.Vector4, bounds: DOMRect) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    target.set(
      ((r.left - bounds.left) / bounds.width) * 2 - 1,
      1 - ((r.bottom - bounds.top) / bounds.height) * 2,
      (r.width / bounds.width) * 2,
      (r.height / bounds.height) * 2,
    );
    return true;
  };

  let pointerX = -1;
  let pointerY = -1;
  let pointerAt = 0;
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerAt = performance.now();
  };

  const draw = (now: number) => {
    resize();
    if (!width) return;
    const bounds = canvas.getBoundingClientRect();
    writeRect(rectA, uniforms.uRectA.value, bounds);
    if (!writeRect(rectB, uniforms.uRectB.value, bounds)) uniforms.uRectB.value.copy(uniforms.uRectA.value);
    if (animate) {
      uniforms.uTime.value = now / 1000;
      uniforms.uPointer.value.set(
        ((pointerX - bounds.left) / bounds.width) * 2 - 1,
        1 - ((pointerY - bounds.top) / bounds.height) * 2,
      );
      const wanted = now - pointerAt < 1400 ? 1 - uniforms.uMorph.value : 0;
      uniforms.uPointerK.value += (wanted - uniforms.uPointerK.value) * 0.08;
    }
    renderer.render(scene, camera);
  };

  let frame = 0;
  let visible = true;
  let disposed = false;
  const loop = (now: number) => {
    frame = 0;
    if (disposed) return;
    draw(now);
    if (animate && visible && !document.hidden) frame = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(loop);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  });
  observer.observe(canvas);
  const resizeObserver = new ResizeObserver(kick);
  resizeObserver.observe(canvas);
  document.addEventListener('visibilitychange', kick);
  window.addEventListener('scroll', kick, { passive: true });
  if (animate) window.addEventListener('pointermove', onPointer, { passive: true });
  kick();

  return {
    setMorph(value) {
      uniforms.uMorph.value = value;
      kick();
    },
    setGather(value) {
      uniforms.uGather.value = value;
      kick();
    },
    dispose() {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', kick);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

/** SVG path of the weekday shape, used when WebGL is unavailable. */
export function fallbackPath(width = 1000, height = 400): string {
  const steps = 96;
  let d = '';
  for (let i = 0; i <= steps; i += 1) {
    const u = i / steps;
    d += `${i ? 'L' : 'M'}${(u * width).toFixed(1)} ${(height - loadAt(u) * height).toFixed(1)}`;
  }
  return d;
}

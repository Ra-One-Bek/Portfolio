// Background.tsx
import { useEffect, useMemo, useRef } from "react";

type Bubble = {
  id: number;
  x0: number; // base x (0..1)
  y0: number; // base y (0..1)
  r: number; // px radius
  ampX: number; // px amplitude
  ampY: number; // px amplitude
  freqX: number; // radians/sec
  freqY: number; // radians/sec
  phaseX: number;
  phaseY: number;
  driftX: number; // px/sec
  driftY: number; // px/sec
  opacity: number;
  blur: number; // px
  speed: number; // multiplier
};

type Props = {
  count?: number;
  className?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Background({ count = 18, className = "" }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const elsRef = useRef<Map<number, HTMLDivElement>>(new Map());

  // scroll tracking
  const lastScrollY = useRef<number>(0);
  const scrollVel = useRef<number>(0); // px/sec (positive when scrolling down)
  const lastScrollT = useRef<number>(performance.now());

  const bubbles = useMemo(() => {
    // Generate once
    const arr: Bubble[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.round(18 + Math.random() * 70);
      arr.push({
        id: i,
        x0: Math.random(),
        y0: Math.random(),
        r,
        ampX: 20 + Math.random() * 140,
        ampY: 10 + Math.random() * 90,
        freqX: 0.3 + Math.random() * 1.1,
        freqY: 0.25 + Math.random() * 0.9,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        driftX: (-10 + Math.random() * 20), // gentle left/right
        driftY: (-8 + Math.random() * 16), // gentle up/down
        opacity: 0.08 + Math.random() * 0.18,
        blur: Math.random() < 0.35 ? 6 + Math.random() * 10 : 0,
        speed: 0.6 + Math.random() * 1.6,
      });
    }
    bubblesRef.current = arr;
    return arr;
  }, [count]);

  useEffect(() => {
    // initial scroll state
    lastScrollY.current = window.scrollY;
    lastScrollT.current = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(0.016, (now - lastScrollT.current) / 1000);

      // px/sec; + when scrolling down, - when scrolling up
      const v = (y - lastScrollY.current) / dt;

      // smooth it a bit to avoid jitter
      scrollVel.current = scrollVel.current * 0.85 + v * 0.15;

      lastScrollY.current = y;
      lastScrollT.current = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let raf = 0;
    let t0 = performance.now();

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const now = performance.now();
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;

      const layer = layerRef.current;
      if (!layer) return;

      const w = layer.clientWidth;
      const h = layer.clientHeight;

      // scroll influence: when scrolling down -> bubbles drift down faster
      // when scrolling up -> drift up faster
      // keep it bounded so it doesn't go crazy
      const v = clamp(scrollVel.current, -2500, 2500); // px/sec
      const scrollBoost = v / 900; // roughly -2.7..+2.7

      for (const b of bubblesRef.current) {
        const el = elsRef.current.get(b.id);
        if (!el) continue;

        // advance base position with drift + scroll boost
        b.x0 += ((b.driftX * b.speed) / Math.max(1, w)) * dt;
        b.y0 += ((b.driftY * b.speed + scrollBoost * 140 * b.speed) / Math.max(1, h)) * dt;

        // wrap around (keep in 0..1)
        if (b.x0 < -0.2) b.x0 += 1.4;
        if (b.x0 > 1.2) b.x0 -= 1.4;
        if (b.y0 < -0.2) b.y0 += 1.4;
        if (b.y0 > 1.2) b.y0 -= 1.4;

        const t = now / 1000;
        const x =
          b.x0 * w +
          Math.sin(t * b.freqX + b.phaseX) * b.ampX +
          Math.sin(t * (b.freqX * 0.37) + b.phaseY) * (b.ampX * 0.35);

        const y =
          b.y0 * h +
          Math.cos(t * b.freqY + b.phaseY) * b.ampY +
          Math.sin(t * (b.freqY * 0.52) + b.phaseX) * (b.ampY * 0.25);

        // translate to center by radius
        el.style.transform = `translate3d(${x - b.r}px, ${y - b.r}px, 0)`;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={layerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden  ${className}`}
      aria-hidden="true"
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          ref={(node) => {
            if (!node) elsRef.current.delete(b.id);
            else elsRef.current.set(b.id, node);
          }}
          className="absolute rounded-full will-change-transform"
          style={{
            width: b.r * 2,
            height: b.r * 2,
            opacity: b.opacity,
            filter: b.blur ? `blur(${b.blur}px)` : undefined,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 65%, rgba(255,255,255,0.0) 72%)",
          }}
        />
      ))}
    </div>
  );
}

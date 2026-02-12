import { useEffect, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function useCenterProgress<T extends HTMLElement>(
  ref: React.RefObject<T | null>,

  rangePx: number = 360
) {
  const [p, setP] = useState(0); // 0..1 (1 в центре)

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;

      const dist = Math.abs(elCenter - viewportCenter);
      const next = 1 - clamp(dist / rangePx, 0, 1);

      setP(next);
    };

    const onMove = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, [ref, rangePx]);

  return p;
}

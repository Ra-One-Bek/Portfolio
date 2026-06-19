import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import type { Work } from "./worksData";
import {
  PANEL_WIDTH_DESKTOP,
  PANEL_WIDTH_MOBILE,
  getHangAssemblyHeight,
  getRopeTop,
} from "./worksData";

type Props = {
  work: Work;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
  spacing: number;
  isMobile: boolean;
  isSelected: boolean;
  onSelect: (work: Work) => void;
};

export default function HangingProject({
  work,
  index,
  total,
  scrollProgress,
  scrollVelocity,
  spacing,
  isMobile,
  isSelected,
  onSelect,
}: Props) {
  const panelWidth = isMobile ? PANEL_WIDTH_MOBILE : PANEL_WIDTH_DESKTOP;
  const assemblyHeight = getHangAssemblyHeight(isMobile);
  const ropeTop = getRopeTop(isMobile);

  const phase = index * 1.73 + 0.4;

  const centerProgress = index / Math.max(1, total - 1);
  const focus = useTransform(
    scrollProgress,
    [
      Math.max(0, centerProgress - 0.14),
      centerProgress,
      Math.min(1, centerProgress + 0.14),
    ],
    [0, 1, 0]
  );

  const translateZ = useTransform(focus, [0, 1], [isMobile ? -70 : -220, isMobile ? 30 : 140]);
  const scale = useTransform(focus, [0, 1], [isMobile ? 0.82 : 0.86, 1]);
  const brightness = useTransform(focus, [0, 1], [0.45, 1.12]);
  const contrast = useTransform(focus, [0, 1], [0.85, 1.08]);
  const blurPx = useTransform(focus, [0, 0.45, 1], [isMobile ? 2 : 5, isMobile ? 0.5 : 1.5, 0]);
  const panelOpacity = useTransform(focus, [0, 0.35, 1], [0.35, 0.78, 1]);
  const panelFilter = useTransform(
    [blurPx, brightness, contrast],
    ([b, br, ct]) => `blur(${b}px) brightness(${br}) contrast(${ct})`
  );

  const velocityRotZ = useTransform(scrollVelocity, (v) => {
    if (Math.abs(v) < 40) return 0;

    return isMobile
      ? Math.max(-1.5, Math.min(1.5, v * 0.001))
      : Math.max(-3, Math.min(3, v * 0.0015));
  });

  const velocityRotX = useTransform(scrollVelocity, (v) => {
    if (Math.abs(v) < 40) return 8;

    return isMobile
      ? 8 + Math.max(-1, Math.min(1, v * 0.0005))
      : 8 + Math.max(-2, Math.min(2, v * 0.0008));
  });

  const ambientRotZ = useMotionValue(0);
  const ambientRotX = useMotionValue(0);

  const timeRef = useRef(0);

  useAnimationFrame((t) => {
    if (isMobile) {
      ambientRotZ.set(0);
      ambientRotX.set(0);
      return;
    }

    timeRef.current = t / 1000;

    ambientRotZ.set(
      Math.sin(
        timeRef.current * (0.35 + index * 0.03) + phase
      ) * 0.2
    );

    ambientRotX.set(
      Math.cos(
        timeRef.current * (0.3 + index * 0.02) + phase
      ) * 0.15
    );
  });

  const combinedRotZ = useTransform(
    [velocityRotZ, ambientRotZ],
    ([v, a]) => (v as number) + (a as number)
  );

  const combinedRotX = useTransform(
    [velocityRotX, ambientRotX],
    ([v, a]) => (v as number) + (a as number)
  );

  const springRotZ = useSpring(combinedRotZ, {
    stiffness: 45,
    damping: 28,
    mass: 3,
  });

  const springRotX = useSpring(combinedRotX, {
    stiffness: 50,
    damping: 30,
    mass: 3,
  });

  const yOffset = (index % 3) * (isMobile ? 18 : 32) - (isMobile ? 18 : 32);
  const xPos = index * spacing;

  return (
    <motion.div
      className="absolute"
      style={{
        left: xPos,
        top: ropeTop,
        y: yOffset,
        z: translateZ,
        scale,
        opacity: isSelected ? 0 : panelOpacity,
        filter: panelFilter,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative flex flex-col items-center"
        style={{
          width: panelWidth,
          height: assemblyHeight,
          transformStyle: "preserve-3d",
          perspective: "1200px",
        }}
      >
        {/* Clip on shared rope */}
        <motion.div
          className="absolute left-1/2 top-0 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{
            transformStyle: "preserve-3d",
            rotateZ: springRotZ,
            rotateX: springRotX,
            transformOrigin: "50% 0%",
          }}
        >
          <div className="relative h-[11px] w-[20px] rounded-sm border border-zinc-400/70 bg-gradient-to-br from-zinc-200/90 to-zinc-600/80 shadow-md">
            <div className="absolute inset-x-[3px] top-[3px] h-[2px] rounded-full bg-zinc-900/25" />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{
            transformStyle: "preserve-3d",
            rotateZ: springRotZ,
            rotateX: springRotX,
            transformOrigin: "50% 0%",
          }}
        >
          <motion.button
            type="button"
            aria-label={`Open ${work.title}`}
            onClick={() => onSelect(work)}
            className="group w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{
              width: panelWidth,
              transformStyle: "preserve-3d",
              rotateX: 6,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glass panel body */}
            <div
              className="relative overflow-hidden rounded-xl border border-white/15 bg-zinc-900/40 shadow-[0_30px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm sm:rounded-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Ambient rim light */}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 sm:rounded-2xl" />
              <div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-60 sm:rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${work.accent}22, transparent 50%, ${work.accent}11)`,
                }}
              />

              {/* Image / placeholder */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {work.image ? (
                  <img
                    src={work.image}
                    alt={work.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-start justify-between p-5 sm:p-8"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${work.accent}33, #0c0c0f 65%)`,
                    }}
                  >
                    <span className="text-4xl font-bold text-white/15 sm:text-6xl">
                      {work.id}
                    </span>
                    <span className="max-w-[85%] text-sm leading-snug text-white/70 sm:text-base">
                      {work.title}
                    </span>
                  </div>
                )}

                {/* Glass reflection overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
              </div>

              {/* Caption strip */}
              <div className="border-t border-white/10 bg-black/30 px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-xs">
                  Exhibit {work.id}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-white/90 sm:text-base">
                  {work.title}
                </p>
              </div>
            </div>

            {/* Floor shadow */}
            <div
              className="pointer-events-none absolute left-1/2 top-[calc(100%+18px)] h-4 w-[72%] -translate-x-1/2 rounded-[100%] bg-black/50 blur-xl"
              style={{ transform: "rotateX(75deg) translateZ(-20px)" }}
            />

            {/* Reflection on floor */}
            <div
              className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] w-[88%] -translate-x-1/2 overflow-hidden opacity-25"
              style={{
                height: panelWidth * 0.18,
                transform: "scaleY(-1) rotateX(12deg)",
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
              }}
            >
              {work.image ? (
                <img src={work.image} alt="" className="h-full w-full object-cover blur-[2px]" />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(to bottom, ${work.accent}44, transparent)`,
                  }}
                />
              )}
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

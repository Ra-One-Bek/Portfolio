import {
  motion,
  type MotionValue,
  useTransform,
} from "framer-motion";
import { useMemo } from "react";

type Props = {
  scrollProgress: MotionValue<number>;
  isMobile: boolean;
};

export default function GalleryEnvironment({ scrollProgress, isMobile }: Props) {
  const farX = useTransform(scrollProgress, [0, 1], ["0%", "-8%"]);
  const midX = useTransform(scrollProgress, [0, 1], ["0%", "-18%"]);
  const nearX = useTransform(scrollProgress, [0, 1], ["0%", "-28%"]);
  const fogY = useTransform(scrollProgress, [0, 1], ["0%", "-12%"]);

  const dust = useMemo(
    () =>
      Array.from({ length: isMobile ? 18 : 42 }, (_, i) => ({
        id: i,
        x: (i * 17.3) % 100,
        y: (i * 23.7) % 100,
        size: 1 + (i % 3),
        opacity: 0.08 + (i % 5) * 0.04,
        delay: (i % 10) * 0.4,
      })),
    [isMobile]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Far layer */}
      <motion.div
        style={{ x: farX }}
        className="absolute inset-[-20%] bg-stone-900"
      />

      {/* Mid layer — soft stone fog */}
      <motion.div style={{ x: midX, y: fogY }} className="absolute inset-0">
        <div className="absolute left-[-10%] top-[20%] h-[55vh] w-[45vw] rounded-full bg-stone-800/20 blur-[120px]" />
        <div className="absolute right-[-5%] top-[35%] h-[50vh] w-[40vw] rounded-full bg-stone-700/15 blur-[100px]" />
        <div className="absolute left-[30%] bottom-[10%] h-[40vh] w-[35vw] rounded-full bg-stone-800/10 blur-[90px]" />
      </motion.div>

      {/* Light rays */}
      <motion.div style={{ x: nearX }} className="absolute inset-0 opacity-30">
        <div className="absolute left-[15%] top-0 h-full w-[2px] rotate-[12deg] bg-gradient-to-b from-white/15 via-white/5 to-transparent blur-[1px]" />
        <div className="absolute left-[42%] top-0 h-full w-[3px] rotate-[8deg] bg-gradient-to-b from-stone-200/10 via-white/5 to-transparent blur-[2px]" />
        <div className="absolute left-[68%] top-0 h-full w-[2px] rotate-[15deg] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[1px]" />
        <div className="absolute left-[85%] top-0 h-full w-[4px] rotate-[6deg] bg-gradient-to-b from-white/10 via-transparent to-transparent blur-[3px]" />
      </motion.div>

      {/* Ceiling grid — museum architecture hint */}
      <motion.div
        style={{ x: midX }}
        className="absolute inset-x-0 top-0 h-[28vh] opacity-[0.07]"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </motion.div>

      {/* Dust particles */}
      <motion.div style={{ x: nearX }} className="absolute inset-0">
        {dust.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -18, 6, -12, 0],
              x: [0, 8, -6, 4, 0],
              opacity: [p.opacity, p.opacity * 1.6, p.opacity * 0.7, p.opacity],
            }}
            transition={{
              duration: 8 + (p.id % 6),
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Floor haze */}
      <div className="absolute inset-x-0 bottom-0 h-[35vh] bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_50%_50%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}

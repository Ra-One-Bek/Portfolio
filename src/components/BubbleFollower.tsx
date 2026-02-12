import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Props = {
  targetRef: React.RefObject<HTMLElement | null>;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function BubbleFollower({ targetRef }: Props) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"], // прогресс пока секция проходит через экран
  });

  // каждый раз немного другая траектория (на перезагрузку)
  const seed = useMemo(() => Math.floor(Math.random() * 1e9), []);
  const rand = useMemo(() => mulberry32(seed), [seed]);

  const drift = useMemo(() => 30 + rand() * 60, [rand]); // “гуляние” по X
  const freq = useMemo(() => 1.5 + rand() * 2.5, [rand]); // частота “гуляния”
  const phase = useMemo(() => rand() * Math.PI * 2, [rand]);

  // X: пузырь держится слева и чуть уходит вправо/влево волной
  const x = useTransform(scrollYProgress, (p) => {
    const wave = Math.sin(p * Math.PI * 2 * freq + phase) * drift;
    return wave; // px
  });

  // Y: от верха секции до низа секции (в пикселях относительно секции)
  // Подстрой число 900 под длину твоей секции/ощущение скорости
  const y = useTransform(scrollYProgress, (p) => p * 900);

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* Gooey */}
      <svg className="absolute w-0 h-0">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      {/* Один пузырь: абсолют внутри секции */}
      <motion.div
        style={{ x, y, scale, opacity, filter: "url(#goo)" }}
        className="
          pointer-events-none
          absolute top-0 left-0
          z-0
        "
      >
        {/* старт слева за экраном и “влет” */}
        <motion.div
          initial={{ x: -220 }}
          animate={{ x: 20 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="will-change-transform"
        >
          <motion.div
            className="
              w-[220px] h-[220px] lg:w-[320px] lg:h-[320px]
              bg-gradient-to-b from-white/10 via-white/5 to-black/20
              backdrop-blur-2xl
              shadow-2xl
            "
            animate={{
              borderRadius: [
                "55% 45% 60% 40% / 55% 45% 55% 45%",
                "45% 55% 40% 60% / 50% 60% 40% 50%",
                "60% 40% 55% 45% / 45% 55% 50% 60%",
                "55% 45% 60% 40% / 55% 45% 55% 45%",
              ],
              rotate: [0, 6, -4, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}

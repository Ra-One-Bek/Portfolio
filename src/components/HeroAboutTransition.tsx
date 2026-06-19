import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";

export default function HeroAboutTransition() {
  const { scrollYProgress } = useScroll();

  const radius = useTransform(
  scrollYProgress,
  [0, 0.3],
  [0, 150]
    );

    const clipPath = useMotionTemplate`
    circle(${radius}% at 50% 50%)
    `;

  return (
    <section className="relative h-[200vh]">
      <div className="sticky top-0 h-screen">

        {/* Hero */}
        <HeroSection />

        {/* About раскрывается кругом */}
        <motion.div
        className="absolute inset-0"
        style={{
            clipPath,
        }}
        >
            <AboutSection />
        </motion.div>

      </div>
    </section>
  );
}
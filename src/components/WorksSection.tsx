import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import GalleryEnvironment from "./gallery/GalleryEnvironment";
import GalleryRope from "./gallery/GalleryRope";
import HangingProject from "./gallery/HangingProject";
import ProjectDetailOverlay from "./gallery/ProjectDetailOverlay";
import {
  works,
  type Work,
  GALLERY_SPACING_DESKTOP,
  GALLERY_SPACING_MOBILE,
  getRopeTop,
} from "./gallery/worksData";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

function useViewportWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

export default function WorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Work | null>(null);
  const isMobile = useIsMobile();
  const viewportWidth = useViewportWidth();

  const spacing = isMobile ? GALLERY_SPACING_MOBILE : GALLERY_SPACING_DESKTOP;
  const galleryWidth = works.length * spacing;
  const travel = Math.max(0, galleryWidth - viewportWidth + spacing * 0.35);
  const ropeTop = getRopeTop(isMobile);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 140,
    damping: 22,
    mass: 0.35,
  });

  const cameraX = useTransform(scrollYProgress, [0, 1], [spacing * 0.15, -travel]);

  const [walkProgress, setWalkProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setWalkProgress(Math.round(v * 100));
  });

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-stone-900"
      style={{ height: `${Math.max(600, works.length * 105)}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D scene */}
        <div
          className="relative h-full w-full"
          style={{
            perspective: "1500px",
            perspectiveOrigin: "50% 42%",
          }}
        >
          <GalleryEnvironment scrollProgress={scrollYProgress} isMobile={isMobile} />

          {/* Progress indicator */}
          <div className="pointer-events-none absolute left-6 top-8 z-30 hidden sm:block">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/25">
              Gallery walk
            </p>
            <p className="mt-1 text-2xl font-bold text-white/40">
              {String(walkProgress).padStart(2, "0")}%
            </p>
          </div>

          {/* Camera rig */}
          <motion.div
            className="absolute inset-0"
            style={{
              x: cameraX,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="relative h-full"
              style={{
                width: galleryWidth,
                transformStyle: "preserve-3d",
              }}
            >
              

              {works.map((work, i) => (
                <HangingProject
                  key={work.id}
                  work={work}
                  index={i}
                  total={works.length}
                  scrollProgress={scrollYProgress}
                  scrollVelocity={smoothVelocity}
                  spacing={spacing}
                  isMobile={isMobile}
                  isSelected={selectedProject?.id === work.id}
                  onSelect={setSelectedProject}
                />
              ))}
            </div>
          </motion.div>

          {/* Foreground haze layer */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-stone-950/40" />
        </div>
      </div>

      <ProjectDetailOverlay
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

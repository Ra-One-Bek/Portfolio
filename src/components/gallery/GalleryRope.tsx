import {
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ROPE_THICKNESS_DESKTOP, ROPE_THICKNESS_MOBILE } from "./worksData";

type Props = {
  width: number;
  top: string;
  scrollVelocity: MotionValue<number>;
  isMobile: boolean;
};

export default function GalleryRope({
  width,
  top,
  scrollVelocity,
  isMobile,
}: Props) {
  const thickness = isMobile ? ROPE_THICKNESS_MOBILE : ROPE_THICKNESS_DESKTOP;

  const rotZ = useTransform(scrollVelocity, (v) => v * 14);
  const rotX = useTransform(scrollVelocity, (v) => v * 6);
  const springRotZ = useSpring(rotZ, { stiffness: 70, damping: 14, mass: 0.9 });
  const springRotX = useSpring(rotX, { stiffness: 80, damping: 16, mass: 1 });

  return (
    <motion.div
      className="pointer-events-none absolute left-0 z-20"
      style={{
        top,
        width,
        height: thickness,
        rotateZ: springRotZ,
        rotateX: springRotX,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Main rope body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(212,212,216,0.75), rgba(113,113,122,0.55), rgba(82,82,91,0.65))",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.18), 0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      />

      {/* Fiber texture */}
      <div
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 6px, rgba(0,0,0,0.12) 6px 7px)",
        }}
      />

      {/* Soft shadow under rope */}
      <div className="absolute left-0 top-full h-3 w-full bg-gradient-to-b from-black/20 to-transparent blur-sm" />
    </motion.div>
  );
}

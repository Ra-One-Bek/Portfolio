import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Work } from "./worksData";

type Props = {
  project: Work | null;
  onClose: () => void;
};

export default function ProjectDetailOverlay({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Detached panel — tears off strings, flies forward, unfolds */}
          <motion.div
            key={`detail-${project.id}`}
            className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby={`project-title-${project.id}`}
              initial={{
                y: 120,
                scale: 0.42,
                rotateX: 28,
                rotateZ: -8,
                opacity: 0.2,
              }}
              animate={{
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                opacity: 1,
              }}
              exit={{
                y: 140,
                scale: 0.38,
                rotateX: 32,
                rotateZ: 10,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 95,
                damping: 18,
                mass: 0.9,
              }}
              className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/90 shadow-[0_40px_120px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl sm:rounded-3xl"
              style={{
                perspective: "1500px",
                transformStyle: "preserve-3d",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Broken string fragments — fade out on open */}
              <motion.div
                initial={{ opacity: 1, height: 48 }}
                animate={{ opacity: 0, height: 0 }}
                exit={{ opacity: 0.6, height: 32 }}
                transition={{ duration: 0.35 }}
                className="relative overflow-hidden"
              >
                <div className="mx-auto flex h-12 w-48 justify-between px-6">
                  <div className="w-px origin-top rotate-[6deg] bg-gradient-to-b from-zinc-300/40 to-transparent" />
                  <div className="w-px origin-top -rotate-[4deg] bg-gradient-to-b from-zinc-300/40 to-transparent" />
                </div>
              </motion.div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row">
                {/* Visual */}
                <div className="relative shrink-0 lg:w-[58%]">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                      background: `radial-gradient(circle at 20% 20%, ${project.accent}33, transparent 60%)`,
                    }}
                  />
                  <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full flex-col justify-between p-8 sm:p-12"
                        style={{
                          background: `radial-gradient(circle at 25% 15%, ${project.accent}44, #09090b 70%)`,
                        }}
                      >
                        <span className="text-6xl font-bold text-white/15 sm:text-8xl">
                          {project.id}
                        </span>
                        <span className="text-xl text-white/50 sm:text-2xl">
                          {project.title}
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-white/5" />
                  </div>
                </div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: 0.12, duration: 0.4 }}
                  className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-10 lg:w-[42%]"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                    Exhibit {project.id}
                  </p>
                  <h2
                    id={`project-title-${project.id}`}
                    className="mt-3 text-2xl font-bold leading-tight text-white sm:text-4xl"
                  >
                    {project.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                    {project.description}
                  </p>

                  {project.tech.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 sm:text-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={project.github}
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                      GitHub
                    </a>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
                    >
                      Return to gallery
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

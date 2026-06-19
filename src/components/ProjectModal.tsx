import { motion } from "framer-motion";

type ProjectModalProps = {
  open: boolean;
  onClose: () => void;
  project: any;
};

export default function ProjectModal({
  open,
  onClose,
  project,
}: ProjectModalProps) {
  if (!open || !project) return null;

  return (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="
          fixed
          inset-0
          bg-black/70
          backdrop-blur-md
          z-50
        "
        onClick={onClose}
      />

      {/* MODAL */}
      <motion.div
        initial={{ y: "100%", opacity: 0.8 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
        className="
          fixed
          bottom-0
          left-1/2
          -translate-x-1/2

          w-full
          sm:w-[95%]

          max-w-6xl

          h-[92dvh]
          sm:h-[90vh]

          bg-slate-950

          border
          border-white/10

          rounded-t-[32px]
          sm:rounded-t-[40px]

          shadow-[0_-20px_80px_rgba(0,0,0,0.65)]

          z-[60]
          overflow-hidden
        "
      >
        {/* HANDLE */}
        <div className="flex justify-center py-4">
          <div className="w-16 h-1 rounded-full bg-white/20" />
        </div>

        {/* CONTENT */}
        <div
          className="
            overflow-y-auto
            h-full

            px-4
            sm:px-6

            pb-32
            sm:pb-40
          "
        >
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="
                w-full
                rounded-2xl
                sm:rounded-3xl

                border
                border-white/10
              "
            />
          )}

          <h2
            className="
              text-white

              text-2xl
              sm:text-4xl

              font-bold

              mt-6
              sm:mt-8
            "
          >
            {project.title}
          </h2>

          <p
            className="
              text-white/60

              mt-4

              text-sm
              sm:text-base

              leading-relaxed
            "
          >
            {project.description}
          </p>

          {/* Технологии */}
          {project.tech?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {project.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="
                    px-3 py-2

                    rounded-full

                    bg-white/5
                    border border-white/10

                    text-white/70
                    text-sm
                  "
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* APPLE ACTION BAR */}
        <div
          className="
            absolute

            bottom-4
            sm:bottom-6

            left-1/2
            -translate-x-1/2

            w-[92%]
            sm:w-auto

            bg-white/10
            backdrop-blur-3xl

            border
            border-white/10

            rounded-full

            px-3
            sm:px-4

            py-3

            flex
            justify-center
            gap-2
            sm:gap-3
          "
        >
          <button
            className="
              px-3 sm:px-5
              py-2

              rounded-full

              bg-white
              text-black

              text-sm
              sm:text-base

              font-medium
            "
          >
            GitHub
          </button>

          <button
            className="
              px-3 sm:px-5
              py-2

              rounded-full

              bg-white/10
              text-white

              text-sm
              sm:text-base
            "
          >
            View
          </button>

          <button
            onClick={onClose}
            className="
              px-3 sm:px-5
              py-2

              rounded-full

              bg-white/10
              text-white

              text-sm
              sm:text-base
            "
          >
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
}
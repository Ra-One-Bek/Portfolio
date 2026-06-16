import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Work = {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  tech: string[];
};

const works: Work[] = [
  {
    id: "01",
    title: "RaOne online shopping",
    description:
      "AI-powered fashion e-commerce платформа нового поколения с 3D визуализацией и персональными рекомендациями.",
    image: "/img/orbital.jpg",
    github: "#",
    tech: ["React, NestJs"],
  },
  {
    id: "02",
    title: "Aqwa AI",
    description:
      "AI-платформа для изучения экономики с персонализированными курсами и адаптивным обучением.",
    image: "/img/aqwa.jpg",
    github: "#",
    tech: ["React, NestJs"],
  },
  {
    id: "03",
    title: "UberTrack",
    description:
      "AI-платформа аренды грузового транспорта с умным подбором под маршрут и бюджет.",
    image: "/img/nukatrack.jpg",
    github: "#",
    tech: ["React, NestJs"],
  },
  {
    id: "04",
    title: "EyesApp",
    description:
      "Умные очки с AI для навигации, взаимодействия и помощи в реальном мире.",
    image: "/img/pulse.jpg",
    github: "#",
    tech: ["React, NestJs"],
  },
  {
    id: "05",
    title: "KZ Football Analytics",
    description:
      "Аналитика казахстанского футбола с AI-инсайтами и статистикой матчей.",
    image: "/img/aruna.jpg",
    github: "#",
    tech: ["React, NestJs"],
  },
  {
    id: "06",
    title: "PlantCare AI",
    description:
      "Приложение для распознавания растений и заболеваний с помощью AI.",
    image: "/img/nova.jpg",
    github: "#",
    tech: ["Flutter"],
  },
];

export default function WorksSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const total = works.length;

  return (
    <section
      id="work"
      ref={ref}
      className="relative h-[650vh] bg-slate-900"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {works.map((work, i) => {
          const segment = 1 / total;

          const start = i * segment;
          const end = (i + 1) * segment;

          const opacity = useTransform(
            scrollYProgress,
            [start, start + segment * 0.3, end - segment * 0.3, end],
            [0, 1, 1, 0]
          );

          const y = useTransform(
            scrollYProgress,
            [start, end],
            [60, -60]
          );

          const scale = useTransform(
            scrollYProgress,
            [start, start + segment * 0.2, end],
            [0.92, 1, 0.92]
          );

          return (
            <motion.div
              key={work.id}
              style={{ opacity, y, scale }}
              className="
                absolute
                w-full
                max-w-6xl
                px-4 sm:px-6 lg:px-10
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-10 lg:gap-20
                  items-center
                "
              >

                {/* IMAGE */}
                <div className="relative">
                  <div className="absolute -inset-6 sm:-inset-10 bg-blue-500/10 blur-3xl" />

                  <div className="overflow-hidden rounded-2xl sm:rounded-[42px] border border-white/10">
                    <img
                      src={work.image}
                      className="w-full aspect-[16/10] object-cover"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="text-white">

                  <span className="text-white/20 text-4xl sm:text-6xl lg:text-7xl font-bold">
                    {work.id}
                  </span>

                  <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold mt-3 sm:mt-4">
                    {work.title}
                  </h2>

                  <p className="text-white/60 mt-4 sm:mt-8 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed">
                    {work.description}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
                    {work.tech.map((t) => (
                      <span
                        key={t}
                        className="
                          px-3 sm:px-4 py-1 sm:py-2
                          rounded-full
                          bg-white/5
                          border border-white/10
                          text-white/70
                          text-xs sm:text-sm
                        "
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}
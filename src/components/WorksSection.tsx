import { useEffect, useMemo, useState } from "react";

type Work = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tech: string[];
};

export default function WorksSection() {
  const works: Work[] = [
    {
      id: "1",
      title: "Portfolio Website",
      description: "Современный анимированный портфолио-сайт.",
      image: "/img/work1.jpg",
      link: "#",
      tech: ["React", "TypeScript", "Tailwind"],
    },
    {
      id: "2",
      title: "E-commerce Store",
      description: "Интернет-магазин с корзиной и фильтрами.",
      image: "/img/work2.jpg",
      link: "#",
      tech: ["Next.js", "Stripe", "Redux"],
    },
    {
      id: "3",
      title: "Landing Page",
      description: "Адаптивный лендинг с плавными анимациями.",
      image: "/img/work3.jpg",
      link: "#",
      tech: ["React", "GSAP", "SCSS"],
    },
  ];

  const [hovered, setHovered] = useState<string | null>(null);

  // какие карточки уже "появились"
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  // удобнее иметь задержки для stagger
  const delayById = useMemo(() => {
    const map: Record<string, number> = {};
    works.forEach((w, i) => (map[w.id] = i * 120)); // 0ms, 120ms, 240ms...
    return map;
  }, [works]);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-work-card]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (!id) return;

            // помечаем как видимую один раз
            setVisible((prev) => (prev[id] ? prev : { ...prev, [id]: true }));

            // можно перестать наблюдать, чтобы не мигало
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="work"
      className="w-full min-h-screen bg-gradient-to-t from-slate-950 via-slate-950 to-slate-900 py-32 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-5xl lg:text-7xl font-bold">Works</h2>
        <p className="text-white/50 mt-4 text-lg">
          Некоторые из моих последних проектов
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
          {works.map((work) => {
            const isVisible = !!visible[work.id];

            return (
              <div
                key={work.id}
                data-work-card
                data-id={work.id}
                onMouseEnter={() => setHovered(work.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ transitionDelay: `${delayById[work.id] ?? 0}ms` }}
                className={[
                  // твой стиль
                  "group relative rounded-3xl overflow-hidden bg-slate-800/40 border border-white/10 backdrop-blur-md",
                  "transition-all duration-500 hover:scale-[1.03]",

                  // анимация появления
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                ].join(" ")}
              >
                {/* Картинка */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className={[
                      "w-full h-full object-cover transition-all duration-700",
                      hovered === work.id ? "scale-110 blur-sm" : "scale-100",
                      // микро-анимация на hover контейнера
                      "group-hover:rotate-[0.4deg]",
                    ].join(" ")}
                  />

                  {/* Overlay */}
                  <div
                    className={[
                      "absolute inset-0 bg-black/70 flex items-center justify-center transition-all duration-500",
                      hovered === work.id
                        ? "opacity-100"
                        : "opacity-0",
                    ].join(" ")}
                  >
                    <a
                      href={work.link}
                      target="_blank"
                      className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
                    >
                      View Project
                    </a>
                  </div>
                </div>

                {/* Контент */}
                <div className="p-6">
                  <h3 className="text-white text-xl font-semibold">
                    {work.title}
                  </h3>

                  <p className="text-white/60 mt-2 text-sm">
                    {work.description}
                  </p>

                  {/* Технологии */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {work.tech.map((t, i) => (
                      <span
                        key={i}
                        className={[
                          "text-xs px-3 py-1 bg-white/10 border border-white/10 rounded-full text-white/70",
                          "transition-all duration-300",
                          "group-hover:bg-white/15 group-hover:text-white/90",
                        ].join(" ")}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Glow эффект */}
                <div className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-xl -z-10"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

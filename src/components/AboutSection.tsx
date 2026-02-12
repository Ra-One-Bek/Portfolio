import { useEffect, useRef, useState } from "react";
import AboutSkillsCards from "./AboutSkillsCards";
import Background from "./Background";
import BubbleFollower from "./BubbleFollower";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const instrumentCards = [
    { id: 1, title: "React", img: `${import.meta.env.BASE_URL}img/instruments/react-ic.png` },
    { id: 2, title: "Figma", img: `${import.meta.env.BASE_URL}img/instruments/figma-ic.png` },
    { id: 3, title: "Canva", img: `${import.meta.env.BASE_URL}img/instruments/canva-ic.webp` },
    { id: 4, title: "TSX", img: `${import.meta.env.BASE_URL}img/instruments/tsx-ic.png` },
    { id: 5, title: "Chat GPT", img: `${import.meta.env.BASE_URL}img/instruments/gpt-ic.jpg` },
    { id: 6, title: "VS Code", img: `${import.meta.env.BASE_URL}img/instruments/vscode-ic.png` },
  ];


  // прогресс скролла внутри секции (0..1) — микро-скролл эффект
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // About me: слева -> вправо
  const aboutX = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  // section: справа -> влево
  const sectionX = useTransform(scrollYProgress, [0, 1], [90, -90]);

  // чуть “плотнее” эффект: можно добавить лёгкий Y
  const titleY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // анимации для иконок (появление снизу по очереди)
  const gridVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="about" className="relative w-full h-full flex flex-col p-5 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700">
      <Background />
      <BubbleFollower targetRef={sectionRef} />

      <div ref={sectionRef} className="relative z-10 w-full h-screen flex flex-col p-5">
        {/* TOP */}
        <div className="w-full h-1/2 flex items-center justify-center">
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
            <div className="relative">
              {/* About me (parallax left->right) */}
              <motion.div style={{ x: aboutX, y: titleY }}>
                <h1
                  className="
                    text-[52px] lg:text-[74px]
                    font-semibold tracking-tight leading-[0.9]
                    bg-gradient-to-b from-white via-white/80 to-white/30
                    bg-clip-text text-transparent
                    drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                  "
                >
                  About me
                </h1>
              </motion.div>

              {/* section (parallax right->left) */}
              <motion.div style={{ x: sectionX }}>
                <div
                  className="
                    mt-2
                    text-[44px] lg:text-[84px]
                    font-semibold leading-none
                    text-white/20
                    tracking-[0.12em]
                    uppercase
                  "
                >
                  section
                </div>
              </motion.div>

              {/* тонкая линия */}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="w-full h-1/2 flex items-center justify-center gap-8">
          {/* инструменты */}
          <motion.div
            className="grid grid-cols-3 gap-3 max-w-[520px]"
            variants={gridVariants}
            initial="hidden"
            animate={visible ? "show" : "hidden"}
          >
            {instrumentCards.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="
                  group
                  w-16 h-16 lg:w-24 lg:h-24
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                  backdrop-blur-xl
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                  flex items-center justify-center
                  transition-all duration-300
                  hover:bg-white/10 hover:border-white/20 hover:-translate-y-1
                "
                title={item.title}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-9 h-9 lg:w-14 lg:h-14 opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* текст справа */}
          <div className="w-1/2 h-full hidden lg:flex items-center justify-end">
            <div className="p-6 bg-white/[0.04] rounded-2xl border border-white/10 backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
              <p
                className={`
                  max-w-[600px] text-white/55 leading-relaxed
                  transition-all duration-700 delay-200 ease-out
                  ${visible ? "opacity-100 translate-x-0" : "opacity-90 translate-x-0"}
                `}
              >
                <span className="text-white/85 font-medium">Фронтенд-разработчик</span>{" "}
                на React + TypeScript + Tailwind CSS, создающий визуально стильные и современные сайты.
                <br />
                <span className="text-white/70">
                  Фокус — на эстетике, чистой композиции и ощущении «дорогого» интерфейса.
                </span>{" "}
                Красота, адаптивность и аккуратный код работают вместе, чтобы продукт выглядел
                впечатляюще и профессионально.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AboutSkillsCards />
    </section>
  );
}

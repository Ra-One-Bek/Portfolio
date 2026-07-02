import { useEffect, useRef, useState } from "react";
import AboutSkillsCards from "./AboutSkillsCards";
import Background from "./Background";
import BubbleFollower from "./BubbleFollower";
import { motion, useScroll, useTransform, type Variants, easeOut } from "framer-motion";


export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const [cardsOffset, setCardsOffset] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  
  const [handStopPoint, setHandStopPoint] = useState(500);

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      // подбирай коэффициент под себя, например 0.35 от ширины экрана
      setHandStopPoint(vw * 0.26);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  // отдельный, более быстрый прогресс скролла — только для рук
  const { scrollYProgress: handsProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end 80%"],
  });

  const leftHandX = useTransform(
    handsProgress,
    [0, 1],
    [0, handStopPoint],
    { ease: easeOut }
  );

  const rightHandX = useTransform(
    handsProgress,
    [0, 1],
    [0, -handStopPoint],
    { ease: easeOut }
  );

  const leftHandRotate = useTransform(
    handsProgress,
    [0, 1],
    [0, 12]
  );

  const rightHandRotate = useTransform(
    handsProgress,
    [0, 1],
    [0, -12]
  );

  const leftHandStyle = isMobile
    ? {}
    : {
        x: leftHandX,
        rotate: leftHandRotate,
      };

  const rightHandStyle = isMobile
    ? {}
    : {
        x: rightHandX,
        rotate: rightHandRotate,
      };

  // About me: слева -> вправо
  const aboutX = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  // section: справа -> влево
  const sectionX = useTransform(scrollYProgress, [0, 1], [90, -90]);

  // чуть “плотнее” эффект: можно добавить лёгкий Y
  const titleY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  const mobileStartOffset = isMobile ? 10 : 0;

  const cardsY = useTransform(
    scrollYProgress,
    [0, 0.8],
    [-cardsOffset + mobileStartOffset, 0]
  );

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

  useEffect(() => {
    if (!cardsWrapperRef.current) return;

    const rect = cardsWrapperRef.current.getBoundingClientRect();

    setCardsOffset(rect.top + window.scrollY);
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
    <section
      id="about"
      className="relative w-full bg-stone-900 h-full flex flex-col p-5"
    >
      
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
                    text-[32px] sm:text-[42px] lg:text-[56px] xl:text-[74px]
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
                    text-[18px] sm:text-[24px] md:text-[44px] lg:text-[54px] xl:text-[74px]
                    font-semibold leading-none
                    text-white/20
                    tracking-[0.12em]
                    uppercase
                  "
                >
                  PORTFOLIO
                </div>
              </motion.div>

              {/* тонкая линия */}
            </div>
          </div>
        </div>

        <motion.img
          src={`${import.meta.env.BASE_URL}left.png`}
          alt=""
          style={leftHandStyle}
          className="
            absolute
            left-0
            top-[42%]
            -translate-y-1/2
            w-[clamp(120px,45vw,1020px)]
            pointer-events-none
          "
        />

        <motion.img
          src={`${import.meta.env.BASE_URL}right.png`}
          alt=""
          style={rightHandStyle}
          className="
            absolute
            right-0
            top-[42%]
            -translate-y-1/2
            w-[clamp(120px,45vw,1020px)]
            pointer-events-none
            z-[1]
          "
        />

        {/* BOTTOM */}
        <div className="w-full h-1/2 flex lg:flex-row flex-col items-center justify-center gap-8">
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
          <div className="w-8/9 lg:w-1/2 h-full lg:flex items-center justify-end">
            <div className="p-6">
              <p
                className={`
                  max-w-[600px] text-white/55 leading-relaxed
                  transition-all duration-700 delay-200 ease-out
                  lg:text-lg text-sm
                  ${visible ? "opacity-100 translate-x-0" : "opacity-90 translate-x-0"}
                `}
              >
                <span className="text-white/85 font-medium">Креативный разработчик</span>{" "}
                , который объединяет дизайн и код в единый визуальный опыт.
                <br />
                <span className="text-white/70">
                  Создаю современные интерфейсы с акцентом на анимации, эстетику и внимание к деталям.
                </span>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        ref={cardsWrapperRef}
        style={{ y: cardsY }}
      >
        <AboutSkillsCards />
      </motion.div>
    </section>
  );
}
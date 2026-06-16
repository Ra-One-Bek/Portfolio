import { useEffect, useMemo, useState } from "react";

export default function HeroSection() {
  const [y, setY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setY(window.scrollY);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  useEffect(() => {
    let timeout: number;

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 4000;

      timeout = window.setTimeout(() => {
        setBlink(true);

        setTimeout(() => {
          setBlink(false);
          scheduleBlink();
        }, 120);
      }, delay);
    };

    scheduleBlink();

    return () => clearTimeout(timeout);
  }, []);

  // Смещения (0 в начале, дальше растёт)
  const raOneShift = useMemo(() => y * 0.08, [y]);
  const imgShift = useMemo(() => y * -0.15, [y]);    
  const abiyevShift = useMemo(() => y * -0.15, [y]); 
  const circleShift = useMemo(() => y* -0.60, [y]);

  const leftEyeX = (mouse.x - window.innerWidth / 2) * 0.008;
  const leftEyeY = (mouse.y - window.innerHeight / 2) * 0.008;

  const rightEyeX = (mouse.x - window.innerWidth / 2) * 0.01;
  const rightEyeY = (mouse.y - window.innerHeight / 2) * 0.01;

  return (
    <section id="hero" className="relative w-full h-screen bg-gradient-to-t from-slate-700 via-blue-300 to-white-500 overflow-hidden">

      <div 
        className="absolute inset-0 flex items-center justify-center -z-20"
        style={{ transform: `translateY(${circleShift}px)` }}
      >
        <div className="w-100 h-100 lg:w-200 lg:h-200 rounded-full bg-gradient-to-t from-slate-900/0 via-slate-900 to-black"  />
      </div>

      {/* Большой фон-текст */}
      <h1
        className="absolute inset-0 flex items-center justify-center text-7xl lg:text-[240px] text-gray-200 select-none pointer-events-none will-change-transform"
        style={{ transform: `translateY(${raOneShift}px)` }}
      >
        RaOne
      </h1>

      {/* Картинка */}
      <div
        className="absolute inset-0 flex items-center justify-center -translate-y-16 z-10 will-change-transform"
        style={{ transform: `translateY(${imgShift}px)` }} 
      >
        <div className="relative">
          <img
            src={`${import.meta.env.BASE_URL}img/RaOne.png`}
            alt=""
            className="w-[600px] object-contain"
          />

          {/* Правый глаз */}
          <div
            className="
              absolute
              w-6
              h-6
              rounded-full
              bg-white
              flex
              items-center
              justify-center
            "
            style={{
              left: "354px",
              top: "265px",
              transform: blink ? "scaleY(0.1)" : "scaleY(1)",
              transformOrigin: "center",
              transition: "transform 80ms ease",
            }}
          >
            <div
              className="w-3 h-3 rounded-full bg-black"
              style={{
                transform: `translate(${rightEyeX}px, ${rightEyeY}px)`
              }}
            />
          </div>

          {/* Левый глаз */}
          <div
            className="
              absolute
              w-8
              h-8
              rounded-full
              bg-white
              flex
              items-center
              justify-center
            "
            style={{
              left: "326px",
              top: "261px",
              transform: blink ? "scaleY(0.1)" : "scaleY(1)",
              transformOrigin: "center",
              transition: "transform 80ms ease",
            }}
          >
            <div
              className="w-4 h-4 rounded-full bg-black"
              style={{
                transform: `translate(${leftEyeX}px, ${leftEyeY}px)`
              }}
            />
          </div>

        </div>
      </div>

      {/* Передний текст */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full translate-y-20 lg:translate-y-40">
        <h1
          className="text-7xl lg:text-[250px] text-white will-change-transform"
          style={{ transform: `translateY(${abiyevShift}px)` }}
        >
          Abiyev
        </h1>
      </div>

    </section>
  );
}

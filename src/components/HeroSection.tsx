import { useEffect, useMemo, useState } from "react";

export default function HeroSection() {
  const [y, setY] = useState(0);

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

  // Смещения (0 в начале, дальше растёт)
  const raOneShift = useMemo(() => y * 0.08, [y]);
  const imgShift = useMemo(() => y * -0.15, [y]);    
  const abiyevShift = useMemo(() => y * -0.15, [y]); 
  const circleShift = useMemo(() => y* -0.60, [y]);

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
        <img
          src={`${import.meta.env.BASE_URL}img/RaOne.png`}
          alt=""
          className="w-[600px] object-contain"
        />
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

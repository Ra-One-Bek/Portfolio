import { useEffect, useMemo, useState } from "react";

export default function HeroSection() {
  const [y, setY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // плавный коэффициент масштаба картинки+глаз: 1 на широких экранах,
  // линейно уменьшается до 0.55 на самых узких (320px)
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const faceScale = useMemo(() => {
    const min = 320;
    const max = 1024;
    const t = Math.min(1, Math.max(0, (vw - min) / (max - min)));
    return 0.9 + t * 0.45; // 0.55..1
  }, [vw]);

  const eyePositions = useMemo(() => {
    if (isMobile) {
      // return {
      //   leftEye: { left: 198, top: 160 },
      //   rightEye: { left: 225, top: 166 },
      // };

      return {
        leftEye: { left: 205, top: 120 },
        rightEye: { left: 235, top: 126 },
      };
    }

    // return {
    //   leftEye: { left: 326, top: 261 },
    //   rightEye: { left: 354, top: 265 },
    // };

    return {
      leftEye: { left: 336, top: 201 },
      rightEye: { left: 372, top: 207 },
    };
  }, [isMobile]);

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

  const baseX = mouse.x - window.innerWidth / 2;
  const baseY = mouse.y - window.innerHeight / 2;
  const bgRotateY = baseX * 0.008;
  const bgRotateX = baseY * -0.004;

  const bgTranslateX = baseX * 0.015;
  const bgTranslateY = baseY * 0.01;

  const strength = isMobile ? 0.003 : 0.009;

  const leftEyeX = baseX * strength;
  const leftEyeY = baseY * strength * 2;

  const rightEyeX = baseX * strength;
  const rightEyeY = baseY * strength * 2;
  

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 -z-30 will-change-transform"
        style={{
          transform: `
            perspective(2000px)
            rotateY(${bgRotateY}deg)
            rotateX(${bgRotateX}deg)
            translateX(${bgTranslateX}px)
            translateY(${bgTranslateY}px)
            scale(1.08)
          `,
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}mountain-monolisa.jpg`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-stone-900
          via-stone-700/20
          to-slate-700/0
          -z-20
        "
      />

      <div 
        className="absolute inset-0 flex items-center justify-center -z-23"
        style={{ transform: `translateY(${circleShift}px)` }}
      >
        <div
          className="rounded-full bg-gradient-to-t from-slate-900/0 via-stone-900/20 to-stone-900/80"
          style={{
            width: "clamp(300px, 45vw, 800px)",
            height: "clamp(300px, 45vw, 800px)",
          }}
        />
      </div>

      {/* Большой фон-текст */}
      <h1
        className="
          absolute inset-0 flex items-center 
          justify-center lg:z-0 z-11 
          bg-gradient-to-b from-[#fff5d8] via-[#f6ca71] to-black
          bg-clip-text
          text-transparent select-none pointer-events-none 
          will-change-transform
        "
        style={{
          transform: `translateY(${raOneShift}px)`,
          fontSize: "clamp(3.5rem, 18vw, 15rem)",
        }}
      >
        RaOne
      </h1>

      {/* Картинка */}
      <div
        className="absolute inset-0 flex items-center justify-center -translate-y-16 z-10 will-change-transform"
        style={{ transform: `translateY(${imgShift}px)` }} 
      >
        <div
          className="relative"
          style={{ transform: `scale(${faceScale})`, transformOrigin: "center" }}
        >
          <img
            src={`${import.meta.env.BASE_URL}img/raone-monolisa.png`}
            alt=""
            className="max-w-full h-auto object-contain"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 90%, transparent 90%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 80%, transparent 90%)",
            }}
          />

          {/* Правый глаз */}
          <div
            className="
              absolute
              w-5
              h-4
              rounded-[70%]
              -rotate-5
              bg-gradient-to-b from-[#f6f1e7] to-[#d9d2c6]
              flex
              items-center
              justify-center
              overflow-hidden
            "
            style={{
              left: `${eyePositions.rightEye.left}px`,
              top: `${eyePositions.rightEye.top}px`,
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
              h-5
              rounded-[90%_90%_25%_60%]
              rotate-5
              bg-gradient-to-b from-[#f6f1e7] to-[#d9d2c6]
              flex
              items-center
              justify-center
              overflow-hidden
            "
            style={{
              left: `${eyePositions.leftEye.left}px`,
              top: `${eyePositions.leftEye.top}px`,
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full translate-y-14 lg:translate-y-40">
        <h1
          className="text-white will-change-transform"
          style={{
            transform: `translateY(${abiyevShift}px)`,
            fontSize: "clamp(3.5rem, 18.5vw, 15.6rem)",
          }}
        >
          Abiyev
        </h1>
      </div>

    </section>
  );
}
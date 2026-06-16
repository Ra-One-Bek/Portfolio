import { useEffect, useMemo, useRef, useState } from "react";

type SkillCard = {
  id: string;
  title: string;
  backText: string;
  icon?: string;
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function AboutSkillsCards() {
  const cards: SkillCard[] = useMemo(
    () => [
      { id: "1", title: "React", backText: "Hooks, state, composition, routing.", icon: "♠️" },
      { id: "2", title: "TypeScript", backText: "Types, generics, safer refactors.", icon: "♥️" },
      { id: "3", title: "Tailwind", backText: "Responsive UI, fast styling, layout.", icon: "♦️" },
      { id: "4", title: "UI / UX", backText: "Animations, spacing, clean visuals.", icon: "♣️" },
    ],
    []
  );

  const areaRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setIsMobile(mq.matches);
    apply();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    } else {
      mq.addListener(apply);
      return () => mq.removeListener(apply);
    }
  }, []);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const area = areaRef.current;
        if (!area) return;

        const vh = window.innerHeight;
        const r = area.getBoundingClientRect();

        const total = r.height - vh;
        const traveled = -r.top;
        const next = total <= 0 ? 1 : clamp01(traveled / total);
        setP(next);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const n = cards.length;

  const split = isMobile ? 0.72 : 0.65;

  // 👉 ТОЛЬКО уменьшение дистанций на мобилке (ничего не ломаем)
  const spreadX = isMobile ? 70 : 240;
  const spreadY = isMobile ? 14 : 0;
  const fanDeg = isMobile ? 3 : 8;

  const areaHeight = isMobile ? "h-[220vh]" : "h-[320vh]";

  return (
    <section className="w-full">
      <div ref={areaRef} className={`relative ${areaHeight} sm:h-[320vh]`}>
        <div className="sticky top-0 h-screen flex items-center justify-center px-3 sm:px-6">
          <div
            className="relative w-full max-w-3xl"
            style={{ perspective: isMobile ? "1200px" : "1600px" }}
          >
            <div className="relative h-[260px] sm:h-[420px] md:h-[480px]">
              {cards.map((card, i) => {
                const segStart = i / n;
                const segEnd = (i + 1) / n;

                const localRaw = clamp01((p - segStart) / (segEnd - segStart));
                const local = easeInOut(localRaw);

                const spreadPhase = clamp01(local / split);
                const flipPhase = clamp01((local - split) / (1 - split));

                const centerIndex = (n - 1) / 2;
                const offsetFromCenter = i - centerIndex;

                const x = offsetFromCenter * spreadX * spreadPhase;

                const arcY = isMobile
                  ? Math.abs(offsetFromCenter) * spreadY * spreadPhase
                  : 0;

                const fan = offsetFromCenter * fanDeg * spreadPhase;

                const stackY = i * (isMobile ? 3 : 6) * (1 - spreadPhase);
                const stackScale =
                  1 - i * (isMobile ? 0.012 : 0.02) * (1 - spreadPhase);

                const rotY = lerp(0, 180, easeInOut(flipPhase));
                const rotX = lerp(isMobile ? 6 : 10, 0, spreadPhase);

                const z = (n - i) * 10;

                return (
                  <div
                    key={card.id}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${x}px) translateY(${stackY + arcY}px) rotateZ(${fan}deg) scale(${stackScale})`,
                      zIndex: z,
                    }}
                  >
                    <PlayingCard
                      title={card.title}
                      backText={card.backText}
                      icon={card.icon}
                      rotY={rotY}
                      rotX={rotX}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayingCard(props: {
  title: string;
  backText: string;
  icon?: string;
  rotY: number;
  rotX: number;
}) {
  const { title, backText, icon, rotY, rotX } = props;

  return (
    <div
      className="
        relative
        w-[140px] sm:w-[220px] md:w-[240px]
        h-[200px] sm:h-[320px] md:h-[340px]
      "
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
        transition: "transform 70ms linear",
      }}
    >
      {/* FRONT */}
      <div
        className="
          absolute inset-0 rounded-2xl
          bg-white
          border border-slate-200
          shadow-[0_18px_55px_rgba(0,0,0,0.45)]
        "
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="h-full flex flex-col items-center justify-center text-center px-3">
          <div className="text-4xl sm:text-6xl">{icon ?? "♠️"}</div>
          <div className="mt-2 font-semibold text-sm sm:text-xl text-slate-900">
            {title}
          </div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-1">
            Skill card
          </div>
        </div>
      </div>

      {/* BACK */}
      <div
        className="
          absolute inset-0 rounded-2xl
          bg-slate-950
          border border-white/15
          text-white
        "
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="p-3 sm:p-5">
          <div className="font-semibold text-sm sm:text-lg">{title}</div>
          <p className="mt-2 text-[11px] sm:text-sm text-white/80">
            {backText}
          </p>
        </div>
      </div>
    </div>
  );
}
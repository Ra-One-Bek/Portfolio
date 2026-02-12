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
  const [p, setP] = useState(0); // 0..1
  const [isMobile, setIsMobile] = useState(false);

  // ✅ аккуратно: детект мобилки без tailwind hidden и без ломания десктопа
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setIsMobile(mq.matches);
    apply();

    // Safari старый: addListener/removeListener
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    } else {
      // eslint-disable-next-line deprecation/deprecation
      mq.addListener(apply);
      // eslint-disable-next-line deprecation/deprecation
      return () => mq.removeListener(apply);
    }
  }, []);

  // ✅ прогресс скролла внутри секции
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

  // 0..split = разъезд, split..1 = flip
  const split = isMobile ? 0.72 : 0.65;

  // ✅ “вау, но аккуратно”:
  // - на мобилке карты слегка “веером” + немного вниз (чтобы не улетали за экран)
  // - на десктопе поведение полностью как было
  const spreadX = isMobile ? 110 : 240; // было 240 — оставили на десктоп
  const spreadY = isMobile ? 22 : 0;    // мобильный “вниз по дуге”
  const fanDeg = isMobile ? 4 : 8;      // меньше поворот на мобилке

  // высота зоны скролла — меньше на мобилке, десктоп как был
  const areaHeight = isMobile ? "h-[260vh]" : "h-[320vh]";

  return (
    <section className="w-full">
      <div ref={areaRef} className={`relative ${areaHeight} sm:h-[320vh]`}>
        <div className="sticky top-0 h-screen flex items-center justify-center px-3 sm:px-6">
          <div
            className="relative w-full max-w-3xl"
            style={{ perspective: isMobile ? "1200px" : "1600px" }}
          >
            <div className="relative h-[320px] sm:h-[420px] md:h-[480px]">
              {cards.map((card, i) => {
                // сегмент каждой карточки
                const segStart = i / n;
                const segEnd = (i + 1) / n;

                const localRaw = clamp01((p - segStart) / (segEnd - segStart));
                const local = easeInOut(localRaw);

                const spreadPhase = clamp01(local / split);
                const flipPhase = clamp01((local - split) / (1 - split));

                const centerIndex = (n - 1) / 2;
                const offsetFromCenter = i - centerIndex;

                // разъезд по X
                const x = offsetFromCenter * spreadX * spreadPhase;

                // “вау” на мобилке: лёгкая дуга вниз, чтобы карты были видны
                const arcY =
                  isMobile
                    ? Math.abs(offsetFromCenter) * spreadY * spreadPhase
                    : 0;

                // веер
                const fan = offsetFromCenter * fanDeg * spreadPhase;

                // стопка
                const stackY = i * (isMobile ? 5 : 6) * (1 - spreadPhase);
                const stackScale = 1 - i * (isMobile ? 0.018 : 0.02) * (1 - spreadPhase);

                // flip
                const rotY = lerp(0, 180, easeInOut(flipPhase));
                const rotX = lerp(isMobile ? 8 : 10, 0, spreadPhase);

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
        w-[168px] xs:w-[176px] sm:w-[220px] md:w-[240px]
        h-[240px] xs:h-[252px] sm:h-[320px] md:h-[340px]
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
          overflow-hidden
        "
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-[10px] rounded-xl border border-slate-200" />

        {/* верхний угол */}
        <div className="absolute top-3 left-3 flex flex-col items-center leading-none">
          <span className="text-slate-900 font-bold text-base sm:text-lg">A</span>
          <span className="text-lg sm:text-xl">{icon ?? "♠️"}</span>
        </div>

        {/* нижний угол */}
        <div className="absolute bottom-3 right-3 flex flex-col items-center leading-none rotate-180">
          <span className="text-slate-900 font-bold text-base sm:text-lg">A</span>
          <span className="text-lg sm:text-xl">{icon ?? "♠️"}</span>
        </div>

        {/* центр */}
        <div className="h-full flex flex-col items-center justify-center px-4 sm:px-5 text-center">
          <div className="text-5xl sm:text-6xl select-none">{icon ?? "♠️"}</div>
          <div className="mt-2 sm:mt-3 text-slate-900 font-semibold text-base sm:text-xl">
            {title}
          </div>
          <div className="mt-1.5 sm:mt-2 text-slate-500 text-[11px] sm:text-sm">
            Skill card
          </div>
        </div>

        <div className="absolute -top-20 -left-24 w-72 h-72 bg-slate-200/50 rotate-12 blur-2xl" />
      </div>

      {/* BACK */}
      <div
        className="
          absolute inset-0 rounded-2xl
          border border-white/15
          bg-slate-950
          shadow-[0_18px_55px_rgba(0,0,0,0.45)]
          overflow-hidden
        "
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_40%)]" />
          <div className="absolute inset-[14px] rounded-xl border border-white/10" />
          <div className="absolute inset-[24px] rounded-lg border border-white/10" />
        </div>

        <div className="relative h-full px-4 sm:px-5 py-5 sm:py-6 flex flex-col">
          <div className="text-white font-semibold text-base sm:text-lg">{title}</div>
          <div className="mt-2 text-white/70 text-xs sm:text-sm">----------------</div>

          <p className="mt-3 sm:mt-4 text-white/85 leading-relaxed text-[12px] sm:text-sm">
            {backText}
          </p>
        </div>
      </div>
    </div>
  );
}

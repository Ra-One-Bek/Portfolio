import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

function ContactSection() {
  const cardRef = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 120,
    damping: 20,
  })

  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 20,
  })


 const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()

    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5

    x.set(px)
    y.set(py)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <main id="contact" className="min-h-screen bg-stone-950 overflow-hidden flex items-center justify-center p-6">

      <div className="[perspective:2000px]">
        <motion.section
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={{
            rotateX,
            rotateY,
            perspective: 2000,
          }}
          className="
            relative
            w-full
            max-w-[500px]
            overflow-hidden
            rounded-[8px]
            border
            border-[#82633f]
            bg-[#e8dbc2]
            p-10
            text-center
            shadow-[0_40px_100px_rgba(0,0,0,0.35)]
            transition-transform
            duration-150
            ease-out
            will-change-transform
          "
        >

          {/* parchment texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(120,90,40,.12), transparent 30%),
                radial-gradient(circle at 80% 70%, rgba(90,60,20,.10), transparent 40%)
              `,
            }}
          />

          {/* old paper vignette */}
          <div className="absolute inset-0 border-[8px] border-[#c8b28d]/50 pointer-events-none" />
          

          {/* shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: useTransform(
                [x, y],
                ([vx, vy]) => `
                  radial-gradient(
                    circle at ${(vx as number + 0.5) * 100}% ${(vy as number + 0.5) * 100}%,
                    rgba(120,90,40,.15),
                    transparent 30%
                  )
                `
              ),
            }}
          />

          <div className="relative z-10">

            <div
              className="
                mx-auto
                mb-6
                grid
                h-[100px]
                w-[100px]
                place-items-center
                rounded-full
                border-2
                border-[#7d6036]
                text-[40px]
                font-serif
                text-[#5c4323]
                bg-[#eadcc0]
              "
            >
              R
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-orange-500">
              Digital Business Card
            </p>

            <h1 className="text-[44px] font-extrabold">
              Rauanbek
            </h1>

            <p className="mt-3 text-lg font-semibold text-[#5f5a52]">
              Creative Frontend Developer / Designer
            </p>

            <p className="mt-6 leading-relaxed text-[#6f675c]">
              Я создаю современные интерфейсы,
              интерактивные сайты и digital-продукты.
            </p>

            <div className="mt-7 grid gap-3">

              <a
                href="https://wa.me/77789633405"
                className="
                  rounded-[18px]
                  bg-gradient-to-br
                  from-orange-400
                  to-pink-500
                  px-5
                  py-4
                  font-extrabold
                  text-white
                  transition
                  hover:scale-[1.02]
                "
              >
                Написать на whatsapp
              </a>

              <a
                href="tel:+77789633405"
                className="
                  rounded-[18px]
                  bg-[#fff0d9]
                  px-5
                  py-4
                  font-extrabold
                "
              >
                Позвонить
              </a>

            </div>

            <div className="mt-7 flex justify-center gap-5">

              <a
                href="https://t.me/gucc1_prado"
                target="_blank"
                className="font-bold text-sky-500"
              >
                Telegram
              </a>

              <a
                href="https://instagram.com/ab1yev__"
                target="_blank"
                className="font-bold text-violet-400"
              >
                Instagram
              </a>

              <a
                href="mailto:helloaktau@gmail.com"
                target="_blank"
                className="font-bold text-green-500"
              >
                mail
              </a>

              <a
                href="https://github.com/Ra-One-Bek/"
                target="_blank"
                className="font-bold text-orange-500"
              >
                GitHub
              </a>

            </div>

          </div>
        </motion.section>
      </div>

    </main>
  )
}

export default ContactSection
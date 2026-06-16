import { useRef, useState } from "react"

function ContactSection() {
  const cardRef = useRef<HTMLElement>(null)

  const [style, setStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    x: 50,
    y: 50,
  })

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current

    if (!card) return

    const rect = card.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = ((x - centerX) / centerX) * 10
    const rotateX = -((y - centerY) / centerY) * 10

    setStyle({
      rotateX,
      rotateY,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const reset = () => {
    setStyle({
      rotateX: 0,
      rotateY: 0,
      x: 50,
      y: 50,
    })
  }

  return (
    <main id="contact" className="min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center p-6">

      <div className="[perspective:2000px]">
        <section
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={{
            transform: `
              rotateX(${style.rotateX}deg)
              rotateY(${style.rotateY}deg)
              translateZ(0)
            `,
          }}
          className="
            relative
            w-full
            max-w-[430px]
            overflow-hidden
            rounded-[32px]
            border
            border-white/80
            bg-white/75
            p-8
            text-center
            backdrop-blur-xl
            shadow-[0_30px_80px_rgba(90,64,38,0.16)]
            transition-transform
            duration-150
            ease-out
            will-change-transform
          "
        >
          {/* glow */}
          <div
            className="
              absolute
              -inset-[40%]
              pointer-events-none
              opacity-60
              blur-3xl
            "
            style={{
              background: `
                radial-gradient(
                  circle at ${style.x}% ${style.y}%,
                  rgba(255,170,120,.55),
                  transparent 35%
                )
              `,
            }}
          />

          {/* shine */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at ${style.x}% ${style.y}%,
                  rgba(255,255,255,.7),
                  transparent 20%
                )
              `,
            }}
          />

          <div className="relative z-10">

            <div className="
              mx-auto
              mb-5
              grid
              h-[92px]
              w-[92px]
              place-items-center
              rounded-[28px]
              bg-gradient-to-br
              from-orange-400
              to-pink-500
              text-[42px]
              font-extrabold
              text-white
              shadow-[0_18px_35px_rgba(255,92,138,.32)]
            ">
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
              Привет! Я создаю современные интерфейсы,
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
        </section>
      </div>

    </main>
  )
}

export default ContactSection
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
} from "framer-motion";

const navItems = ["About", "Works", "Contact"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (value) => {
      setCompact(value > 60);
    });

    return () => unsubscribe();
  }, [scrollY]);

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 15 + 10,
      })),
    []
  );

  const logoVariants = {
    hero: {
      scale: 1,
      y: -100,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },

    header: {
      scale: 0.25,
      y: -240,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      <RenaissanceBlueprints particles={particles} />

      {/* HEADER */}

      <motion.header
        animate={{
          opacity: compact ? 1 : 0,
          y: compact ? 0 : -30,
        }}
        transition={{
          duration: 0.7,
        }}
        className="
          fixed
          top-0
          left-0
          z-50
          w-full
          px-4
          py-4
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            rounded-full
            
            px-6
            py-4
          "
        >
          <div className="flex items-center justify-between">
            <motion.a
              href="#"
              whileHover={{
                scale: 1.03,
              }}
              className="
                text-2xl
                font-semibold
                tracking-[0.25em]
                text-amber-200
                cursor-pointer
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Portfolio
            </motion.a>

            <nav className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{
                    y: -2,
                  }}
                  className="
                    relative
                    uppercase
                    tracking-[0.3em]
                    text-sm
                    text-amber-100/80
                    transition-colors
                    hover:text-amber-300
                  "
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            <ArtBurger
              open={menuOpen}
              setOpen={setMenuOpen}
            />
          </div>
        </div>
      </motion.header>

      {/* HERO LOGO */}

      <motion.div
        variants={logoVariants as any}
        animate={compact ? "header" : "hero"}
        className="
          fixed
          left-1/2
          top-[18vh]
          z-40
          -translate-x-1/2
          pointer-events-none
        "
      >
        <div className="relative">
          <div
            className="
              absolute
              inset-0
              blur-[90px]
              bg-amber-400/20
            "
          />

          {/* circles */}

          <div className="absolute inset-0">
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[min(260px,70vw)]
                w-[min(260px,70vw)]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-amber-300/20
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[min(420px,92vw)]
                w-[min(420px,92vw)]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-amber-300/10
              "
            />
          </div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.4,
            }}
            className="
              relative
              text-center
              text-[clamp(5rem,11vw,10rem)]
              font-semibold
              tracking-[0.12em]
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            <span
              className="
                bg-gradient-to-b
                from-[#fff5d8]
                via-[#f6ca71]
                to-[#ae7b1f]
                bg-clip-text
                text-transparent
              "
            >
              ra
            </span>
          </motion.h1>

          <div
            className="
              mt-4
              text-center
              text-xs
              uppercase
              tracking-[0.8em]
              text-amber-100/60
            "
          >
            
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-amber-300/30" />
            <div className="h-2 w-2 rounded-full bg-amber-300/60" />
            <div className="h-px w-20 bg-amber-300/30" />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <GalleryMenu
            close={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};

function RenaissanceBlueprints({
  particles,
}: {
  particles: Particle[];
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-2
        overflow-hidden
        pointer-events-none
      "
    >
      <div
        className="
          absolute
          inset-0
        "
      />

      <svg
        className="
          absolute
          inset-0
          h-full
          w-full
          opacity-[0.08]
        "
      >
        <line
          x1="0"
          y1="20%"
          x2="100%"
          y2="20%"
          stroke="#D8A44A"
          strokeWidth="1"
        />

        <line
          x1="0"
          y1="75%"
          x2="100%"
          y2="75%"
          stroke="#D8A44A"
          strokeWidth="1"
        />

        <line
          x1="15%"
          y1="0"
          x2="15%"
          y2="100%"
          stroke="#D8A44A"
          strokeWidth="1"
        />

        <line
          x1="85%"
          y1="0"
          x2="85%"
          y2="100%"
          stroke="#D8A44A"
          strokeWidth="1"
        />

        <circle
          cx="50%"
          cy="50%"
          r="280"
          fill="none"
          stroke="#D8A44A"
          strokeWidth="1"
        />

        <circle
          cx="50%"
          cy="50%"
          r="420"
          fill="none"
          stroke="#D8A44A"
          strokeWidth="1"
        />
              <path
          d="
          M 220 250
          C 300 180, 450 180, 520 250
          "
          fill="none"
          stroke="#D8A44A"
          strokeWidth="1"
        />

        <path
          d="
          M 1400 650
          C 1500 550, 1700 550, 1800 650
          "
          fill="none"
          stroke="#D8A44A"
          strokeWidth="1"
        />
      </svg>

      {/* paper texture */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.04]
        "
        style={{
          backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,.4), transparent 30%),
          radial-gradient(circle at 80% 30%, rgba(255,255,255,.2), transparent 35%),
          radial-gradient(circle at 60% 80%, rgba(255,255,255,.3), transparent 40%)
        `,
        }}
      />

      {/* dust */}

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="
            absolute
            rounded-full
            bg-amber-100/30
          "
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.1, 0.8, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ArtBurger({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="
        relative
        h-12
        w-12
        md:hidden
      "
    >
      <motion.span
        animate={
          open
            ? {
                rotate: 45,
                y: 8,
              }
            : {
                rotate: 0,
                y: 0,
              }
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="
          absolute
          left-2
          top-3
          h-px
          w-8
          bg-amber-300
        "
      />

      <motion.span
        animate={{
          opacity: open ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
          absolute
          left-2
          top-6
          h-px
          w-8
          bg-amber-300
        "
      />

      <motion.span
        animate={
          open
            ? {
                rotate: -45,
                y: -8,
              }
            : {
                rotate: 0,
                y: 0,
              }
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="
          absolute
          left-2
          top-9
          h-px
          w-8
          bg-amber-300
        "
      />
    </button>
  );
}

function GalleryMenu({
  close,
}: {
  close: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-[30px]
      "
    >
      <motion.div
        initial={{
          scale: 0.94,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.96,
          opacity: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          flex
          h-full
          w-full
          flex-col
          items-center
          justify-center
        "
      >
        <button
          onClick={close}
          className="
            absolute
            right-8
            top-8
            text-amber-200
            uppercase
            tracking-[0.3em]
          "
        >
          Close
        </button>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            mb-20
            text-[18vw]
            font-semibold
            tracking-[0.1em]
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          <span
            className="
              bg-gradient-to-b
              from-[#fff7de]
              via-[#f3c96f]
              to-[#af7b21]
              bg-clip-text
              text-transparent
            "
          >
            RaOne
          </span>
        </motion.div>

        <div className="flex flex-col gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.15,
              }}
              onClick={close}
              className="
                group
                relative
                text-center
                text-4xl
                uppercase
                tracking-[0.35em]
                text-amber-100
              "
            >
              {item}

              <span
                className="
                  absolute
                  left-0
                  top-full
                  h-px
                  w-0
                  bg-amber-300
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />
            </motion.a>
          ))}
        </div>

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[70vw]
            w-[70vw]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-amber-300/10
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[40vw]
            w-[40vw]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-amber-300/10
          "
        />
      </motion.div>
    </motion.div>
  );
}
      
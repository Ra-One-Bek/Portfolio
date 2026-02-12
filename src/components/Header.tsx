import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const activeClass = (id: string) =>
    active === id
      ? "px-5 py-2 bg-blue-900 rounded-full scale-110 transition-all duration-300"
      : "px-5 py-2 bg-slate-900 rounded-full hover:scale-105 transition-all duration-300";

  return (
    <header className="fixed w-screen z-50">
      
      {/* ---------------- MOBILE VERSION ---------------- */}
      <div className="flex lg:hidden items-center justify-between p-5 bg-slate-900">
        <a href="#hero">
          <img
            src={`${import.meta.env.BASE_URL}img/AR.ico`}
            alt="logo"
            className="w-10 h-10 rounded-full"
          />
        </a>

        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-slate-900 text-white flex flex-col items-center gap-6 py-6 transition-all duration-300">
          <a onClick={() => setIsOpen(false)} href="#about">
            about
          </a>
          <a onClick={() => setIsOpen(false)} href="#work">
            works
          </a>
          <a onClick={() => setIsOpen(false)} href="#contact">
            contact
          </a>
        </div>
      )}

      {/* ---------------- DESKTOP VERSION (НЕ ТРОГАЕМ) ---------------- */}
      <div className="hidden lg:flex w-screen bg-slate-900/0 h-20 rounded-sm items-center justify-between gap-10 p-5">
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center ml-5 mt-20">
          <a href="#hero">
            <img
                src={`${import.meta.env.BASE_URL}img/AR.ico`}
                alt=""
                className="rounded-full cursor-pointer"
            />

          </a>
        </div>

        <div className="px-7 flex flex-col items-center justify-center rounded-full mr-5 mt-30 cursor-crosshair">
          <ul className="flex flex-col gap-3 text-white">
            <li className={activeClass("about")}>
              <a href="#about">about</a>
            </li>

            <li className={activeClass("work")}>
              <a href="#work">works</a>
            </li>

            <li className={activeClass("contact")}>
              <a href="#contact">contact</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

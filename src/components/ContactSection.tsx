export default function ContactSection() {
  const base = import.meta.env.BASE_URL;

    const icons = [
        { id: 1, title: "Whatsapp", img: `${base}img/contact/whatsapp-ic.webp`, link: "https://wa.me/77789633405", },
        { id: 2, title: "Telegram", img: `${base}img/contact/telegram-ic.png`, link: "https://t.me/gucc1_prado", },
        { id: 3, title: "Instagram", img: `${base}img/contact/instagram-ic.webp`, link: "https://instagram.com/ab1yev__",},
    ];


  return (
    <section id="contact" className="w-full min-h-screen bg-gradient-to-t from-blue-950 via-slate-950 to-slate-950 flex items-center justify-center px-6">
      
      {/* Glass Card */}
      <div className="w-full max-w-4xl bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-purple-600/30 
                      backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/20 
                      p-10 md:p-16 flex flex-col items-center text-center gap-6">

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold 
                       bg-gradient-to-t from-purple-500 via-pink-400 to-white 
                       bg-clip-text text-transparent">
          Contact Me
        </h1>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-white rounded-full"></div>

        {/* Contact Info */}
        <div className="text-gray-300 space-y-2 text-lg">
          <p className="hover:text-white transition">📞 +7 778 963 3405</p>
          <p className="hover:text-white transition">📧 rauanbek05@icloud.com</p>
          <p className="hover:text-white transition">📧 helloaktau@gmail.com</p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 mt-6">
          {icons.map((item) => (
            <div
              key={item.id}
              onClick={() => window.open(item.link, "_blank")}
              className="w-16 h-16 flex items-center justify-center 
                         bg-white/10 rounded-2xl 
                         hover:bg-purple-500/30 
                         hover:scale-110 
                         transition-all duration-300 
                         cursor-pointer shadow-lg"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-12 h-12 object-contain"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

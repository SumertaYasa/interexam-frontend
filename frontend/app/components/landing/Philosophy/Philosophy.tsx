import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { setNavbarOriginal, setNavbarWhite } from "~/utils/navColor";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    id: 1,
    for: "untuk pembelajar",
    title: "fokus pada arah, bukan gangguan",
    description:
      "Kami membantu kamu menemukan arah yang jelas dalam perjalanan belajar. Setiap latihan, setiap tantangan, kami rancang agar kamu tetap terarah menuju tujuan tanpa kehilangan semangat di tengah distraksi.",
  },
  {
    id: 2,
    for: "untuk pejuang ujian",
    title: "ketenangan membawa ketepatan",
    description:
      "InterExam menciptakan ruang belajar yang menenangkan. Dengan pendekatan yang lembut namun terarah, kami bantu kamu menghadapi ujian tanpa tekanan. hanya fokus, ritme, dan keyakinan.",
  },
  {
    id: 3,
    for: "untuk perkembangan berkelanjutan",
    title: "kemajuan kecil yang terus terasa",
    description:
      "InterExam mendukung kamu membangun kemajuan yang stabil dari hari ke hari. Setiap hasil, setiap perbaikan, kami olah menjadi wawasan yang membantu kamu melihat pertumbuhanmu dengan lebih jelas. Tidak perlu lompatan besar—cukup langkah kecil yang konsisten, dan kamu akan melihat seberapa jauh kamu telah melangkah.",
  },
];

function Philosophy() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const cardEls = wrap.querySelectorAll(".card-item");

    ScrollTrigger.create({
      trigger: wrap,
      start: "top center",
      end: "bottom center",

      onEnter: () => {
        // langsung kasih warna gelap supaya tidak ada tint kuning
        gsap.set(wrap, { backgroundColor: "#02010F" });

        gsap.to(wrap, {
          "--color-background":
            "linear-gradient(135deg, #02010F 0%, #0F1988 50%, #4E7CF3 100%)",
          duration: 0.5,
          ease: "power2.out",
        });

        setNavbarWhite();
      },

      onEnterBack: () => {
        gsap.set(wrap, {
          backgroundColor: "#ffffff",
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(wrap, {
          "--color-background":
            "linear-gradient(135deg, #02010F 0%, #0F1988 50%, #4E7CF3 100%)",
          duration: 0.5,
          ease: "power2.out",
        });

        setNavbarWhite();
      },

      onLeave: () => {
        gsap.to(wrap, {
          "--color-background": "#ffffff",
          duration: 0.5,
        });
        setNavbarOriginal();
      },

      onLeaveBack: () => {
        gsap.to(wrap, {
          "--color-background": "#ffffff",
          duration: 0.5,
        });
        setNavbarOriginal();
      },
    });

    ScrollTrigger.create({
      trigger: wrap,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        gsap.set(cardEls, {
          y: 50 * p,
          scale: 1 - 0.06 * p,
        });
      },
    });
  });

  return (
    <div
      ref={wrapRef}
      style={{ background: "var(--color-background, #fff)" }}
      className="transition-[background] duration-300"
    >
      <div className="mx-5 pt-[100px] md:pt-[120px] md:mx-7-5 relative">
        <div className="flex flex-col items-center">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="card-item sticky w-full flex flex-col md:flex-row justify-between items-center gap-7-5 
                rounded-2xl p-6 bg-primary/40 backdrop-blur-xl border border-primary/10 
                shadow-lg mb-[160px]"
              style={{
                top: "120px",
                zIndex: 20 + index,
              }}
            >
              <div className="text-white max-w-[650px]">
                <div className="flex gap-2.5 mb-3">
                  <span className="font-mono opacity-70">0{card.id}</span>
                  <p className="uppercase tracking-wider text-sm font-medium">
                    {card.for}
                  </p>
                </div>
                <h2 className="text-[20px] md:text-3xl font-bold mb-4 capitalize leading-tight">
                  {card.title}
                </h2>
                <p className="w-full text-body-xs-demilight text-gray-100 text-wrap text-justify">
                  {card.description}
                </p>
              </div>

              <div className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-secondary/80 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Philosophy;

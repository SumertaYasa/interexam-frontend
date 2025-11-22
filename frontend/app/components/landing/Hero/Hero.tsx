import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Hero() {
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const textRef = useRef(null); // Teks Judul Lama
  const scrollTextContainerRef = useRef(null); // Container Teks Baru

  useGSAP(
    () => {
      // Ambil semua elemen teks baru (children dari container)
      // Kita gunakan selector class '.scroll-text-item' agar spesifik
      const textItems = gsap.utils.toArray(
        ".scroll-text-item"
      ) as HTMLDivElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          // Perpanjang durasi scroll agar cukup untuk membaca semua teks
          // Rumus kasar: 1000px (video) + (1000px * jumlah teks)
          end: "+=4000",
          scrub: true,
          pin: true,
        },
      });

      // --- BABAK 1: VIDEO ZOOM ---
      tl.to(videoContainerRef.current, {
        y: -400, // Naik ke atas (karena top awalnya 400px)
        width: "100%",
        height: "100vh",
        borderRadius: 0,
        duration: 1, // Durasi relatif
      });

      // Judul lama hilang
      tl.to(textRef.current, { y: 150, opacity: 0, duration: 1 }, "<");

      // --- BABAK 2: TEKS FOKUS BERGANTIAN ---

      // Loop setiap item teks untuk membuat animasi masuk/keluar
      textItems.forEach((item, index) => {
        // 1. ANIMASI MASUK (Active)
        // Teks ini muncul dari bawah, menjadi putih terang, posisi tengah
        tl.to(item, {
          opacity: 1,
          y: 0, // Ke posisi tengah (reset translate)
          color: "#ffffff", // Putih Terang
          duration: 1,
          ease: "power2.out",
        });

        // Jika ini BUKAN item pertama, kita harus "membuang" item sebelumnya
        if (index > 0) {
          const previousItem = textItems[index - 1];

          // Animasi KELUAR item sebelumnya (Inactive)
          // Jalan BERSAMAAN ("<") dengan masuknya item sekarang
          tl.to(
            previousItem,
            {
              opacity: 0,
              y: -200, // Geser naik ke atas sedikit
              color: "#6b7280", // Jadi abu-abu (Tailwind gray-500)
              duration: 0.8,
            },
            "<"
          ); // <--- Tanda ini bikin mereka jalan bareng
        }

        // 2. JEDA BACA
        // Tambahkan dummy animation agar teks diam sebentar biar sempat dibaca user
        // sebelum user scroll lagi untuk teks berikutnya
        tl.to({}, { duration: 1 });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-white"
    >
      {/* Judul Lama */}
      <div
        ref={textRef}
        className="absolute z-20 top-[150px] ml-[var(--spacing-7-5)] flex flex-col gap-[var(--spacing-2)]"
      >
        <h1 className="text-heading-1 bg-primary w-fit text-white p-1">
          Ujian Lebih Siap,
        </h1>
        <h1 className="text-heading-1 bg-primary w-fit text-white p-1">
          Hasil Lebih Maksimal
        </h1>
      </div>

      {/* Video Container */}
      <div
        ref={videoContainerRef}
        className="absolute z-40 top-[400px] left-1/2 -translate-x-1/2 overflow-hidden w-[95%] h-[60vh] rounded-[var(--radius-card-sm)]"
      >
        <video
          src="/interexam-video.mp4"
          className="w-full h-full object-cover bg-center"
          autoPlay
          muted
          loop
        ></video>

        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* CONTAINER TEKS BARU */}
        <div
          ref={scrollTextContainerRef}
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 font-noto-sans"
        >
          {/* Item Teks:
              - Awalnya opacity 0 (sembunyi)
              - translate-y-[50px] (ada di bawah dikit)
              - absolute (agar semua menumpuk di titik tengah yang sama)
            */}

          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-1 w-[80%]">
            Kami percaya, persiapan menumbuhkan keyakinan.
          </h1>

          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-1 w-[80%]">
            Setiap soal, setiap latihan, membentuk cara berpikir yang lebih
            tajam.
          </h1>

          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-1 w-[80%]">
            Dari latihan menuju kemajuan, InterExam mendampingi setiap
            langkahmu.
          </h1>

          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-1 w-[80%]">
            Hingga tiba hari ujian, kamu sudah lebih siap dari sebelumnya.
          </h1>
        </div>
      </div>
    </section>
  );
}

export default Hero;

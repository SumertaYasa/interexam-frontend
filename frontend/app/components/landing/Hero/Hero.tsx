import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setNavbarOriginal, setNavbarWhite } from "~/utils/navColor";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Hero() {
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      setNavbarOriginal();
      window.scrollTo(0, 0);

      const textItems = gsap.utils.toArray(
        ".scroll-text-item"
      ) as HTMLDivElement[];

      // scroll tigger main
      const tl = gsap.timeline({
        id: "hero-timeline",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000",
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(videoContainerRef.current, {
        y: -400,
        width: "100%",
        height: "100vh",
        borderRadius: 0,
        duration: 1,
      });

      tl.to(textRef.current, { y: 150, duration: 1 }, "<");

      textItems.forEach((item, index) => {
        tl.to(item, {
          opacity: 1,
          y: 0,
          color: "#ffffff",
          duration: 1,
          ease: "power2.out",
        });

        if (index > 0) {
          const previous = textItems[index - 1];

          tl.to(
            previous,
            {
              opacity: 0,
              y: -200,
              color: "#6b7280",
              duration: 1,
            },
            "<"
          );
        }

        tl.to({}, { duration: 1 });
      });

      // scroll trigger untuk navbar
      ScrollTrigger.create({
        trigger: videoContainerRef.current,
        start: "top top",
        end: "+=4000",
        onEnter: () => setNavbarWhite(),
        onEnterBack: () => setNavbarWhite(),
        onLeave: () => setNavbarOriginal(),
        onLeaveBack: () => setNavbarOriginal(),
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-white"
    >
      <div
        ref={textRef}
        className="absolute z-20 top-[150px] ml-[var(--spacing-5)] md:ml-[var(--spacing-7-5)] flex flex-col gap-[var(--spacing-2)]"
      >
        <h1 className="text-[30px] md:text-heading-1 bg-primary w-fit text-white p-1">
          Ujian Lebih Siap,
        </h1>
        <h1 className="text-[30px] md:text-heading-1 bg-primary w-fit text-white p-1">
          Hasil Lebih Maksimal
        </h1>
      </div>

      <div
        ref={videoContainerRef}
        className="absolute z-40 top-[400px] left-1/2 -translate-x-1/2 overflow-hidden w-[90%] md:w-[95%] h-full rounded-[var(--radius-card-sm)]"
      >
        <video
          src="/interexam-video.mp4"
          className="w-full h-full object-cover bg-center"
          autoPlay
          muted
          loop
        ></video>

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 font-noto-sans font-semibold">
          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-3 md:text-heading-1 w-[80%]">
            Kami percaya, persiapan menumbuhkan keyakinan.
          </h1>

          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-3 md:text-heading-1 w-[80%]">
            Setiap soal, setiap latihan, membentuk cara berpikir yang lebih
            tajam.
          </h1>

          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-3 md:text-heading-1 w-[80%]">
            Dari latihan menuju kemajuan, InterExam mendampingi setiap
            langkahmu.
          </h1>

          <h1 className="scroll-text-item absolute opacity-0 translate-y-[100px] text-heading-3 md:text-heading-1 w-[80%]">
            Hingga tiba hari ujian, kamu sudah lebih siap dari sebelumnya.
          </h1>
        </div>
      </div>
    </section>
  );
}

export default Hero;

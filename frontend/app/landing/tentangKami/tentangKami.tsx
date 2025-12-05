import React from "react";
import Navbar from "~/components/landing/Navbar/Navbar";

function tentangKami() {
  return (
    <div>
      <Navbar />
      <section className="absolute z-20 top-[100px] md:top-[150px] w-full">
        <div className="flex justify-center flex-col items-center mx-7-5 mb-7-5">
          <h1 className="text-heading-3 font-bold mb-7-5">Tentang Kami</h1>
          <div className="flex flex-col md:flex-row gap-5">
            <img
              src="./person.jpg"
              alt="person preview"
              className="w-[200px] h-[250px] md:w-full md:h-full"
            />
            <div>
              <div className="flex flex-col md:flex-row md:items-center">
                <h2 className="text-heading-3 font-sora font-semibold">
                  Belajar dengan ritme, berkembang dengan arah.
                </h2>
                <img
                  src="./interlace-logo.jpg"
                  alt="intelace logo"
                  className="w-[200px] md:w-full h-full"
                />
              </div>
              <p className="mb-5 text-body-s-regular md:w-[80%] text-justify">
                Kami percaya bahwa teknologi bukan sekadar alat, tapi jembatan
                menuju kemajuan. Interlace lahir dari semangat untuk menciptakan
                produk digital yang mempermudah perjalanan belajar dan bekerja
                manusia modern.
                <br /> <br />
                Sejak berdiri, Interlace terus berfokus mengembangkan pengalaman
                digital yang intuitif, efisien, dan penuh makna.
                <br /> <br />
                Pada tahun 2025, Interlace menghadirkan InterExam — platform
                latihan dan ujian berbasis web yang dirancang untuk membantu
                siswa dan pelajar menilai kemampuan mereka secara mandiri.
                <br />
                Melalui tampilan yang sederhana, data pembelajaran yang akurat,
                dan pendekatan yang humanis, InterExam menjadi wujud nyata visi
                kami:
              </p>
              <q className="border-l text-body-xs-demilight p-1 ">
                Membuat proses belajar terasa lebih dekat, terukur, dan
                menyenangkan.
              </q>
              <img
                src="./interexam-logo.jpg"
                alt="interexam logo"
                className="w-[200px] md:w-[350px] mt-7-5"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default tentangKami;

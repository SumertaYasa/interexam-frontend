import React from "react";
import { NavLink } from "react-router";
import Navbar from "~/components/landing/Navbar/Navbar";

const cardsPrice = [
  {
    id: 1,
    title: "Paket fokus",
    for: "Untuk yang baru memulai ritme belajar.",
    price: "29.000",
    link: "",
    backgroundTheme: "#ffffff",
    cardTheme:
      "linear-gradient(146deg,rgba(255, 148, 148, 1) 0%, rgba(173, 46, 185, 1) 50%)",
    features: [
      { id: 1, feature: "Akses ke semua latihan dasar" },
      { id: 2, feature: "Statistik performa mingguan" },
      { id: 3, feature: "Simpan hingga 5 hasil latihan" },
    ],
  },
  {
    id: 2,
    title: "Paket konsisten",
    for: "Untuk yang ingin menjaga progres dan performa.",
    price: "59.000",
    link: "",
    backgroundTheme:
      "linear-gradient(146deg,rgba(62, 19, 143, 1) 0%, rgba(234, 156, 255, 1) 50%)",
    cardTheme:
      "linear-gradient(146deg,rgba(207, 148, 255, 1) 0%, rgba(255, 255, 255, 1) 50%)",
    features: [
      { id: 1, feature: "Semua fitur Paket Fokus" },
      { id: 2, feature: "Analisis mendalam tiap ujian" },
      { id: 3, feature: "Tantangan dan poin pengalaman (XP)" },
      { id: 4, feature: "Dukungan prioritas" },
    ],
  },
  {
    id: 3,
    title: "Paket berkembang",
    for: "Untuk yang ingin hasil maksimal.",
    price: "99.000",
    link: "",
    backgroundTheme: "#ffffff",
    cardTheme:
      "linear-gradient(146deg,rgba(248, 173, 61, 1) 0%, rgba(185, 46, 48, 1) 50%)",
    features: [
      { id: 1, feature: "Semua fitur Konsisten" },
      { id: 2, feature: "Akses ke semua tes premium" },
      { id: 3, feature: "Insight performa berbasis data" },
      { id: 4, feature: "Riwayat dan pencapaian penuh" },
    ],
  },
];

function tes() {
  return (
    <>
      <Navbar />
      <section className="absolute z-20 top-[100px] md:top-[150px] w-full">
        <div className="px-5 md:px-7-5 pb-5 md:pb-7-5 flex flex-col justify-center items-center gap-10">
          <div className="text-center">
            <h1 className="text-heading-5 md:text-heading-3 font-bold font-sora">
              Rencanakan Belajarmu, Capai Lebih Banyak.
            </h1>
            <p className="md:w-[500px]">
              Pilih paket belajar yang sesuai dengan ritmemu. Setiap langkah
              membawa kamu lebih dekat ke hasil terbaikmu.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            {cardsPrice.map((card) => (
              <div
                key={card.id}
                className={`border  p-2.5 w-[350px] h-[500px] rounded-[10px] flex flex-col gap-5 ${card.id % 2 === 0 ? "text-white border-0" : "text-black border-gray-400"}`}
                style={{ background: card.backgroundTheme }}
              >
                <div className="flex items-center gap-2.5 ">
                  <div
                    className="w-[20px] h-[20px] rounded-full"
                    style={{ background: card.cardTheme }}
                  ></div>
                  <h1 className="text-heading-5 font-bold font-sora">
                    {card.title}
                  </h1>
                </div>
                <p className="text-body-xs-demilight">{card.for}</p>
                <p className="text-body-l-semibold flex">
                  <span
                    className={`text-body-xs-regular text-[${card.cardTheme}]`}
                  >
                    Rp
                  </span>
                  {card.price}
                </p>

                <NavLink
                  to={card.link}
                  className={`text-heading-5 font-semibold flex justify-center  rounded-full py-2 ${card.id % 2 === 0 ? "text-purple-800" : "text-white"}`}
                  style={{ background: card.cardTheme }}
                >
                  Mulai Sekarang
                </NavLink>

                <div>
                  <p className="font-semibold mb-5 font-sora">
                    Yang akan kamu pelajari & nikmati:
                  </p>
                  <ul className="flex flex-col gap-4">
                    {card?.features?.map((feature) => (
                      <li key={feature.id} className="flex gap-2.5">
                        <div
                          className="w-[20px] h-[20px] rounded-full"
                          style={{ background: card.cardTheme }}
                        ></div>
                        {feature.feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default tes;

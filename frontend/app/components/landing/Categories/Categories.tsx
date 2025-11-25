import React from "react";

const categories = [
  {
    category: "Tes Akademik",
    features: [
      {
        id: 1,
        title: "Ujian Nasional",
        description:
          "Landasan awal menuju masa depan. Latihan menyeluruh untuk memastikan setiap langkah pendidikan dimulai dengan kokoh.",
      },
      {
        id: 2,
        title: "UTBK / SBMPTN",
        description:
          "Melewati batas dan menuju universitas impian. Kami bantu kamu berlatih dengan fokus dan strategi terbaik.",
      },
      {
        id: 3,
        title: "Tes Potensi Akademik",
        description:
          "Kami mengasah logika dan kemampuan berpikir kritis untuk menghadapi tantangan kompleks di masa depan.",
      },
      {
        id: 4,
        title: "Tes Sekolah",
        description:
          "Belajar, berlatih, dan berkembang bersama. Uji kemampuan dengan suasana belajar yang menyenangkan dan mendukung.",
      },
    ],
  },
  {
    category: "Tes Profesional & Karier",
    features: [
      {
        id: 1,
        title: "Tes Profesi",
        description:
          "Latihan yang dirancang untuk mencapai keahlian sejati, memastikan kesiapan menghadapi ujian profesional dengan percaya diri.",
      },
      {
        id: 2,
        title: "Tes Bahasa",
        description:
          "Bahasa membuka dunia. Kami bantu kamu menguasai komunikasi lintas budaya untuk peluang tanpa batas.",
      },
      {
        id: 3,
        title: "Tes CPNS",
        description:
          "Mempersiapkan individu yang tak hanya lulus, tapi juga siap mengabdi dengan integritas dan kemampuan.",
      },
    ],
  },
];

function Categories() {
  return (
    <div className="mx-7-5 mt-[120px]">
      <div className="border-b pb-10">
        <h1 className="text-heading-1 font-bold font-sora">
          Satu tempat untuk semua ujian impianmu
        </h1>
        <p className="text-body-sm-demilight">
          Dari ujian nasional hingga sertifikasi profesi, InterExam membantumu
          belajar dengan arah yang jelas dan dukungan yang tepat.
        </p>
      </div>
      <div className="flex mt-10 gap-5 w-full">
        {categories.map((category) => (
          <div key={category.category} className="w-full">
            <h2 className="text-heading-2 font-semibold font-sora pb-7-5">
              {category.category}
            </h2>
            <ul className="flex flex-col gap-7-5">
              {category.features.map((feature) => (
                <li
                  key={feature.id}
                  className="flex gap-4 justify-center items-center border-b pb-4"
                >
                  <span className="font-semibold font-sora">{feature.id}</span>
                  <div>
                    <h3 className="text-heading-3 font-semibold font-sora">
                      {feature.title}
                    </h3>
                    <p className="text-body-sm-regular">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;

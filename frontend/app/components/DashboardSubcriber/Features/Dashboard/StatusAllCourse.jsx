import { useState, useEffect, useMemo } from "react";
import { LayoutList } from "lucide-react";
import CardProgress from "../../Common/CardProgress";
import CardProgressList from "../../Common/CardProgressList";
import BreadCrumbs from "../../Common/BreadCrumbs";
import SearchBar from "../../Common/SearchBar";
import { slugify } from "../../../../utils/slugify.ts";

const Courses = [
  {
    id: 1,
    label: "Paket Soal 1 - Logika Dasar",
    image: "/person.jpg",
    progress: { answered: 15, totalSoal: 50 }, // ~30%
  },
  {
    id: 2,
    label: "Paket Soal 2 - TPA Kuantitatif",
    image: "/person.jpg",
    progress: { answered: 30, totalSoal: 40 }, // ~75%
  },
  {
    id: 3,
    label: "Paket Soal 3 - Bahasa Inggris",
    image: "/person.jpg",
    progress: { answered: 6, totalSoal: 60 }, // ~10%
  },
  {
    id: 4,
    label: "Paket Soal 4 - Penalaran Umum",
    image: "/person.jpg",
    progress: { answered: 45, totalSoal: 50 }, // ~90%
  },

  {
    id: 5,
    label: "Paket Soal 5 - Pemahaman Bacaan",
    image: "/person.jpg",
    progress: { answered: 9, totalSoal: 20 }, // ~45%
  },
  {
    id: 6,
    label: "Paket Soal 6 - Pengetahuan Umum",
    image: "/person.jpg",
    progress: { answered: 1, totalSoal: 20 }, // ~5%
  },
  {
    id: 7,
    label: "Paket Soal 7 - Matematika Saintek",
    image: "/person.jpg",
    progress: { answered: 12, totalSoal: 20 }, // ~60%
  },
  {
    id: 8,
    label: "Paket Soal 8 - Fisika Dasar",
    image: "/person.jpg",
    progress: { answered: 5, totalSoal: 20 }, // ~25%
  },

  {
    id: 9,
    label: "Paket Soal 9 - Kimia Organik",
    image: "/person.jpg",
    progress: { answered: 44, totalSoal: 50 }, // ~88%
  },
  {
    id: 10,
    label: "Paket Soal 10 - Biologi Sel",
    image: "/person.jpg",
    progress: { answered: 3, totalSoal: 20 }, // ~15%
  },
  {
    id: 11,
    label: "Paket Soal 11 - Sejarah Indonesia",
    image: "/person.jpg",
    progress: { answered: 40, totalSoal: 40 }, // 100%
  },
  {
    id: 12,
    label: "Paket Soal 12 - Geografi Fisik",
    image: "/person.jpg",
    progress: { answered: 11, totalSoal: 20 }, // ~55%
  },

  {
    id: 13,
    label: "Paket Soal 13 - Ekonomi Makro",
    image: "/person.jpg",
    progress: { answered: 8, totalSoal: 20 }, // ~40%
  },
  {
    id: 14,
    label: "Paket Soal 14 - Sosiologi",
    image: "/person.jpg",
    progress: { answered: 14, totalSoal: 20 }, // ~70%
  },
  {
    id: 15,
    label: "Paket Soal 15 - Tes Skolastik",
    image: "/person.jpg",
    progress: { answered: 4, totalSoal: 20 }, // ~20%
  },
  {
    id: 16,
    label: "Paket Soal 16 - Tryout Akbar",
    image: "/person.jpg",
    progress: { answered: 0, totalSoal: 20 }, // 0%
  },
];

function LoadingCards() {
  return (
    <div className="w-full py-20 flex justify-center items-center">
      <p className="text-gray-500 font-semibold text-lg animate-pulse">
        Sedang mencari...
      </p>
    </div>
  );
}

function StatusAllCourse() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isHandleLayout, setIsHandleLayout] = useState(() => {
    // Initialize from localStorage synchronously to avoid initial render mismatch (prevents blink)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isHandleLayout");
      return saved !== null ? saved === "true" : false;
    }

    // Server-side render fallback
    return false;
  });

  const isLoading = searchValue !== debouncedValue;

  // handle search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const filteredCourses = useMemo(() => {
    return Courses.filter((course) => {
      if (debouncedValue === "") return true;
      return course.label.toLowerCase().includes(debouncedValue.toLowerCase());
    });
  }, [debouncedValue]);

  useEffect(() => {
    // store explicit string so parsing is unambiguous
    localStorage.setItem("isHandleLayout", String(isHandleLayout));
  }, [isHandleLayout]);

  const handleLayout = () => {
    setIsHandleLayout(!isHandleLayout);
  };

  return (
    <div>
      <nav className="w-full px-7-5 py-3.5">
        <div className="w-12">
          <img src="/interexam-logo.svg" className="w-full" />
        </div>
      </nav>
      <div className="px-7-5 py-5 flex flex-col gap-5">
        <BreadCrumbs />
        <div className="flex items-center w-full gap-5">
          <SearchBar
            placeholder={
              "Cari ujian yang telah dipelajari atau ujian yang belum selesai di pelajari"
            }
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <button
            className="flex justify-center items-center gap-2.5 border px-3.5 py-2.5 rounded-full cursor-pointer hover:text-[#8A8A8A] text-black transition-colors duration-300"
            onClick={handleLayout}
          >
            <LayoutList />
            <span className="font-semibold">View</span>
          </button>
        </div>
        <div className="flex  items-center gap-2.5">
          <button className="flex justify-center items-center gap-2.5 border px-3.5 py-2.5 rounded-full cursor-pointer">
            <LayoutList />
            <span className="font-semibold">Filters</span>
          </button>
          {/* <button className="flex justify-center items-center gap-2.5 border px-3.5 py-2.5 rounded-full cursor-pointer">
            <LayoutList />
            <span className="font-semibold">Sort</span>
          </button> */}
        </div>
      </div>

      <div className="w-full ">
        {isLoading ? (
          <LoadingCards />
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Tidak ada paket soal ditemukan.
          </div>
        ) : isHandleLayout ? (
          <div className="flex flex-col gap-5 px-7-5 py-5 justify-center  items-center">
            {filteredCourses.map((course) => (
              <CardProgressList
                key={course.id}
                label={course.label}
                path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(course.label)}`}
                linkState={{
                  from: "status",
                  badge: {
                    label: "Status Ujian Terakhir",
                    classes: "border-yellow-300 bg-yellow-50 text-yellow-800",
                  },
                }}
                image={course.image}
                progress={course.progress}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-5 py-5 justify-center items-center">
            {filteredCourses.map((course) => (
              <CardProgress
                key={course.id}
                label={course.label}
                path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(course.label)}`}
                linkState={{
                  from: "status",
                  badge: {
                    label: "Status Ujian Terakhir",
                    classes: "border-yellow-300 bg-yellow-50 text-yellow-800",
                  },
                }}
                image={course.image}
                progress={course.progress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatusAllCourse;

import React, { useState, useEffect } from "react";
import Navbar from "../../components/landing/Navbar/Navbar";
import CardCourse from "../../components/DashboardSubcriber/Common/CardCourse";
import { landingService } from "../../services/landingService";
import { slugify } from "../../utils/slugify";
import { getAssetUrl } from "../../utils/assetHelpper";

function Tes() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await landingService.getPublicPackages();

        // Normalisasi data agar pas dengan props CardCourse
        const normalized = data.map((item) => ({
          id: item.id,
          title: item.label,
          image: getAssetUrl(item.image),
          rating: item.rating,
          totalSoal: item.totalSoal,
          participants: item.participants,
          category: item.category,
          path: `/tes/${slugify(item.label)}`,
        }));

        setCourses(normalized);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <Navbar />

      {/* Grid Course Section */}
      <section className="px-5 md:px-10 w-full py-10 md:pt-28 md:pb-7-5">
        <div className="w-full max-w-screen-xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 animate-pulse">
                  Memuat paket soal...
                </p>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Belum ada paket soal yang tersedia untuk publik saat ini.
            </div>
          ) : (
            <div className="flex flex-wrap justify-start gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <CardCourse
                    title={course.title}
                    image={course.image}
                    rating={course.rating}
                    totalSoal={course.totalSoal}
                    participants={course.participants}
                    category={course.category}
                    path={course.path}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Tes;

import React from "react";
import { useLocation, Link } from "react-router"; // Sesuaikan import router kamu
import { ChevronRight, Home } from "lucide-react";

function BreadCrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const routeNames = {
    dashboard: "Beranda-subscriber",
    latihan: "Latihan Soal",
    perkembangan: "Statistik Perkembangan",
    "status-ujian-terakhir": "Status Ujian Terakhir",
  };

  const formatName = (slug) => {
    return slug
      .replace(/-/g, " ") // strip diubah menjadi spasi
      .replace(/\b\w/g, (char) => char.toUpperCase()); // huruf besar diawal kata
  };

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {/* {pathnames.length > 0 && (
          <li className="inline-flex items-center">
            <Link
              to="/dashboard-subscriber"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </li>
        )} */}

        {pathnames.map((value, index) => {
          if (value === "dashboard") return null;

          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          const isLast = index === pathnames.length - 1;

          const displayName = routeNames[value] || formatName(value);

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-gray-400 mx-1" />

                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-[200px]">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-primary md:ml-2"
                  >
                    {displayName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default BreadCrumbs;

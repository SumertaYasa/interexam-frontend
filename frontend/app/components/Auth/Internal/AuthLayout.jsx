import React from "react";
import { NavLink, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";

function AuthLayout({ children }) {
  let backTarget = "/";
  let hasRouter = true;

  try {
    const location = useLocation();
    const path = location.pathname;

    // Logika Navigasi Pintar
    if (path.includes("registrasi-internal")) {
      // Jika di halaman daftar internal, kembali ke login internal
      backTarget = "/login-internal";
    } else if (path.includes("registrasi")) {
      // Jika di halaman daftar subscriber, kembali ke login subscriber
      backTarget = "/login";
    } else if (path.includes("login-internal")) {
      // Jika sudah di login internal, kembali ke landing page utama
      backTarget = "/";
    } else {
      // Default kembali ke landing page
      backTarget = "/";
    }
  } catch (err) {
    hasRouter = false;
    backTarget = "/";
  }

  return (
    <section className="w-full h-screen flex justify-center items-center bg-gray-50">
      <div className="flex mx-2.5 md:m-0 md:flex-row flex-col justify-center items-start gap-5 border bg-white p-5 rounded-[10px] shadow-sm">
        <div className="w-full h-full flex flex-col gap-5">
          <div className="flex items-center">
            {hasRouter ? (
              <NavLink
                to={backTarget}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </NavLink>
            ) : (
              <a
                href={backTarget}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </a>
            )}
          </div>

          <div className="flex justify-center items-center w-full">
            {children}
          </div>
        </div>

        <img
          src="/login-image.jpg"
          alt="login image"
          className="hidden md:block md:w-[450px] object-cover rounded-lg"
        />
      </div>
    </section>
  );
}

export default AuthLayout;

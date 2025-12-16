import React from "react";
import { NavLink, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";

function AuthLayout({ children }) {
  let backTarget = "/";
  let hasRouter = true;
  try {
    const location = useLocation();
    backTarget = location.pathname.includes("register")
      ? "/login-internal"
      : "/";
  } catch (err) {
    hasRouter = false;
    backTarget = "/";
  }

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="flex mx-2.5 md:m-0 md:flex-row flex-col justify-center items-start gap-5 border p-5 rounded-[10px] ">
        <div className="w-full h-full flex flex-col gap-5 ">
          {hasRouter ? (
            <NavLink to={backTarget}>
              <ArrowLeft />
            </NavLink>
          ) : (
            <a href={backTarget}>
              <ArrowLeft />
            </a>
          )}
          <div className="flex justify-center items-center">{children}</div>
        </div>
        <img
          src="/login-image.jpg"
          alt="login image"
          className="hidden md:block md:w-[500px] "
        />
      </div>
    </section>
  );
}

export default AuthLayout;

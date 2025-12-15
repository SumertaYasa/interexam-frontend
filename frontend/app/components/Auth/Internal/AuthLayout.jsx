import React from "react";
import { NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";



function AuthLayout({ children }) {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="flex mx-2.5 md:m-0 md:flex-row flex-col justify-center items-start gap-5 border p-5 rounded-[10px] ">
        <div className="flex flex-col gap-5 ">
          <NavLink to={"/"}>
            <ArrowLeft />
          </NavLink>
          <div>{children}</div>
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

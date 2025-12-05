import React from "react";
import { NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";

interface PropsHeading {
  title: string;
  description: string;
}

function LoginForm({ title, description }: PropsHeading) {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="flex mx-2.5 md:m-0 md:flex-row flex-col justify-center items-start gap-5 border p-5 rounded-[10px] ">
        <div className="flex flex-col gap-5 ">
          <NavLink to={"/"}>
            <ArrowLeft />
          </NavLink>
          <div className="flex flex-col justify-center items-center gap-7-5">
            <div className="text-center">
              <h1 className="text-heading-5 md:text-heading-2 font-semibold">
                {title}
              </h1>
              <p className="text-body-s-demilight ">{description}</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-6">
              <button className="flex items-center justify-center gap-2.5 border rounded-[10px] px-[15px] py-[10px]">
                <img src="/google.png" alt="" className="w-[24px] h-[24px]" />
                <span className="text-body-s-semibold">
                  Lanjutkan dengan Google
                </span>
              </button>
              <span>atau</span>
              <div className="flex flex-col gap-5">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="masukkan email kamu"
                  className="border rounded-[10px] px-[15px] py-[10px]"
                />
                <button className="border rounded-[10px] px-[15px] py-[10px] bg-primary text-white">
                  Lanjut dengan Email
                </button>
              </div>
            </div>
          </div>
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

export default LoginForm;

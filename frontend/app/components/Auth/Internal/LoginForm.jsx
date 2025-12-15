import React from "react";
import { Link } from "react-router";

function LoginForm() {
  return (
    <div className="flex flex-col justify-center items-center gap-7-5">
      <div className="text-center">
        <h1 className="text-heading-5 md:text-heading-2 font-semibold">
          test Login Anjay
        </h1>
        <p className="text-body-s-demilight ">lorem ipsum</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-6">
        <button className="flex items-center justify-center gap-2.5 border rounded-[10px] px-[15px] py-[10px]">
          <img src="/google.png" alt="" className="w-[24px] h-[24px]" />
          <span className="text-body-s-semibold">Lanjutkan dengan Google</span>
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

        <Link to={"/login-internal/register"}>belum punya akun?</Link>
      </div>
    </div>
  );
}

export default LoginForm;

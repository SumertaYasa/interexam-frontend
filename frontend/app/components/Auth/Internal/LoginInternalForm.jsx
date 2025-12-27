import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function LoginForm() {
  const [loading, setLoading] = useState(false);

  let navigateFn = null;
  try {
    navigateFn = useNavigate();
  } catch (err) {
    navigateFn = null;
  }

  const handleGoogleLoginSuccess = async (res) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.credential, roleTarget: "internal" }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("Login sukses!");
        if (navigateFn) {
          navigateFn("/dashboard");
        } else {
          window.location.href = "/dashboard";
        }
      } else if (response.status === 403 && data.status === "pending") {
        alert(
          data.message || "Akun belum diverifikasi oleh admin. Silakan tunggu."
        );
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    alert("Login Google gagal");
  };

  const handleEmailLogin = () => {
    alert("Login dengan email belum tersedia. Gunakan Google untuk masuk.");
  };

  return (
    <div className="flex flex-col h-full  justify-between items-center gap-7-5">
      <div className="text-center">
        <h1 className="text-heading-5 md:text-heading-2 font-semibold">
          Login Internal
        </h1>
        <p className="text-body-s-demilight">Masuk menggunakan akun internal</p>
      </div>
      <div className="h-full flex flex-col justify-between items-center gap-6 ">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />

        <a href={"/login-internal/register"}>belum punya akun?</a>
      </div>
    </div>
  );
}

export default LoginForm;

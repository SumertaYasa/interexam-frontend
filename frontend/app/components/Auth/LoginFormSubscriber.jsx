import React, { useState } from "react";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext.tsx";

function LoginFormSubscriber() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, showAlert } = useAuth();

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
        body: JSON.stringify({
          token: res.credential,
          roleTarget: "subscriber",
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // 1. Simpan token ke storage
        localStorage.setItem("token", data.token);

        // 2. Update Context secara manual agar state tidak kosong
        setUser(data.user);

        showAlert("Login sukses!", "success");

        // 3. Pastikan path ini sama dengan yang ada di rute DashboardLayout kamu
        navigate("/dashboard-subscriber");
      } else {
        showAlert("Login gagal!", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan saat login", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    alert("Login Google gagal");
  };

  return (
    <div className="flex flex-col h-full justify-between items-center gap-7.5">
      <div className="text-center">
        <h1 className="text-heading-5 md:text-heading-2 font-semibold">
          Login
        </h1>
        <p className="text-body-s-demilight">Masuk menggunakan akun Google</p>
      </div>
      <div className="h-full flex flex-col justify-between items-center gap-6">
        {loading ? (
          <p>Memproses login...</p>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        )}
        <a href={"/login/registrasi"} className="text-blue-600 hover:underline">
          belum punya akun?
        </a>
      </div>
    </div>
  );
}

export default LoginFormSubscriber;

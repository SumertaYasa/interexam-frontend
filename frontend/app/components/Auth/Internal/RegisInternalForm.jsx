import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function RegisForm() {
  const [googleToken, setGoogleToken] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  // Safely obtain navigate function — catch when Router isn't available (SSR)
  let navigateFn = null;
  try {
    navigateFn = useNavigate();
  } catch (err) {
    navigateFn = null;
  }

  const handleGoogleLoginSuccess = (res) => {
    setGoogleToken(res.credential);
  };

  const handleRegister = async () => {
    if (!role) return alert("Pilih role terlebih dahulu!");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: googleToken,
          roleTarget: "internal",
          requestRole: role,
        }),
      });
      const data = await response.json();

      // After registering an internal user we shouldn't auto-login them.
      // Instead, inform them to wait for admin verification and
      // redirect to the internal login page.
      if (response.ok) {
        alert(
          "Registrasi sukses! Silakan tunggu verifikasi admin, lalu login melalui halaman internal."
        );
        if (navigateFn) navigateFn("/login-internal");
      } else {
        alert(data.message || "Registrasi gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat registrasi/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-7.5">
      <div className="text-center">
        <h1 className="text-heading-5 md:text-heading-2 font-semibold">
          Registrasi Internal
        </h1>
        <p className="text-body-s-demilight">
          Pilih role dan registrasi dengan Google
        </p>
      </div>

      {!googleToken ? (
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => alert("Login Google gagal")}
        />
      ) : (
        <div className="flex flex-col justify-center items-center gap-6">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Pilih Role</option>
            <option value="Validator">Validator</option>
            <option value="Contributor">Contributor</option>
          </select>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="flex items-center justify-center gap-2.5 border rounded-[10px] px-[15px] py-[10px]"
          >
            {loading ? "Loading..." : "Daftar (tunggu verifikasi)"}
          </button>

          <a href={"/login-internal"} className="mt-2">
            Kembali ke login
          </a>
        </div>
      )}
    </div>
  );
}

export default RegisForm;

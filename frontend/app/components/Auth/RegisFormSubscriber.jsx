import React, { useState } from "react";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

function RegisForm() {
  const { showAlert } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (googleResponse) => {
    setIsLoading(true);
    try {
      const bodyPayload = {
        token: googleResponse.credential,
        roleTarget: "subscriber",
      };

      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Registrasi Berhasil!");

        showAlert("Registrasi Berhasil!", "success");
        navigate("/login");
      } else {
        alert(data.message || "Gagal melakukan verifikasi");
      }
    } catch (err) {
      console.error("Koneksi Error:", err);
      alert("Gagal terhubung ke server Backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-7.5">
      <div className="text-center">
        <h1 className="text-heading-5 md:text-heading-2 font-semibold">
          Registrasi
        </h1>
        <p className="text-body-s-demilight">Daftar akun Google kamu</p>
      </div>

      {isLoading ? (
        <p className="animate-pulse">Memverifikasi data...</p>
      ) : (
        <GoogleLogin
          text="signup_with"
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Gagal mendapatkan akses dari Google")}
        />
      )}
    </div>
  );
}

export default RegisForm;

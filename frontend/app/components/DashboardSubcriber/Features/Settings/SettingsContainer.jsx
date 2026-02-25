import React, { useState, useRef, useEffect } from "react";
import {
  User,
  ShieldCheck,
  Camera,
  Save,
  Mail,
  Phone,
  Lock,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import ActionModal from "../../Common/ActionModal";
import ModalWrapper from "./Components/ModalWrapper";
import InputGroup from "./Components/InputGroup";
import SecurityCard from "./Components/SecurityCard";
import TabButton from "./Components/TabButton";

// GANTI PATH INI SESUAI DENGAN LOKASI FILE CONTEXT & SERVICE-MU
import { useAuth } from "../../../../context/AuthContext";
import { profileService } from "../../../../services/subscriber";

export default function SettingContainer() {
  const { user, refreshSubscription, showAlert } = useAuth();
  const [activeTab, setActiveTab] = useState("profil");

  // State Modal
  const [activeModal, setActiveModal] = useState(null);

  // Form State (Hanya sisakan yang digunakan)
  const [formData, setFormData] = useState({
    displayName: "",
    newEmail: "",
    newPhone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Foto Profil & Loading State
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("/person.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // State untuk konfirmasi password email
  const [emailConfirmPassword, setEmailConfirmPassword] = useState("");

  // --- FUNCTION UNTUK FETCH PROFIL DATA (DIGUNAKAN BERKALI-KALI) ---
  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const profileData = await profileService.getProfile();

      if (profileData) {
        setFormData((prev) => ({
          ...prev,
          displayName: profileData.nama_subscriber || "",
          newEmail: profileData.email_subscriber || "",
          newPhone: profileData.phone || "",
        }));

        // Set Foto Profil
        if (profileData.foto) {
          const fotoUrl = profileData.foto.startsWith("http")
            ? profileData.foto
            : `http://localhost:5000${profileData.foto}`;
          setProfileImage(fotoUrl);
        } else {
          setProfileImage("/person.jpg");
        }
      }
    } catch (error) {
      console.error("Gagal memuat data profil:", error);
      showAlert("Gagal memuat data profil", "error");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // --- FETCH PROFIL DATA SAAT COMPONENT MOUNT ---
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user, showAlert]); // Fetch ulang saat user berubah (misalnya setelah login)

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedFile(file);
    }
  };

  // --- LOGIC SIMPAN PROFIL ---
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const payload = new FormData();
      // Kirim displayName langsung sebagai nama_subscriber ke backend
      payload.append("nama_subscriber", formData.displayName.trim());

      if (selectedFile) {
        payload.append("foto", selectedFile);
      }

      await profileService.updateProfile(payload);

      showAlert("Profil berhasil diperbarui!", "success");
      await refreshSubscription();
      // PENTING: Refetch data profil untuk memastikan form selalu menampilkan data terbaru
      await fetchProfileData();
      setSelectedFile(null); // Reset file yang dipilih
    } catch (error) {
      console.error("Gagal simpan profil:", error);
      showAlert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan profil.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIC SIMPAN EMAIL ---
  const handleSaveEmail = async () => {
    try {
      // Validasi
      if (!formData.newEmail.trim()) {
        showAlert("Email baru tidak boleh kosong", "error");
        return;
      }
      if (!emailConfirmPassword.trim()) {
        showAlert("Password harus diisi untuk verifikasi email", "error");
        return;
      }

      setIsProcessing(true);
      await profileService.updateEmail(
        formData.newEmail.trim(),
        emailConfirmPassword,
      );

      showAlert("Email berhasil diperbarui!", "success");
      await fetchProfileData();
      setActiveModal(null);
      setEmailConfirmPassword("");
    } catch (error) {
      console.error("Gagal simpan email:", error);
      showAlert(
        error.response?.data?.message ||
          "Gagal mengubah email. Periksa password Anda.",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // --- LOGIC UPDATE PHONE ---
  const handleUpdatePhone = async () => {
    try {
      if (!formData.newPhone.trim()) {
        showAlert("Nomor telepon tidak boleh kosong", "error");
        return;
      }

      setIsProcessing(true);
      await profileService.updatePhone(formData.newPhone.trim());

      showAlert("Nomor telepon berhasil diperbarui!", "success");
      await fetchProfileData();
      setActiveModal(null);
    } catch (error) {
      console.error("Gagal update telepon:", error);
      showAlert(
        error.response?.data?.message || "Gagal mengubah nomor telepon.",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // --- LOGIC GANTI PASSWORD ---
  const handleChangePassword = async () => {
    try {
      if (
        !formData.oldPassword.trim() ||
        !formData.newPassword.trim() ||
        !formData.confirmPassword.trim()
      ) {
        showAlert("Semua field password harus diisi", "error");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showAlert("Password baru dan konfirmasi tidak cocok", "error");
        return;
      }

      setIsProcessing(true);
      await profileService.changePassword(
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword,
      );

      showAlert("Password berhasil diperbarui!", "success");
      setActiveModal(null);
      // Reset form
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Gagal ganti password:", error);
      showAlert(
        error.response?.data?.message ||
          "Gagal mengubah password. Periksa password lama Anda.",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper untuk Masking Email & Phone
  const maskEmail = (email) => {
    if (!email) return "Belum ada email";
    const [name, domain] = email.split("@");
    return `${name.charAt(0)}${"*".repeat(name.length - 1)}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return "Belum ada nomor telepon";
    return (
      phone.slice(0, 4) +
      "*".repeat(Math.max(0, phone.length - 6)) +
      phone.slice(-2)
    );
  };

  return (
    <div className="w-full min-h-screen px-7-5 py-8 font-sans antialiased">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white border rounded-[2.5rem] shadow-sm flex overflow-hidden min-h-[700px]">
          {/* --- SIDEBAR NAVIGASI --- */}
          <div className="w-72 border-r border-slate-100 p-8 flex flex-col bg-slate-50/30">
            <div className="mb-10 px-4">
              <h2 className="text-2xl font-black text-slate-900 line-clamp-1">
                {/* Tampilkan langsung nama display */}
                {formData.displayName || "User"}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                {user?.isPremium ? "Premium Member" : "Free Subscriber"}
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              <TabButton
                active={activeTab === "profil"}
                onClick={() => setActiveTab("profil")}
                icon={<User size={20} />}
                label="Profil Utama"
              />
              <TabButton
                active={activeTab === "keamanan"}
                onClick={() => setActiveTab("keamanan")}
                icon={<ShieldCheck size={20} />}
                label="Keamanan Akun"
              />
            </nav>
          </div>

          {/* --- AREA KONTEN --- */}
          <div className="flex-1 p-12 bg-white overflow-y-auto">
            {activeTab === "profil" ? (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-slate-900 mb-8">
                  Informasi Profil
                </h3>

                <div className="flex flex-col lg:flex-row gap-16">
                  {/* KOLOM 1: Input Profil */}
                  <div className="flex-[2] flex flex-col gap-6">
                    <InputGroup
                      label="Nama Lengkap / Tampilan"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange(e, "displayName")}
                    />

                    <div className="mt-8 flex justify-start">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save size={18} /> Simpan Perubahan
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* KOLOM 2: Foto Profil */}
                  <div className="flex-1 flex flex-col items-center border-l border-slate-50 pl-0 lg:pl-16">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 self-start lg:self-center">
                      Foto Profil
                    </p>
                    <div
                      className="relative group cursor-pointer w-44 h-44"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02] border-4 border-white">
                        <img
                          src={profileImage}
                          className="w-full h-full object-cover bg-slate-100"
                          alt="Profile"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={32} />
                      </div>
                    </div>
                    <div className="text-center mt-6">
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
                        {formData.displayName || "User"}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 uppercase font-bold tracking-tighter">
                        {user?.isPremium ? "Premium" : "Subscriber"}
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="mt-8 px-6 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                <h3 className="text-xl font-bold text-slate-900 mb-8">
                  Keamanan Akun
                </h3>
                <div className="space-y-6">
                  <SecurityCard
                    label="Alamat Email"
                    value={maskEmail(formData.newEmail)}
                    icon={<Mail className="text-blue-500" />}
                    onEdit={() => setActiveModal("email")}
                  />
                  <SecurityCard
                    label="Nomor Telepon"
                    value={maskPhone(formData.newPhone)}
                    icon={<Phone className="text-green-500" />}
                    canDelete
                    onEdit={() => setActiveModal("phone")}
                  />

                  <div className="pt-8 border-t border-slate-100 mt-10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                      Aksi Berbahaya
                    </p>
                    <div className="w-full flex flex-col gap-3">
                      <button
                        onClick={() => setActiveModal("password")}
                        className="flex items-center gap-4 w-full px-4 py-2.5 bg-blue-50 text-blue-600 rounded-[10px] font-bold hover:bg-blue-100 transition-all"
                      >
                        <Lock size={18} /> <span>Ubah Kata Sandi</span>
                      </button>
                      <button
                        onClick={() => setActiveModal("delete-account")}
                        className="flex items-center gap-4 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-[10px] font-bold hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={18} /> <span>Hapus Akun Permanen</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL INPUT SECTION --- */}
      {/* ... Modal Wrapper Email, Phone, Password, Delete Account tetap sama ... */}

      {/* Cuma kutipan modal Email sbg contoh agar tidak terpotong JSX-nya */}
      {activeModal === "email" && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">Ubah Email</h4>
          <p className="text-slate-500 text-sm mb-8">
            Email baru digunakan untuk login dan verifikasi.
          </p>
          <div className="space-y-4">
            <InputGroup
              label="Email Baru"
              placeholder="email@baru.com"
              type="email"
              value={formData.newEmail}
              onChange={(e) => handleInputChange(e, "newEmail")}
            />
            <InputGroup
              label="Konfirmasi Password"
              placeholder="••••••••"
              type="password"
              value={emailConfirmPassword}
              onChange={(e) => setEmailConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={handleSaveEmail}
              disabled={isProcessing}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 text-slate-400 font-bold text-sm"
            >
              Batalkan
            </button>
          </div>
        </ModalWrapper>
      )}

      {activeModal === "phone" && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">
            Update Nomor
          </h4>
          <p className="text-slate-500 text-sm mb-8">
            Masukkan nomor WhatsApp aktif untuk menerima notifikasi.
          </p>
          <div className="space-y-4">
            <InputGroup
              label="Nomor Telepon Baru"
              placeholder="08123..."
              type="tel"
              value={formData.newPhone}
              onChange={(e) => handleInputChange(e, "newPhone")}
            />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={handleUpdatePhone}
              disabled={isProcessing}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Menyimpan..." : "Simpan Nomor"}
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 text-slate-400 font-bold text-sm"
            >
              Batalkan
            </button>
          </div>
        </ModalWrapper>
      )}

      {activeModal === "password" && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">
            Ganti Password
          </h4>
          <p className="text-slate-500 text-sm mb-8">
            Gunakan kombinasi simbol dan angka agar password lebih kuat.
          </p>
          <div className="space-y-4">
            <InputGroup
              label="Password Lama"
              type="password"
              value={formData.oldPassword}
              onChange={(e) => handleInputChange(e, "oldPassword")}
            />
            <InputGroup
              label="Password Baru"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange(e, "newPassword")}
            />
            <InputGroup
              label="Konfirmasi Baru"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange(e, "confirmPassword")}
            />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={handleChangePassword}
              disabled={isProcessing}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 text-slate-400 font-bold text-sm"
            >
              Batalkan
            </button>
          </div>
        </ModalWrapper>
      )}

      <ActionModal
        isOpen={activeModal === "delete-account"}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          alert("Akun Dihapus");
          setActiveModal(null);
        }}
        title="Hapus Akun Permanen?"
        description={`Apakah kamu yakin ingin menghapus akun "${formData.displayName}"? Seluruh riwayat ujian akan hilang selamanya.`}
        icon={AlertTriangle}
        iconClass="bg-red-50 text-red-600"
        confirmText="Ya, Hapus Permanen"
        confirmClass="bg-red-600 shadow-red-200"
      />
    </div>
  );
}

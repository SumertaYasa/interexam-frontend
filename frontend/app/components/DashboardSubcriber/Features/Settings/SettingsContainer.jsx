import React, { useState, useRef } from "react";
import {
  User,
  ShieldCheck,
  LogOut,
  Camera,
  Save,
  Mail,
  Phone,
  Lock,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import ActionModal from "../../Common/ActionModal";
import ModalWrapper from "./Components/ModalWrapper";
import InputGroup from "./Components/InputGroup";
import SecurityCard from "./Components/SecurityCard";
import TabButton from "./Components/TabButton";

export default function SettingContainer({ user, logout }) {
  const [activeTab, setActiveTab] = useState("profil");

  // State
  const [activeModal, setActiveModal] = useState(null); // 'email', 'phone', 'password', 'delete-account'

  // Form State
  const [formData, setFormData] = useState({
    firstName: "Albert",
    lastName: "King",
    displayName: "King Albert",
    bio: "",
    newEmail: "",
    newPhone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Foto Profil
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("/person.jpg");

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="w-full min-h-screen px-7-5 py-8 font-sans antialiased">
      {/* Hidden File Input untuk Foto Profil */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white border  rounded-[2.5rem] shadow-sm flex overflow-hidden min-h-[700px]">
          {/* Sidebar Navigasi */}
          <div className="w-72 border-r border-slate-100 p-8 flex flex-col bg-slate-50/30">
            <div className="mb-10 px-4">
              <h2 className="text-2xl font-black text-slate-900">
                {formData.firstName}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                Subscriber
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

            <button
              onClick={logout}
              className="mt-auto flex items-center gap-4 px-6 py-4 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-95"
            >
              <LogOut size={20} />
              <span>Keluar Akun</span>
            </button>
          </div>

          {/* Area Konten */}
          <div className="flex-1 p-12 bg-white overflow-y-auto">
            {activeTab === "profil" ? (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-slate-900 mb-8">
                  Informasi Profil
                </h3>
                <div className="flex flex-col lg:flex-row gap-16">
                  {/* Kolom Input Profil */}
                  <div className="flex-[2] flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InputGroup
                        label="Nama Depan"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange(e, "firstName")}
                      />
                      <InputGroup
                        label="Nama Belakang"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange(e, "lastName")}
                      />
                    </div>
                    <InputGroup
                      label="Nama Panggilan"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange(e, "displayName")}
                    />
                    <div>
                      <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-2">
                        Bio
                      </label>
                      <textarea
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[150px] resize-none text-sm placeholder:text-slate-400"
                        placeholder="Tuliskan sedikit tentang dirimu..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange(e, "bio")}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95">
                        <Save size={18} /> Simpan Perubahan
                      </button>
                    </div>
                  </div>

                  {/* Kolom Foto Profil */}
                  <div className="flex-1 flex flex-col items-center border-l border-slate-50 pl-0 lg:pl-16">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 self-start">
                      Foto Profil
                    </p>
                    <div
                      className="relative group cursor-pointer w-44 h-44"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02]">
                        <img
                          src={profileImage}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={32} />
                      </div>
                    </div>
                    <div className="text-center mt-6">
                      <h3 className="text-xl font-bold text-slate-800">
                        {formData.displayName}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 uppercase font-bold tracking-tighter">
                        Subscriber
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
                    value="A*******@gmail.com"
                    icon={<Mail className="text-blue-500" />}
                    onEdit={() => setActiveModal("email")}
                  />
                  <SecurityCard
                    label="Nomor Telepon"
                    value="089*******"
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

      {/*  MODAL INPUT SECTION  */}

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
            />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
              Simpan Perubahan
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
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
              Kirim Kode Verifikasi
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
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
              Simpan Password Baru
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

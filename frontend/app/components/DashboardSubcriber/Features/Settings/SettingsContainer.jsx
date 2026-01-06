import React, { useState } from "react";
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

export default function SettingContainer({ user, logout }) {
  const [activeTab, setActiveTab] = useState("profil");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  return (
    <div className="w-full min-h-screen px-7-5 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Card Container */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex overflow-hidden min-h-[700px]">
          {/* Sidebar Navigasi */}
          <div className="w-72 border-r border-slate-100 p-8 flex flex-col bg-slate-50/30">
            <div className="mb-10 px-4">
              <h2 className="text-2xl font-black text-slate-900">Albert</h2>
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
                <div className="flex gap-16">
                  {/* Kolom Input Profil */}
                  <div className="flex-[2] flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <InputGroup label="Nama Depan" placeholder="King" />
                      <InputGroup label="Nama Belakang" placeholder="Albert" />
                    </div>
                    <InputGroup
                      label="Nama Panggilan"
                      placeholder="King Albert"
                    />
                    <div>
                      <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-2">
                        Bio
                      </label>
                      <textarea
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[150px] resize-none text-sm placeholder:text-slate-400"
                        placeholder="Tuliskan sedikit tentang dirimu..."
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 text-sm">
                        <Save size={18} /> Simpan Perubahan
                      </button>
                    </div>
                  </div>

                  {/* Kolom Foto Profil */}
                  <div className="flex-1 flex flex-col items-center border-l border-slate-50 pl-16">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 self-start">
                      Foto Profil
                    </p>
                    <div className="relative group cursor-pointer w-44 h-44">
                      <div className="w-full h-full rounded-full overflow-hidden  shadow-2xl transition-transform ">
                        <img
                          src="/person.jpg"
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
                        Albert
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 uppercase font-bold tracking-tighter">
                        Subscriber
                      </p>
                    </div>
                    <button className="mt-8 px-6 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all active:scale-95">
                      Ganti Foto
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl ">
                <h3 className="text-xl font-bold text-slate-900 mb-8">
                  Keamanan Akun
                </h3>
                <div className="space-y-6">
                  {/* Pemicu Modal Edit Email & Telepon */}
                  <SecurityCard
                    label="Alamat Email"
                    value="A*******@gmail.com"
                    icon={<Mail className="text-blue-500" />}
                    onEdit={() => setShowEmailModal(true)}
                  />
                  <SecurityCard
                    label="Nomor Telepon"
                    value="089*******"
                    icon={<Phone className="text-green-500" />}
                    canDelete
                    onEdit={() => setShowPhoneModal(true)}
                  />

                  <div className="pt-8 border-t border-slate-100 mt-10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                      Aksi Berbahaya
                    </p>
                    <div className="w-full flex flex-col gap-3">
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-4 w-full px-4 py-2.5 bg-blue-50 text-blue-600 rounded-[10px] font-bold hover:bg-blue-100 transition-all"
                      >
                        <Lock size={18} /> <span>Ubah Kata Sandi</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center  gap-4 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-[10px] font-bold hover:bg-red-100 transition-all"
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

      {/* --- KUMPULAN MODAL --- */}

      {/* MODAL EDIT EMAIL */}
      {showEmailModal && (
        <ModalWrapper onClose={() => setShowEmailModal(false)}>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">Ubah Email</h4>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Email baru akan digunakan untuk proses verifikasi dan login.
          </p>
          <div className="space-y-4">
            <InputGroup
              label="Email Baru"
              placeholder="masukkan email baru..."
              type="email"
            />
            <InputGroup
              label="Konfirmasi Password"
              placeholder="••••••••"
              type="password"
            />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all">
              Simpan Perubahan
            </button>
            <button
              onClick={() => setShowEmailModal(false)}
              className="w-full py-4 text-slate-400 font-bold text-sm"
            >
              Batalkan
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* MODAL EDIT NOMOR TELEPON */}
      {showPhoneModal && (
        <ModalWrapper onClose={() => setShowPhoneModal(false)}>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">
            Update Nomor
          </h4>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Masukkan nomor WhatsApp aktif King Yasa untuk menerima notifikasi
            ujian.
          </p>
          <div className="space-y-4">
            <InputGroup
              label="Nomor Telepon Baru"
              placeholder="08123..."
              type="tel"
            />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
              Kirim Kode Verifikasi
            </button>
            <button
              onClick={() => setShowPhoneModal(false)}
              className="w-full py-4 text-slate-400 font-bold text-sm"
            >
              Batalkan
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* MODAL GANTI PASSWORD */}
      {showPasswordModal && (
        <ModalWrapper onClose={() => setShowPasswordModal(false)}>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">
            Ganti Password
          </h4>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Gunakan kombinasi simbol dan angka agar password King Yasa lebih
            kuat.
          </p>
          <div className="space-y-4">
            <InputGroup label="Password Lama" type="password" />
            <InputGroup label="Password Baru" type="password" />
            <InputGroup label="Konfirmasi Baru" type="password" />
          </div>
          <div className="flex flex-col gap-3 mt-10">
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
              Simpan Password Baru
            </button>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="w-full py-4 text-slate-400 font-bold text-sm"
            >
              Batalkan
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* MODAL HAPUS AKUN */}
      {showDeleteModal && (
        <ModalWrapper onClose={() => setShowDeleteModal(false)} danger>
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">
            Yakin Ingin Menghapus?
          </h4>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed">
            Tindakan ini akan menghapus semua riwayat ujian King Yasa secara
            permanen dan tidak bisa dikembalikan.
          </p>
          <div className="flex flex-col gap-3">
            <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-200 hover:bg-red-700 transition-all">
              Ya, Hapus Permanen
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
            >
              Tetap di Sini
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

// --- SUB-KOMPONEN HELPER ---

function ModalWrapper({ children, onClose, danger = false }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className={`absolute inset-0 backdrop-blur-sm animate-in fade-in duration-300 `}
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${active ? "bg-blue-50 text-blue-600 " : "text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100"}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

function InputGroup({ label, placeholder, type = "text" }) {
  return (
    <div className="w-full">
      <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2.5 ml-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
        placeholder={placeholder}
      />
    </div>
  );
}

function SecurityCard({ label, value, icon, canDelete, onEdit }) {
  return (
    <div className="w-[500px] flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {label}
          </p>
          <p className="text-slate-800 font-bold">{value}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {canDelete && (
          <button className="px-4 py-2 text-red-500 text-xs font-bold hover:bg-red-50 rounded-xl transition-colors">
            Hapus
          </button>
        )}
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

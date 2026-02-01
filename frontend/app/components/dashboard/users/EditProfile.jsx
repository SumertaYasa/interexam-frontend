import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { userService } from "../../../services/userService";
import { getPhotoUrl } from "../../../utils/urlHelper";

import { useAuth } from "../../../context/AuthContext";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown"; 
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import ProfilePhotoUploader from "../common/ProfilePhotoUploader"; 

export default function EditProfile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { setUser } = useAuth();

    const [userId, setUserId] = useState(null);

    const [formData, setFormData] = useState({
        nama_user: "", 
        email_user: "", 
        phone: "", 
        role: "",
        keahlian: [], 
        fotoFile: null,
        deletePhoto: false
    });

    const [previewFoto, setPreviewFoto] = useState("");
    const [subjectsOptions, setSubjectsOptions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const subjects = await userService.getSubjectsForDropdown();
                setSubjectsOptions(subjects.map(s => ({
                    label: s.nama_subject, 
                    value: s.id_subject 
                })));

                const userData = await userService.getMe();
                
                setUserId(userData.id_user);
                
                setFormData({
                    nama_user: userData.nama_user || "",
                    email_user: userData.email_user || "",
                    phone: userData.phone || "",
                    role: userData.role,
                    keahlian: userData.subject_ids || [],
                    fotoFile: null
                });

                setPreviewFoto(getPhotoUrl(userData.foto));

            } catch (error) {
                console.error(error);
                alert("Gagal memuat profil.");
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSelectKeahlian = (subjectId) => {
        setFormData((prev) => {
            const current = prev.keahlian;
            const updated = current.includes(subjectId)
                ? current.filter(id => id !== subjectId)
                : [...current, subjectId];
            return { ...prev, keahlian: updated };
        });
    };

   const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ 
                ...formData, 
                fotoFile: file, 
                deletePhoto: false 
            });
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleDeletePhoto = () => {
        if (confirm("Hapus foto profil?")) {
            setFormData({ 
                ...formData, 
                fotoFile: null, 
                deletePhoto: true 
            });
            setPreviewFoto("/profile-default.png");
        }
    };

    const getKeahlianLabel = () => {
        if (formData.keahlian.length === 0) return "Pilih Keahlian";
        return subjectsOptions
            .filter(opt => formData.keahlian.includes(opt.value))
            .map(opt => opt.label).join(", ");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi Sederhana
        if (!formData.nama_user) return alert("Nama Lengkap tidak boleh kosong!");

        setIsLoading(true);
        try {
            const payload = new FormData();
            payload.append('nama_user', formData.nama_user);
            payload.append('phone', formData.phone);
            
            if (formData.role !== 'Admin') {
                formData.keahlian.forEach(id => payload.append('subject_ids[]', id));
            }

           if (formData.fotoFile) {
                payload.append('profile_picture', formData.fotoFile);
            } else if (formData.deletePhoto) {
                payload.append('delete_photo', 'true'); 
            }

            const response = await userService.updateProfile(userId, payload);
            const updatedUser = response.data; 

            if (updatedUser) {
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                
                setPreviewFoto(getPhotoUrl(updatedUser.foto));
            }

            alert("Profile berhasil diperbarui!");

        } catch (error) {
            console.error(error);
            alert(error.message || "Gagal update profil");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">
            
            <PageHeader 
                title="Edit Profile"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Profile", link: null }
                ]}
            />

            {/* CARD UTAMA */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden  border border-gray-100 relative">

                {/* AREA FOTO & IDENTITAS UTAMA */}
                <div className="px-8 relative pb-6 mt-18">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 gap-6">
                        
                        {/* Foto Profil  */}
                        <div className="flex-shrink-0 z-10 ">
                            <ProfilePhotoUploader 
                                currentImage={previewFoto}
                                onFileChange={handlePhotoChange}
                                onDelete={handleDeletePhoto}
                            />
                        </div>

                        {/* Name & Role */}
                        <div className="text-center sm:text-left mb-2 sm:mb-4 flex-1 font-noto-sans">
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                {formData.nama_user || "Nama User"}
                            </h2>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-gray-600">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${formData.role === 'Admin' ? 'bg-purple-100 text-primary' : 'bg-blue-100 text-primary'}`}>
                                    {formData.role}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {/* @{formData.username} • {formData.email_user} */}
                                    {formData.email_user}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORM INPUT AREA */}
                <div className="px-8 py-8 border-t border-gray-100">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            
                            {/* KOLOM KIRI: Data Akun */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold font-noto-sans text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
                                        Data Akun
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {/* Input Username */}
                                        <InputField 
                                            label="Nama user"
                                            name="nama_user"
                                            value={formData.nama_user}
                                            onChange={handleChange}
                                            placeholder="Masukkan nama Anda"
                                        />

                                        {/* Input No HP */}
                                        <InputField 
                                            label="Nomor WhatsApp"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Contoh: 0812..."
                                            type="tel"
                                        />
                                        
                                        {/* Input Email */}
                                        <div className="relative">
                                            <InputField 
                                                label="Email"
                                                name="email_user"
                                                value={formData.email_user}
                                                disabled={true} 
                                            />
                                            {/* Icon Gembok di kanan input */}
                                            <div className="absolute right-3 top-[42px] text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN: Keahlian & Keamanan */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold font-noto-sans text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
                                        Keahlian & Akses
                                    </h3>

                                    {/* LOGIC KEAHLIAN */}
                                    {formData.role === "Admin" ? (
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-1">
                                            <div className="bg-blue-100 p-2 rounded-full text-primary shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-primary font-noto-sans">Admin Akses Penuh</h4>
                                                <p className="text-xs text-primary mt-1 leading-relaxed font-noto-sans">
                                                    Anda memiliki akses otomatis ke seluruh mata pelajaran. Tidak perlu pengaturan keahlian.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Dropdown 
                                                label="Keahlian (Kompetensi)"
                                                selectedText={getKeahlianLabel()}
                                                options={subjectsOptions}
                                                onSelect={handleSelectKeahlian}
                                                selectedValues={formData.keahlian}
                                                multiSelect={true}
                                            />
                                            <p className="text-xs text-gray-500 font-noto-sans">
                                                *Anda dapat menambah atau mengurangi keahlian sesuai sertifikasi.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-6">
                            
                            {/* Reset Password Link */}
                            <Link 
                                to="/dashboard/reset-password"
                                className="group flex items-center gap-2 text-sm font-medium text-primary py-2 px-3 rounded-lg "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                                    className="lucide lucide-key-round-icon lucide-key-round h-5 w-5"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
                                </svg>
                                <span>Reset Password</span>
                            </Link>

                            {/* Tombol Simpan & Batal */}
                            <div className="flex gap-3 w-full sm:w-auto">
                                <ButtonCancel to="/dashboard" text="Batal" />
                                <ButtonSave 
                                    onClick={handleSubmit} 
                                    isLoading={isLoading} 
                                    text="Simpan Perubahan" 
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
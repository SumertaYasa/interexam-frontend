import { useState } from "react";
import { useNavigate } from "react-router";

import { userService } from "../../../services/userService";
import { useAuth } from "../../../context/AuthContext";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField"; 
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";

export default function ResetPassword() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: "", 
        newPassword: "",     
        confirmPassword: ""  
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            return alert("Harap isi Password Lama, Password Baru, dan Konfirmasi Password!");
        }

        if (formData.newPassword !== formData.confirmPassword) {
            return alert("Konfirmasi password tidak cocok dengan password baru!");
        }

        if (formData.newPassword.length < 6) {
            return alert("Password baru minimal 6 karakter!");
        }

        if (formData.currentPassword === formData.newPassword) {
            return alert("Password baru harus berbeda dengan password lama!");
        }

        setIsLoading(true);

        try {
            const payload = new FormData();
            payload.append('password', formData.newPassword);
            
            payload.append('current_password', formData.currentPassword);

            const userId = user?.id_user;
            await userService.updateProfile(userId, payload);

            alert("Password berhasil diubah! Silakan login kembali untuk keamanan.");
            
            navigate("/dashboard");

        } catch (error) {
            console.error("Gagal reset password:", error);
            alert(error.message || "Gagal mengubah password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50 font-noto-sans">
            
            {/* Header Halaman */}
            <PageHeader 
                title="Ganti Password"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Reset Password", link: null }
                ]}
            />

            {/* Card Utama */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 relative font-noto-sans">
                
                {/* Banner */}
                <div className="h-32 w-full bg-gradient-to-r from-primary to-primary relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute bottom-0 left-0 px-8 py-4 flex items-center gap-4">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/30 text-white">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-bold font-noto-sans">Keamanan Akun</h2>
                            <p className="text-red-100 text-sm font-noto-sans">Lindungi akun Anda dengan password yang kuat.</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            
                            {/* KOLOM KIRI*/}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 font-noto-sans">
                                    Form Perubahan
                                </h3>

                                <div className="space-y-5 font-noto-sans">
                                    {/* Password Lama */}
                                    <InputField 
                                        label="Password Lama" 
                                        name="currentPassword" 
                                        type="password" 
                                        value={formData.currentPassword} 
                                        onChange={handleChange} 
                                        placeholder="Masukkan password saat ini" 
                                        required={true}
                                    />

                                    <hr className="border-dashed border-gray-200 font-noto-sans" />

                                    {/* Password Baru */}
                                    <InputField 
                                        label="Password Baru" 
                                        name="newPassword" 
                                        type="password" 
                                        value={formData.newPassword} 
                                        onChange={handleChange} 
                                        placeholder="Min. 6 karakter" 
                                        required={true}
                                    />

                                    {/* Konfirmasi Password */}
                                    <div>
                                        <InputField 
                                            label="Ulangi Password Baru" 
                                            name="confirmPassword" 
                                            type="password" 
                                            value={formData.confirmPassword} 
                                            onChange={handleChange} 
                                            placeholder="Ketik ulang password baru" 
                                            required={true}
                                        />
                                        
                                        {/* Feedback Kecocokan */}
                                        {formData.newPassword && formData.confirmPassword && (
                                            <div className={`mt-2 text-xs flex items-center gap-1 font-medium font-noto-sans
                                                ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                                {formData.newPassword === formData.confirmPassword ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        Password Cocok
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                        Password Tidak Cocok
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN*/}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 font-noto-sans">
                                    Syarat & Ketentuan
                                </h3>
                                
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <ul className="space-y-4 text-sm text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-noto-sans">1</div>
                                            <span>Password harus memiliki minimal <strong>6 karakter</strong>.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-noto-sans">2</div>
                                            <span>Password baru <strong>tidak boleh sama</strong> dengan password lama.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-noto-sans">3</div>
                                            <span>Disarankan menggunakan kombinasi huruf besar, kecil, dan angka.</span>
                                        </li>
                                    </ul>

                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex gap-3">
                                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <p className="text-xs text-yellow-800 leading-relaxed font-noto-sans">
                                            Setelah mengganti password, sesi login Anda di perangkat lain mungkin akan berakhir. Pastikan Anda mengingat password baru Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-4 sm:justify-start">
                            <ButtonCancel 
                                to="/dashboard/edit-profile"
                                text="Batal" 
                            />
                            <ButtonSave 
                                onClick={handleSubmit} 
                                isLoading={isLoading} 
                                text="Update Password" 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
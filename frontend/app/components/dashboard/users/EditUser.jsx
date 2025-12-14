import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { userService } from "../../../services/userService";
import { getPhotoUrl } from "../../../utils/urlHelper";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ImageUpload from "../common/ImageUpload";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData] = useState({
        username: "", email: "", phone_number: "", password: "", role: "",
        keahlian: [], fotoProfile: null
    });
    
    // Preview gambar
    const [previewImage, setPreviewImage] = useState("/profile-default.png");
    
    const [subjectsList, setSubjectsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Ambil List Subjects
                const subjectsRes = await fetch(`${API_BASE_URL}/admin/subjects`);
                const subjectsData = await subjectsRes.json();
                if (subjectsRes.ok) {
                    setSubjectsList(subjectsData.data.map(s => ({ 
                        label: s.nama_subject, 
                        value: s.id_subject 
                    })));
                }

                // Ambil Data User yang mau diedit
                const user = await userService.getUserById(id);

                setFormData({
                    username: user.nama_user,
                    email: user.email_user,
                    phone_number: user.phone || "",
                    password: "",
                    role: user.role,
                    keahlian: user.subject_ids || [],
                    fotoProfile: null
                });

                // Set Preview Foto dari Server
                setPreviewImage(getPhotoUrl(user.foto));

            } catch (error) {
                alert("Gagal memuat data user.");
                navigate("/dashboard/users");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, API_BASE_URL, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSelectJabatan = (value) => setFormData({ ...formData, role: value });

    const handleSelectKeahlian = (subjectId) => {
        setFormData((prev) => {
            const current = prev.keahlian || [];
            const updated = current.includes(subjectId)
                ? current.filter(id => id !== subjectId)
                : [...current, subjectId];
            return { ...prev, keahlian: updated };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fotoProfile: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Helper Text untuk Keahlian
    const getKeahlianLabel = () => {
        if (!formData.keahlian || formData.keahlian.length === 0) return "Pilih Keahlian";
        const selectedNames = subjectsList
            .filter(s => formData.keahlian.includes(s.value))
            .map(s => s.label);
        return selectedNames.join(", ");
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.role) {
            return alert("Nama, Email, dan Jabatan wajib diisi!");
        }

        if (formData.role !== "Admin" && formData.keahlian.length === 0) {
            return alert(`Role ${formData.role} wajib memiliki minimal satu keahlian!`);
        }

        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('nama_user', formData.username);
            payload.append('email_user', formData.email);
            payload.append('phone', formData.phone_number);
            payload.append('role', formData.role);
            
            // Kirim password hanya jika diisi
            if (formData.password) payload.append('password', formData.password);

            if (formData.role !== "Admin") {
                formData.keahlian.forEach(id => payload.append('subject_ids[]', id));
            }

            if (formData.fotoProfile) {
                payload.append('profile_picture', formData.fotoProfile);
            }

            await userService.updateUser(id, payload);

            alert("User Berhasil Diupdate!");
            navigate("/dashboard/users");

        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Data Jabatan
    const jabatanOptions = [
        { label: "Admin", value: "Admin" },
        { label: "Validator", value: "Validator" },
        { label: "Contributor", value: "Contributor" }
    ];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data user...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">
            
            {/* Header */}
            <PageHeader 
                title="Edit User"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data User", link: "../users" },
                    { label: "Edit User", link: null }
                ]}
            />

            {/* Layout Form */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* KOLOM KIRI */}
                <div className="bg-white shadow-lg w-full lg:flex-1 h-auto rounded-2xl p-6">
                    <InputField 
                        label="Name" name="username" value={formData.username} 
                        onChange={handleChange} required 
                    />
                    <InputField 
                        label="Email" name="email" type="email" value={formData.email} 
                        onChange={handleChange} required 
                    />
                    <InputField 
                        label="No Telepon" name="phone_number" value={formData.phone_number} 
                        onChange={handleChange} required 
                    />
                    <InputField 
                        label="Password Baru" name="password" type="password" 
                        value={formData.password} onChange={handleChange} 
                        placeholder="Isi hanya jika ingin ganti password" 
                    />
                </div>

                {/* KOLOM KANAN */}
                <div className="bg-white shadow-lg w-full lg:max-w-[350px] h-fit rounded-2xl p-6">
                    
                    {/* Dropdown Jabatan */}
                    <Dropdown 
                        label="Jabatan"
                        selectedText={formData.role || "Pilih Jabatan"}
                        options={jabatanOptions}
                        onSelect={handleSelectJabatan}
                        selectedValues={formData.role}
                    />

                    {/* Dropdown Keahlian */}
                    {formData.role !== "Admin" && (
                        <Dropdown 
                            label="Keahlian"
                            selectedText={getKeahlianLabel()}
                            options={subjectsList}
                            onSelect={handleSelectKeahlian}
                            multiSelect={true}
                            selectedValues={formData.keahlian}
                        />
                    )}

                    {/* Upload Foto */}
                    <ImageUpload 
                        label="Foto Profile"
                        previewImage={previewImage}
                        fileName={formData.fotoProfile ? formData.fotoProfile.name : "Ganti File"}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-4 flex items-center gap-4">
                <ButtonSave 
                    onClick={handleSubmit} 
                    isLoading={isSaving} 
                    text="Update User"
                />
                <ButtonCancel 
                    to="/dashboard/users" 
                    text="Batal" 
                />
            </div>

        </div>
    );
}
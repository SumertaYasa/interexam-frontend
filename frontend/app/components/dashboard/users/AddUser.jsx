import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { userService } from "../../../services/userService";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ImageUpload from "../common/ImageUpload";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";

export default function AddUser() {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // State Data
    const [formData, setFormData] = useState({
        username: "", email: "", phone_number: "", password: "", role: "",
        keahlian: [], fotoProfile: null
    });
    const [previewImage, setPreviewImage] = useState("/profile-default.png");
    const [subjectsList, setSubjectsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Subjects Keahlian
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/subjects`);
                const result = await response.json();
                if (response.ok) {
                    const formatted = result.data.map(s => ({ label: s.nama_subject, value: s.id_subject }));
                    setSubjectsList(formatted);
                }
            } catch (error) {
                console.error("Gagal ambil subject:", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fotoProfile: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Handler untuk Dropdown Jabatan
    const handleSelectJabatan = (value) => setFormData({ ...formData, role: value });

    // Handler untuk Multi Select Keahlian
    const handleSelectKeahlian = (subjectId) => {
        setFormData((prev) => {
            const current = prev.keahlian;
            const updated = current.includes(subjectId)
                ? current.filter(id => id !== subjectId)
                : [...current, subjectId]; 
            return { ...prev, keahlian: updated };
        });
    };

    // Helper text untuk tombol dropdown keahlian
    const getKeahlianLabel = () => {
        if (formData.keahlian.length === 0) return "Pilih Keahlian";
        const selectedNames = subjectsList
            .filter(s => formData.keahlian.includes(s.value))
            .map(s => s.label);
        return selectedNames.join(", ");
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.password || !formData.role) {
            return alert("Harap lengkapi data wajib!");
        }

        setIsLoading(true);
        try {
            const payload = new FormData();
            payload.append('nama_user', formData.username);
            payload.append('username', formData.email.split('@')[0]); 
            payload.append('email_user', formData.email);
            payload.append('phone', formData.phone_number);
            payload.append('password', formData.password);
            payload.append('role', formData.role);
            formData.keahlian.forEach(id => payload.append('subject_ids[]', id));
            if (formData.fotoProfile) payload.append('profile_picture', formData.fotoProfile);

            // Panggil Service
            await userService.createUser(payload); 
            
            alert("User Berhasil Ditambahkan!");
            navigate("/dashboard/users");

        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const jabatanOptions = [
        { label: "Admin", value: "Admin" },
        { label: "Validator", value: "Validator" },
        { label: "Contributor", value: "Contributor" }
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            {/* Header Halaman */}
            <PageHeader 
                title="Add User"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data User", link: "../users" },
                    { label: "Add User", link: null }
                ]}
            />

            {/* Layout Form */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* KOLOM KIRI*/}
                <div className="bg-white shadow-lg w-full lg:flex-1 h-auto rounded-2xl p-6">
                    <InputField 
                        label="Name" name="username" placeholder="Masukan nama" 
                        value={formData.username} onChange={handleChange} required 
                    />
                    <InputField 
                        label="Email" name="email" type="email" placeholder="Masukan email" 
                        value={formData.email} onChange={handleChange} required 
                    />
                    <InputField 
                        label="Nomor Telepon" name="phone_number" placeholder="Masukan nomor telepon" 
                        value={formData.phone_number} onChange={handleChange} required 
                    />
                    <InputField 
                        label="Password" name="password" type="password" placeholder="Masukan password" 
                        value={formData.password} onChange={handleChange} required 
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
                        fileName={formData.fotoProfile?.name}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-4 flex items-center gap-4">
                <ButtonSave 
                    onClick={handleSubmit} 
                    isLoading={isLoading} 
                    text="Simpan" 
                />
                <ButtonCancel 
                    to="/dashboard/users" 
                    text="Batal" 
                />
            </div>
        </div>
    );
}
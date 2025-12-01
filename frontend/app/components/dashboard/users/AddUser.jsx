import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function AddUser() {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        password: "",
        role: "",
        keahlian: [],
        fotoProfile: null
    });

    const [previewImage, setPreviewImage] = useState("/profile-default.png");

    const [subjectsList, setSubjectsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isJabatanOpen, setIsJabatanOpen] = useState(false);
    const [isKeahlianOpen, setIsKeahlianOpen] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/subjects`);
                const result = await response.json();
                if (response.ok) setSubjectsList(result.data);
            } catch (error) {
                console.error("Gagal ambil subject:", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fotoProfile: file });
            setPreviewImage(URL.createObjectURL(file)); // Buat preview lokal
        }
    };

    const handleSelectJabatan = (value) => {
        setFormData({ ...formData, role: value });
        setIsJabatanOpen(false);
    };

    const handleSelectKeahlian = (subjectId) => {
        setFormData((prev) => {
            const current = Array.isArray(prev.keahlian) ? prev.keahlian : [];
            let updated = current.includes(subjectId)
                ? current.filter((id) => id !== subjectId)
                : [...current, subjectId];
            return { ...prev, keahlian: updated };
        });
    };

    const renderSelectedSubjects = () => {
        if (formData.keahlian.length === 0) return "Pilih Keahlian";
        return subjectsList
            .filter(subj => formData.keahlian.includes(subj.id_subject))
            .map(subj => subj.nama_subject)
            .join(", ");
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.phone_number || !formData.password || !formData.role) {
            alert("Harap isi form dengan lengkap (Nama, Email, No HP, Password, Jabatan)!");
            return; 
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

            if (formData.fotoProfile) {
                payload.append('profile_picture', formData.fotoProfile);
            }

            const response = await fetch(`${API_BASE_URL}/admin/user`, {
                method: 'POST',
                body: payload
            });

            const result = await response.json();

            if (response.ok) {
                alert("User Berhasil Ditambahkan!");
                navigate("/dashboard/users");
            } else {
                alert(`Gagal: ${result.message}`);
            }

        } catch (error) {
            console.error("Error submit:", error);
            alert("Terjadi kesalahan koneksi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            {/* Head Navigasi */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Data User</h1>
                    </div>

                    <div className="mb-4 sm:mb-0">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                        </li>
                        <li className="inline-flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg>
                            <Link to="../users" className="inline-flex items-center text-gray-500 text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                            Data User
                            </Link>
                        </li>

                        <li aria-current="page">
                            <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Add User</span>
                            </div>
                        </li>

                        </ol>
                    </nav>
                    </div>

                </div>
            </div>

            {/* Form Add User */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Form Kiri */}
                <div className="bg-white shadow-lg w-full lg:flex-1 h-auto rounded-2xl">
                    <div className="p-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Name<span className="text-red-500">*</span></label>
                            <input type="text" name="username" onChange={handleChange} value={formData.username} className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-500 text-gray-900 text-sm rounded-2xl block w-full p-3.5" placeholder="Masukan nama" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Email<span className="text-red-500">*</span></label>
                            <input type="email" name="email" onChange={handleChange} value={formData.email} className="bg-gray-50 font-noto-sans border border-gray-300 placeholder:text-gray-500 text-gray-900 text-sm rounded-2xl block w-full p-3.5" placeholder="Masukan email" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Nomor Telepon<span className="text-red-500">*</span></label>
                            <input type="text" name="phone_number" onChange={handleChange} value={formData.phone_number} className="bg-gray-50 font-noto-sans border border-gray-300 placeholder:text-gray-500 text-gray-900 text-sm rounded-2xl block w-full p-3.5" placeholder="Masukan nomor telepon" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Password<span className="text-red-500">*</span></label>
                            <input type="password" name="password" onChange={handleChange} value={formData.password} className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-500 text-gray-900 text-sm rounded-2xl block w-full p-3.5" placeholder="Masukan password" required />
                        </div>
                    </div>
                </div>

                {/* Form Kanan */}
                <div className="bg-white shadow-lg w-full lg:max-w-[350px] h-fit rounded-2xl">
                    <div className="p-6">
                        {/* Jabatan */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan<span className="text-red-500">*</span></label>
                            <button type="button" onClick={() => setIsJabatanOpen(!isJabatanOpen)} className="w-full font-noto-sans inline-flex justify-between items-center  text-gray-900 bg-white focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none">
                                {formData.role || "Pilih Jabatan"}
                                <svg className={`w-5 h-5 ms-1.5 flex-shrink-0 transition-transform ${isJabatanOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {isJabatanOpen && (
                                <div className="absolute z-10 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white">
                                    <ul className="p-2 text-sm text-body font-medium">
                                        {["Admin", "Validator", "Contributor"].map((role) => (
                                            <li key={role}>
                                                <button type="button" onClick={() => handleSelectJabatan(role)} className="w-full text-left p-2 hover:bg-gray-100 rounded-lg">{role}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Keahlian */}
                        {formData.role !== "Admin" && (
                            <div className="relative mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keahlian<span className="text-red-500">*</span></label>
                                <button type="button" onClick={() => setIsKeahlianOpen(!isKeahlianOpen)} className="w-full font-noto-sans inline-flex justify-between items-center text-gray-900 bg-white focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none">
                                    <span className="block truncate text-left flex-1">{renderSelectedSubjects()}</span>
                                    <svg className={`w-5 h-5 ms-1.5 flex-shrink-0 transition-transform ${isKeahlianOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7"/></svg>
                                </button>
                                {isKeahlianOpen && (
                                    <div className="absolute z-20 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                        <ul className="p-2 text-sm text-body font-medium">
                                            {subjectsList.length > 0 ? subjectsList.map((subj) => (
                                                <li key={subj.id_subject}>
                                                    <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleSelectKeahlian(subj.id_subject)}>
                                                        <input type="checkbox" readOnly checked={formData.keahlian.includes(subj.id_subject)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"/>
                                                        <span className="ms-2 text-gray-900">{subj.nama_subject}</span>
                                                    </div>
                                                </li>
                                            )) : <li className="p-2 text-gray-500">Loading...</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Foto Profile dengan Preview */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Foto Profile <span className="text-gray-400 text-xs">(Opsional)</span></label>
                            
                            {/* Preview Image */}
                            <div className="mb-2 flex justify-center">
                                <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-gray-300" />
                            </div>

                            <div className="flex items-center w-full">
                                <label className="flex items-center w-full p-2 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors">
                                    <span className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl transition-colors">Pilih file</span>
                                    <span className="ml-4 text-sm text-gray-900 font-noto-sans truncate">
                                        {formData.fotoProfile ? formData.fotoProfile.name : "Default (Kosong)"}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <button type="button" onClick={handleSubmit} disabled={isLoading} className={`text-white bg-primary font-medium rounded-2xl text-sm px-8 py-3 shadow-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
                <Link to="/dashboard/users" className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-2xl text-sm px-8 py-3 shadow-sm transition-colors">Batal</Link>
            </div>

        </div>
    );
}
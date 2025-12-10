import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const ROOT_URL = API_BASE_URL.replace('/api/v1', '');

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        password: "",
        role: "",
        keahlian: [],
        fotoProfile: null,      
        existingFotoPath: null  
    });

    const [subjectsList, setSubjectsList] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isJabatanOpen, setIsJabatanOpen] = useState(false);
    const [isKeahlianOpen, setIsKeahlianOpen] = useState(false);
    

    const [previewUrl, setPreviewUrl] = useState("/profile-default.png");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectsRes = await fetch(`${API_BASE_URL}/admin/subjects`);
                const subjectsData = await subjectsRes.json();
                if (subjectsRes.ok) setSubjectsList(subjectsData.data);

                const userRes = await fetch(`${API_BASE_URL}/admin/user/${id}`);
                const userDataResult = await userRes.json();
                
                if (userRes.ok) {
                    const user = userDataResult.data;

                    setFormData({
                        username: user.nama_user,
                        email: user.email_user,
                        phone_number: user.phone || "",
                        password: "", 
                        role: user.role,
                        keahlian: user.subject_ids || [],
                        fotoProfile: null,
                        existingFotoPath: user.foto 
                    });

                    if (user.foto) {

                        const relativePath = user.foto.split('uploads')[1]; 

                        const cleanPath = relativePath.replace(/\\/g, '/'); 
                        setPreviewUrl(`${ROOT_URL}/uploads${cleanPath}`);
                    } 
                } else {
                    alert("User tidak ditemukan!");
                    navigate("/dashboard/users");
                }

            } catch (error) {
                console.error("Error fetch data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectJabatan = (value) => {
        setFormData({ ...formData, role: value });
        setIsJabatanOpen(false);
    };

    const handleSelectKeahlian = (subjectId) => {
        setFormData((prev) => {
            const current = Array.isArray(prev.keahlian) ? prev.keahlian : [];
            let updated;
            if (current.includes(subjectId)) {
                updated = current.filter((id) => id !== subjectId);
            } else {
                updated = [...current, subjectId];
            }
            return { ...prev, keahlian: updated };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fotoProfile: file });
 
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const renderSelectedSubjects = () => {
        if (formData.keahlian.length === 0) return "Pilih Keahlian";
        const names = subjectsList
            .filter(subj => formData.keahlian.includes(subj.id_subject))
            .map(subj => subj.nama_subject);
        return names.join(", ");
    };

    const handleSubmit = async () => {

        if(!formData.username || !formData.email || !formData.role) {
            alert("Nama, Email, dan Jabatan wajib diisi!");
            return;
        }

        if (formData.role !== "Admin") {
            if (!formData.keahlian || formData.keahlian.length === 0) {
                alert(`Role ${formData.role} wajib memiliki minimal satu keahlian!`);
                return;
            }
        }

        setIsLoading(true);
        try {
            const payload = new FormData();
            
            payload.append('nama_user', formData.username); 
            payload.append('email_user', formData.email);
            payload.append('phone', formData.phone_number);
            payload.append('role', formData.role);
            
            if (formData.password) {
                payload.append('password', formData.password);
            }

            if (formData.role !== "Admin") {
                 formData.keahlian.forEach(id => {
                    payload.append('subject_ids[]', id);
                });
            } else {

            }

            if (formData.fotoProfile) {
                payload.append('profile_picture', formData.fotoProfile);
            }

            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
                method: 'PUT',
                body: payload 
            });

            const result = await response.json();

            if (response.ok) {
                alert("User Berhasil Diupdate!");
                navigate("/dashboard/users"); 
            } else {
                alert(`Gagal: ${result.message}`);
            }

        } catch (error) {
            console.error("Error update:", error);
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
                    <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Edit User</h1>
                    </div>

                    <div className="mb-4 sm:mb-0">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                        </li>
                        <li className="inline-flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                            <Link to="../users" className="inline-flex items-center text-gray-500 text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                            Data User
                            </Link>
                        </li>

                        <li aria-current="page">
                            <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Edit User</span>
                            </div>
                        </li>

                        </ol>
                    </nav>
                    </div>

                </div>
            </div>

            {/* Form Edit */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* KIRI */}
                <div className="bg-white shadow-lg w-full lg:flex-1 h-auto rounded-2xl">
                    <div className="p-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Name</label>
                            <input type="text" name="username" onChange={handleChange} value={formData.username} className="bg-gray-50 border font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Email</label>
                            <input type="email" name="email" onChange={handleChange} value={formData.email} className="bg-gray-50 font-noto-sans border border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">No Telepon</label>
                            <input type="text" name="phone_number" onChange={handleChange} value={formData.phone_number} className="bg-gray-50 font-noto-sans border border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Password Baru  <span className="text-xs text-gray-400">(Kosongkan jika tidak ubah)</span></label>
                            <input type="password" name="password" onChange={handleChange} value={formData.password} className="bg-gray-50 border font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 placeholder:text-gray-500 " placeholder="Isi hanya jika ingin ganti password" />
                        </div>
                    </div>
                </div>

                {/* KANAN */}
                <div className="bg-white shadow-lg w-full lg:max-w-[350px] h-fit rounded-2xl">
                    <div className="p-6">
                        
                        {/* Jabatan */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                            <button type="button" onClick={() => setIsJabatanOpen(!isJabatanOpen)} className="w-full font-noto-sans inline-flex justify-between items-center text-gray-900 bg-white focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none">
                                {formData.role || "Pilih Jabatan"}
                                <svg className={`w-5 h-5 transition-transform ${isJabatanOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7"/></svg>
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

                        {/* Keahlian (Validasi di Submit) */}
                        {formData.role !== "Admin" && (
                            <div className="relative mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keahlian <span className="text-red-500">*</span> 
                                </label>
                                <button type="button" onClick={() => setIsKeahlianOpen(!isKeahlianOpen)} className="w-full font-noto-sans inline-flex justify-between items-center text-gray-900 bg-white focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none">
                                    <span className="block truncate text-left flex-1">{renderSelectedSubjects()}</span>
                                    <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${isKeahlianOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7"/></svg>
                                </button>
                                {isKeahlianOpen && (
                                    <div className="absolute z-20 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                        <ul className="p-2 text-sm text-body font-medium">
                                            {subjectsList.map((subj) => (
                                                <li key={subj.id_subject}>
                                                    <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleSelectKeahlian(subj.id_subject)}>
                                                        <input type="checkbox" readOnly checked={formData.keahlian.includes(subj.id_subject)} className="w-4 h-4 text-blue-600 pointer-events-none"/>
                                                        <span className="ms-2 text-gray-900">{subj.nama_subject}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Pesan error kecil jika kosong */}
                                {formData.keahlian.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">Wajib pilih minimal satu.</p>
                                )}
                            </div>
                        )}

                        {/* Foto Profile */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profile</label>
                            
                            {/* PREVIEW IMAGE */}
                            <div className="mb-3 flex justify-center">
                                <img 
                                    src={previewUrl} 
                                    alt="Preview Profile" 
                                    className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
                                    // Fallback jika gambar rusak/404
                                    onError={(e) => { e.target.src = "/profile-default.png"; }} 
                                />
                            </div>

                            <div className="flex items-center w-full">
                                <label className="flex items-center w-full p-2 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <span className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl">Ganti File</span>
                                    <span className="ml-4 text-sm text-gray-900 truncate">
                                        {formData.fotoProfile ? formData.fotoProfile.name : "Klik untuk ubah foto..."}
                                    </span>
                                    {/* Handle File Change */}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <button type="button" onClick={handleSubmit} disabled={isLoading} className="text-white bg-primary font-medium rounded-2xl text-sm px-4 py-3 shadow-md">
                    {isLoading ? "Menyimpan..." : "Update User"}
                </button>
                <Link to="/dashboard/users" className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-2xl text-sm px-8 py-3 shadow-sm">Batal</Link>
            </div>

        </div>
    );
}
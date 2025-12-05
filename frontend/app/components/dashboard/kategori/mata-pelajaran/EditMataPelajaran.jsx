import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";

export default function EditMataPelajaran() {
    const navigate = useNavigate();
    const { id } = useParams();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData] = useState({
        nama_subject: "", 
        keterangan: ""   
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); 

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/subjects`);
                const result = await response.json();
                
                if (response.ok) {
                    const subject = result.data.find(s => s.id_subject === parseInt(id));
                    if (subject) {
                        setFormData({
                            nama_subject: subject.nama_subject,
                            keterangan: subject.keterangan || ""
                        });
                    } else {
                        alert("Mata pelajaran tidak ditemukan!");
                        navigate("../mata-pelajaran");
                    }
                }
            } catch (error) {
                console.error("Gagal ambil data:", error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchSubject();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); 

        if (!formData.nama_subject) {
            alert("Nama Mata Pelajaran wajib diisi!");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Sukses! ${result.message}`);
                navigate("../mata-pelajaran"); 
            } else {
                alert(`Gagal: ${result.message}`);
            }

        } catch (error) {
            console.error("Error update:", error);
            alert("Terjadi kesalahan koneksi ke server.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center">Memuat data...</div>;
    }

    return(
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            {/* Navigasi Head */}
            <div className="pb-6">
                <div className=" sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Edit Mata Pelajaran</h1>
                    </div>
                    <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                                </li>
                                <li className="inline-flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg>
                                    <Link to="../mata-pelajaran" className="inline-flex text-gray-500 items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                                        Data Mata Pelajaran
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" /></svg>
                                        <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Edit</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Form Edit Subject */}
            <form onSubmit={handleUpdate}>
                <div className="bg-white shadow-lg flex-1 h-auto rounded-2xl w-full max-w-[600px]"> 
                    <div className="p-6">

                        {/* Input Nama Mata Pelajaran */}
                        <div className="mb-4">
                            <label htmlFor="id_nama_subject" className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Nama Mata Pelajaran<span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                id="id_nama_subject" 
                                name="nama_subject"
                                value={formData.nama_subject}
                                onChange={handleChange}
                                className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                                required 
                            />
                        </div>
                        
                        {/* Input Keterangan */}
                        <div className="mt-4">
                            <label htmlFor="id_keterangan" className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Keterangan (Opsional)</label>
                            <textarea
                                id="id_keterangan"
                                name="keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                rows="3"
                                className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-4 flex gap-4 justify-start max-w-lg mx-auto sm:mx-0"> 
                    <button type="submit" 
                        disabled={isLoading}
                        className={`text-white bg-primary  shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? "Menyimpan..." : "Update"}
                    </button>
                    
                    <Link 
                        to="../mata-pelajaran"
                        className="text-primary bg-white border border-primary hover:bg-gray-50 shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none">
                        Batal
                    </Link>
                </div>
            
            </form>
            
        </div>
    );
}
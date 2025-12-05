import { Link, useNavigate, useParams } from "react-router"; 
import { useState, useEffect } from "react";

export default function EditTopik() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // State Form
    const [formData, setFormData] = useState({
        nama_topics: "",
        keterangan: "",
        id_subjects: "",
        nama_subject_display: "", 
        id_jenjang: "",
        nama_jenjang_display: "", 
    });

    const [subjectList, setSubjectList] = useState([]);
    const [jenjangList, setJenjangList] = useState([]);

    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isMapelOpen, setIsMapelOpen] = useState(false);
    const [isJenjangOpen, setIsJenjangOpen] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [resSubject, resJenjang, resTopic] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/subjects`),
                    fetch(`${API_BASE_URL}/admin/jenjang`),
                    fetch(`${API_BASE_URL}/topics/${id}`) 
                ]);

                if (resSubject.ok) {
                    const dataSub = await resSubject.json();
                    setSubjectList(dataSub.data);
                }
                if (resJenjang.ok) {
                    const dataJen = await resJenjang.json();
                    setJenjangList(dataJen.data);
                }

                if (resTopic.ok) {
                    const dataTopic = await resTopic.json();
                    const topic = dataTopic.data;

                    setFormData({
                        nama_topics: topic.nama_topics,
                        keterangan: topic.keterangan || "",
                        id_subjects: topic.id_subjects,
                        nama_subject_display: topic.subject?.nama_subject || "Pilih Mata Pelajaran", 
                        id_jenjang: topic.id_jenjang,
                        nama_jenjang_display: topic.jenjang?.nama_jenjang || "Pilih Jenjang",
                    });
                } else {
                    alert("Gagal mengambil data topik.");
                    navigate("../topik");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Terjadi kesalahan saat memuat data.");
            } finally {
                setIsFetching(false); 
            }
        };

        fetchInitialData();
    }, [id, API_BASE_URL, navigate]);

    const handleSelectMapel = (subject) => {
        setFormData({ 
            ...formData, 
            id_subjects: subject.id_subject,       
            nama_subject_display: subject.nama_subject 
        });
        setIsMapelOpen(false); 
    };

    const handleSelectJenjang = (item) => {
        setFormData({ 
            ...formData, 
            id_jenjang: item.id_jenjang,            
            nama_jenjang_display: item.nama_jenjang 
        });
        setIsJenjangOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nama_topics || !formData.id_subjects || !formData.id_jenjang) {
            alert("Harap lengkapi data wajib (*)");
            return;
        }

        setIsSaving(true); 

        try {
            const payload = {
                nama_topics: formData.nama_topics,
                keterangan: formData.keterangan,
                id_subjects: parseInt(formData.id_subjects),
                id_jenjang: parseInt(formData.id_jenjang)
            };

            const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Gagal mengupdate topik");
            }

            alert("Topik berhasil diperbarui!");
            navigate("../topik");

        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan: " + error.message);
        } finally {
            setIsSaving(false); 
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center text-gray-500 font-noto-sans">Sedang mengambil data...</div>;
    }

    return(
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            {/* Navigasi Head */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Edit Topik</h1>
                    </div>
                     <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                                </li>
                                <li className="inline-flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                    <Link to="../topik" className="inline-flex text-gray-500 items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                                        Data Topik
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                        <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Edit Topik</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

 
            <form onSubmit={handleSubmit} className="bg-white shadow-lg flex-1 h-auto rounded-2xl w-full max-w-[600px]">
                <div className="p-6">

                    {/* MATA PELAJARAN */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Mata Pelajaran <span className="text-red-500">*</span>
                        </label>
                        <button 
                            type="button"
                            onClick={() => setIsMapelOpen(!isMapelOpen)}
                            className="relative z-20 truncate w-full font-noto-sans inline-flex text-gray-900 bg-brand focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                            {formData.nama_subject_display}
                            <svg className={`w-5 h-5 transition-transform ${isMapelOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
                        </button>
                        
                        {isMapelOpen && (
                            <div className="absolute z-20 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                <ul className="p-2 text-sm text-body font-medium">
                                    {subjectList.map((subject) => (
                                        <li key={subject.id_subject}>
                                            <button type="button" onClick={() => handleSelectMapel(subject)}
                                                className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-left">
                                                {subject.nama_subject}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* NAMA TOPIK */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Topik <span className="text-red-500">*</span></label>
                        <input type="text" name="nama_topics" value={formData.nama_topics} onChange={handleChange}
                            className="bg-gray-50 border font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5"
                            placeholder="Masukan nama topik" required />
                    </div>

                    {/* KETERANGAN */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Keterangan</label>
                        <input type="text" name="keterangan" value={formData.keterangan} onChange={handleChange}
                            className="bg-gray-50 border font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5"
                            placeholder="Masukan keterangan topik" />
                    </div>

                    {/* JENJANG */}
                    <div className="relative mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Jenjang <span className="text-red-500">*</span>
                        </label>
                        <button 
                            type="button"
                            onClick={() => setIsJenjangOpen(!isJenjangOpen)}
                            className="relative z-10 truncate w-full font-noto-sans inline-flex text-gray-900 bg-brand focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                            {formData.nama_jenjang_display}
                            <svg className={`w-5 h-5 transition-transform ${isJenjangOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
                        </button>
                        {isJenjangOpen && (
                            <div className="absolute z-10 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                <ul className="p-2 text-sm text-body font-medium">
                                    {jenjangList.map((item) => (
                                        <li key={item.id_jenjang}>
                                            <button type="button" onClick={() => handleSelectJenjang(item)}
                                                className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-left">
                                                {item.nama_jenjang}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                </div>

                {/* Tombol Simpan & Batal */}
                <div className="p-6 pt-0 mt-4 flex gap-4">
                    <button type="submit" 
                        disabled={isSaving} 
                        className={`text-white bg-primary bg-brand rounded-2xl text-sm px-6 py-2.5 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <Link to="../topik"
                        className="text-primary bg-white border-primary border rounded-2xl text-sm px-8 py-2.5 flex items-center justify-center">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
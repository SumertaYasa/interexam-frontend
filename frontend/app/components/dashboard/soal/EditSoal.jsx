import { Link, useNavigate, useParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function EditSoal() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // Config
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
    const SERVER_URL = "http://localhost:5000"; 

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tipeSoal, setTipeSoal] = useState("Pilihan Ganda");
    const [isTipeSoalOpen, setIsTipeSoalOpen] = useState(false); 
    const [soalText, setSoalText] = useState("");
    const [soalImage, setSoalImage] = useState(null); 
    const [soalPreview, setSoalPreview] = useState(null); 
    const [pembahasan, setPembahasan] = useState("");
    const [catatanRevisi, setCatatanRevisi] = useState("");

    const [opsiJawaban, setOpsiJawaban] = useState([
        { id: 1, text: "", isCorrect: false, image: null, preview: null, oldPath: null }, 
        { id: 2, text: "", isCorrect: false, image: null, preview: null, oldPath: null },
        { id: 3, text: "", isCorrect: false, image: null, preview: null, oldPath: null },
        { id: 4, text: "", isCorrect: false, image: null, preview: null, oldPath: null },
    ]);

    const soalFileInputRef = useRef(null);
    const [subjectList, setSubjectList] = useState([]);
    const [topikList, setTopikList] = useState([]);
    const [levelList, setLevelList] = useState([]);
    const [formDataIDs, setFormDataIDs] = useState({ id_mata_pelajaran: "", id_topik: "", level_kesulitan: "" });
    const [formDataDisplay, setFormDataDisplay] = useState({ nama_subject_display: "", nama_topik_display: "", level_kesulitan_display: "" });
    const [isMapelOpen, setIsMapelOpen] = useState(false);
    const [isTopikOpen, setIsTopikOpen] = useState(false);
    const [isLevelOpen, setIsLevelOpen] = useState(false);
    const tipeSoalList = ["Pilihan Ganda", "Multi Jawaban"]; 

    // Fetch Data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [subjectsRes, levelsRes, questionsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/contributor/lookup/subjects`),
                    axios.get(`${API_BASE_URL}/contributor/lookup/levels`),
                    axios.get(`${API_BASE_URL}/contributor/my-questions`)
                ]);
                
                setSubjectList(subjectsRes.data.data);
                setLevelList(levelsRes.data.data);

                const currentSoal = questionsRes.data.data.find(q => q.id == id);

                if (currentSoal) {
                    setSoalText(currentSoal.text_soal || "");
                    setPembahasan(currentSoal.pembahasan_umum || "");
                    setTipeSoal(currentSoal.tipe_soal === 'multiple_choice' ? 'Pilihan Ganda' : 'Multi Jawaban');
                    setCatatanRevisi(currentSoal.catatan_revisi || ""); 

                    if (currentSoal.gambar) {
                        const cleanPath = currentSoal.gambar.replace(/\\/g, "/");
                        setSoalPreview(`${SERVER_URL}/${cleanPath}`); 
                    }

                    setFormDataIDs({ id_topik: currentSoal.id_topik, level_kesulitan: currentSoal.level_kesulitan });
                    setFormDataDisplay({ 
                        nama_subject_display: currentSoal.mata_pelajaran, 
                        nama_topik_display: currentSoal.mata_pelajaran, 
                        level_kesulitan_display: currentSoal.level_kesulitan 
                    });

                    if (currentSoal.list_jawaban && currentSoal.list_jawaban.length > 0) {
                        const mappedOpsi = currentSoal.list_jawaban.map((jw, index) => {
                            const cleanPath = jw.path_gambar_jawaban ? jw.path_gambar_jawaban.replace(/\\/g, "/") : null;
                            return {
                                id: index + 1,
                                text: jw.opsi_jawaban_text,
                                isCorrect: jw.status === true, 
                                image: null, 
                                preview: cleanPath ? `${SERVER_URL}/${cleanPath}` : null,
                                oldPath: jw.path_gambar_jawaban 
                            };
                        });
                        while (mappedOpsi.length < 4) mappedOpsi.push({ id: mappedOpsi.length + 1, text: "", isCorrect: false, image: null, preview: null, oldPath: null });
                        setOpsiJawaban(mappedOpsi);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Gagal mengambil data soal.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [id, API_BASE_URL]);

    // Handlers
    const handleSelectTipeSoal = (val) => { setTipeSoal(val); setIsTipeSoalOpen(false); setOpsiJawaban(opsiJawaban.map(o => ({...o, isCorrect: false}))); };
    const handleFileChangeSoal = (e) => { const file = e.target.files[0]; if (file) { setSoalImage(file); setSoalPreview(URL.createObjectURL(file)); } };
    const handleRemoveSoalImage = () => { setSoalImage(null); setSoalPreview(null); if(soalFileInputRef.current) soalFileInputRef.current.value=""; };
    const handleFileChangeOpsi = (id, e) => { const file = e.target.files[0]; if (file) { setOpsiJawaban(opsiJawaban.map(o => o.id === id ? { ...o, image: file, preview: URL.createObjectURL(file) } : o)); } };
    const handleRemoveOpsiImage = (id) => { setOpsiJawaban(opsiJawaban.map(o => o.id === id ? { ...o, image: null, preview: null, oldPath: null } : o)); };
    const handleCheckAnswer = (id) => {
        if (tipeSoal === "Pilihan Ganda") setOpsiJawaban(opsiJawaban.map(o => ({ ...o, isCorrect: o.id === id })));
        else setOpsiJawaban(opsiJawaban.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o));
    };
    const handleInputOpsi = (id, val) => setOpsiJawaban(opsiJawaban.map(o => o.id === id ? { ...o, text: val } : o));
    const handleSelectTopik = (t) => { setFormDataDisplay(p => ({...p, nama_topik_display: t.name})); setFormDataIDs(p => ({...p, id_topik: t.id})); setIsTopikOpen(false); };
    const handleSelectLevel = (l) => { setFormDataDisplay(p => ({...p, level_kesulitan_display: l.label})); setFormDataIDs(p => ({...p, level_kesulitan: l.value})); setIsLevelOpen(false); };
    const handleSelectSubject = async (s) => { 
        setFormDataDisplay(p => ({...p, nama_subject_display: s.name, nama_topik_display: ""})); setFormDataIDs(p => ({...p, id_topik: ""})); setIsMapelOpen(false);
        const res = await axios.get(`${API_BASE_URL}/contributor/lookup/topics/${s.id}`);
        setTopikList(res.data.data);
    };

    // Submit
    const handleSubmit = async (actionType) => {
        if (!soalText || !formDataIDs.id_topik) return alert("Lengkapi data!");
        setIsSubmitting(true);
        const formData = new FormData();
        const backendTipeSoal = tipeSoal === "Pilihan Ganda" ? "pilihan_ganda" : "multi_jawaban";
        
        formData.append("tipe_soal", backendTipeSoal);
        formData.append("text_soal", soalText);
        formData.append("id_topik", formDataIDs.id_topik);
        formData.append("level_kesulitan", formDataIDs.level_kesulitan || "mudah");
        formData.append("pembahasan_umum", pembahasan);
        formData.append("action_type", actionType);
        if (soalImage) formData.append("image_soal", soalImage);

        const formattedOpsi = opsiJawaban.map(opsi => {
            if (opsi.image) formData.append("image_jawaban", opsi.image);
            return {
                text: opsi.text,
                is_correct: opsi.isCorrect,
                has_image: !!opsi.image,
                old_path: opsi.oldPath
            };
        });
        formData.append("opsi_jawaban", JSON.stringify(formattedOpsi));

        try {
            await axios.put(`${API_BASE_URL}/contributor/question/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            alert("Berhasil diperbarui!");
            navigate("../soal");
        } catch (error) {
            console.error(error); alert("Gagal update.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">
            {/* Header */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0"><h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Edit Soal</h1></div>
                    <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center"><Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link></li>
                                <li className="inline-flex items-center"><svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg><Link to="../soal" className="inline-flex items-center text-gray-500 text-sm font-noto-sans font-medium hover:text-primary-hover">Data Soal</Link></li>
                                <li aria-current="page"><div className="flex items-center"><svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg><span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Edit Soal</span></div></li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="w-full lg:flex-1 space-y-6">
                    {/* Soal */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <div className="mb-6 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Tipe Soal*</label>
                            <button onClick={() => setIsTipeSoalOpen(!isTipeSoalOpen)} className="relative w-full text-left bg-gray-50 border border-gray-300 rounded-2xl p-3.5 flex justify-between items-center">
                                {tipeSoal} <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            {isTipeSoalOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                    {tipeSoalList.map((t, i) => <button key={i} onClick={() => handleSelectTipeSoal(t)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{t}</button>)}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Soal*</label>
                            <input type="text" value={soalText} onChange={(e) => setSoalText(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-2xl block w-full p-3.5 pr-12" placeholder="Masukan soal" />
                            <input type="file" ref={soalFileInputRef} onChange={handleFileChangeSoal} className="hidden" />
                            <button onClick={() => soalFileInputRef.current.click()} className="absolute right-3 top-9 text-gray-400 hover:text-primary"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button>
                            {soalPreview && (
                                <div className="mt-4 relative w-fit">
                                    <img src={soalPreview} alt="Preview" className="h-40 rounded-lg border object-contain" />
                                    <button onClick={handleRemoveSoalImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">X</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Opsi */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">Opsi Jawaban*</label>
                        <div className="space-y-6">
                            {opsiJawaban.map((opsi) => (
                                <div key={opsi.id} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleCheckAnswer(opsi.id)} className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${opsi.isCorrect ? 'border-primary bg-primary' : 'border-primary bg-white'}`}>
                                            {opsi.isCorrect && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                        </button>
                                        <div className="relative w-full">
                                            <input type="text" value={opsi.text} onChange={(e) => handleInputOpsi(opsi.id, e.target.value)} className="bg-gray-50 border border-gray-300 rounded-2xl block w-full p-3.5 pr-12" placeholder={`Jawaban ${String.fromCharCode(64 + opsi.id)}`} />
                                            <input type="file" id={`file-input-${opsi.id}`} onChange={(e) => handleFileChangeOpsi(opsi.id, e)} className="hidden" />
                                            <button onClick={() => document.getElementById(`file-input-${opsi.id}`).click()} className="absolute right-3 top-3.5 text-gray-400 hover:text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button>
                                        </div>
                                    </div>
                                    {opsi.preview && (
                                        <div className="ml-9 mt-1 relative w-fit">
                                            <img src={opsi.preview} alt="Preview" className="h-24 rounded-lg border object-cover" />
                                            <button onClick={() => handleRemoveOpsiImage(opsi.id)} className="absolute -top-2 -right-2 bg-white text-red-500 border rounded-full p-0.5">X</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pembahasan*</label>
                        <textarea rows="4" value={pembahasan} onChange={(e) => setPembahasan(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-2xl w-full p-3.5"></textarea>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:max-w-[400px] space-y-4">
                    <div className="flex justify-end gap-3"><button onClick={() => handleSubmit("Ajukan")} className="bg-primary text-white px-4 py-2 rounded-2xl">Simpan Perubahan</button></div>
                    <div className="bg-white shadow-lg rounded-2xl p-6"><h1 className="text-red-500 text-sm">{catatanRevisi || "Tidak ada pesan."}</h1></div>
                    
                    <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran*</label>
                            <button onClick={() => setIsMapelOpen(!isMapelOpen)} className="w-full text-left bg-gray-50 border border-gray-300 rounded-2xl p-3.5 flex justify-between">{formDataDisplay.nama_subject_display || "Pilih"} <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg></button>
                            {isMapelOpen && <div className="absolute z-20 w-full bg-white shadow-lg rounded-xl mt-1">{subjectList.map(s => <button key={s.id} onClick={() => handleSelectSubject(s)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{s.name}</button>)}</div>}
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topik*</label>
                            <button onClick={() => setIsTopikOpen(!isTopikOpen)} className="w-full text-left bg-gray-50 border border-gray-300 rounded-2xl p-3.5 flex justify-between">{formDataDisplay.nama_topik_display || "Pilih"} <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg></button>
                            {isTopikOpen && <div className="absolute z-20 w-full bg-white shadow-lg rounded-xl mt-1">{topikList.map(t => <button key={t.id} onClick={() => handleSelectTopik(t)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{t.name}</button>)}</div>}
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level*</label>
                            <button onClick={() => setIsLevelOpen(!isLevelOpen)} className="w-full text-left bg-gray-50 border border-gray-300 rounded-2xl p-3.5 flex justify-between">{formDataDisplay.level_kesulitan_display || "Pilih"} <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg></button>
                            {isLevelOpen && <div className="absolute z-20 w-full bg-white shadow-lg rounded-xl mt-1">{levelList.map(l => <button key={l.value} onClick={() => handleSelectLevel(l)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{l.label}</button>)}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { Link } from "react-router";
import { useState, useRef } from "react";

export default function EditSoal() {

    const [tipeSoal, setTipeSoal] = useState("Pilihan Ganda");
    const [isTipeSoalOpen, setIsTipeSoalOpen] = useState(false); 
    
    const [soalText, setSoalText] = useState("");

    const [soalImage, setSoalImage] = useState(null); 
    const [soalPreview, setSoalPreview] = useState(null); 

    const [pembahasan, setPembahasan] = useState("");

    const [opsiJawaban, setOpsiJawaban] = useState([
        { id: 1, text: "", isCorrect: false, image: null, preview: null }, 
        { id: 2, text: "", isCorrect: false, image: null, preview: null },
        { id: 3, text: "", isCorrect: false, image: null, preview: null },
        { id: 4, text: "", isCorrect: false, image: null, preview: null },
    ]);

    const soalFileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        nama_subject_display: "",
        nama_topik_display: "",
        level_kesulitan_display: "",
    });

    const [isMapelOpen, setIsMapelOpen] = useState(false);
    const [isTopikOpen, setIsTopikOpen] = useState(false);
    const [isLevelOpen, setIsLevelOpen] = useState(false);

    const subjectList = [ { id_subject: 1, nama_subject: "Matematika" }, { id_subject: 2, nama_subject: "Bahasa Indonesia" }, { id_subject: 3, nama_subject: "IPA" } ];
    const topikList = [ { id: 1, nama: "Aljabar" }, { id: 2, nama: "Geometri" }, { id: 3, nama: "Statistika" } ];
    const levelList = ["Mudah", "Sedang", "Sulit"];
    const tipeSoalList = ["Pilihan Ganda", "Multi Jawaban"]; 

    // HANDLER TIPE SOAL
    const handleSelectTipeSoal = (value) => {
        setTipeSoal(value);
        setIsTipeSoalOpen(false); 

        const resetOpsi = opsiJawaban.map(opsi => ({...opsi, isCorrect: false}));
        setOpsiJawaban(resetOpsi);
    };

    // HANDLER GAMBAR SOAL
    const handleTriggerSoalFile = () => {
        soalFileInputRef.current.click();
    };

    const handleFileChangeSoal = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSoalImage(file);
            setSoalPreview(URL.createObjectURL(file)); 
        }
    };

    const handleRemoveSoalImage = () => {
        setSoalImage(null);
        setSoalPreview(null);
        if (soalFileInputRef.current) soalFileInputRef.current.value = ""; 
    };

    // HANDLER GAMBAR OPSI (JAWABAN)
    const handleTriggerOpsiFile = (id) => {
        document.getElementById(`file-input-opsi-${id}`).click();
    };

    const handleFileChangeOpsi = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            const newOpsi = opsiJawaban.map((opsi) => 
                opsi.id === id ? { ...opsi, image: file, preview: objectUrl } : opsi
            );
            setOpsiJawaban(newOpsi);
        }
    };

    const handleRemoveOpsiImage = (id) => {
        const newOpsi = opsiJawaban.map((opsi) => 
            opsi.id === id ? { ...opsi, image: null, preview: null } : opsi
        );
        setOpsiJawaban(newOpsi);
        const inputElem = document.getElementById(`file-input-opsi-${id}`);
        if (inputElem) inputElem.value = "";
    };

    // Handler Logika Lainnya
    const handleCheckAnswer = (id) => {
        if (tipeSoal === "Pilihan Ganda") {
            const newOpsi = opsiJawaban.map((opsi) => ({
                ...opsi,
                isCorrect: opsi.id === id ? true : false,
            }));
            setOpsiJawaban(newOpsi);
        } else {
            const newOpsi = opsiJawaban.map((opsi) => 
                opsi.id === id ? { ...opsi, isCorrect: !opsi.isCorrect } : opsi
            );
            setOpsiJawaban(newOpsi);
        }
    };

    const handleInputOpsi = (id, value) => {
        const newOpsi = opsiJawaban.map((opsi) =>
            opsi.id === id ? { ...opsi, text: value } : opsi
        );
        setOpsiJawaban(newOpsi);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">

            {/* --- Head Navigasi --- */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Edit Soal</h1>
                    </div>
                    <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                                </li>
                                <li className="inline-flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                    <Link to="../soal" className="inline-flex items-center text-gray-500 text-sm font-noto-sans font-medium hover:text-primary-hover">
                                        Data Soal
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                                        <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Edit Soal</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>


            <div className="flex flex-col lg:flex-row gap-10">
                {/* --- KOLOM KIRI --- */}
                <div className="w-full lg:flex-1 space-y-6">
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        {/* --- TIPE SOAL--- */}
                        <div className="mb-6 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                                Tipe Soal<span className="text-red-500">*</span>
                            </label>
                            
                            <button 
                                type="button"
                                onClick={() => setIsTipeSoalOpen(!isTipeSoalOpen)}
                                className="relative w-full text-left font-noto-sans bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl p-3.5 flex justify-between items-center"
                            >
                                <span className="text-gray-900">
                                    {tipeSoal}
                                </span>
                                <svg className={`w-5 h-5 text-gray-900 transition-transform ${isTipeSoalOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>

                            {/* Dropdown Menu Tipe Soal */}
                            {isTipeSoalOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                    <ul className="py-1 text-sm text-gray-700">
                                        {tipeSoalList.map((type, index) => (
                                            <li key={index}>
                                                <button type="button" 
                                                    onClick={() => handleSelectTipeSoal(type)}
                                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 font-noto-sans ${tipeSoal === type ? 'bg-gray-50 text-primary font-medium' : ''}`}
                                                >
                                                    {type}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Input Soal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                                Soal<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={soalText}
                                    onChange={(e) => setSoalText(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 pr-12 font-noto-sans placeholder-gray-400" 
                                    placeholder="Masukan soal" 
                                />
                                
                                <input 
                                    type="file" 
                                    ref={soalFileInputRef}
                                    onChange={handleFileChangeSoal}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <button 
                                    type="button" 
                                    onClick={handleTriggerSoalFile}
                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 transition-transform ${soalPreview ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="Upload Gambar Soal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </button>
                            </div>

                            {soalPreview && (
                                <div className="mt-4 relative group w-fit">
                                    <img 
                                        src={soalPreview} 
                                        alt="Preview Soal" 
                                        className="h-auto max-h-[300px] w-auto max-w-full rounded-lg border border-gray-200 object-contain"
                                    />
                                    <button 
                                        onClick={handleRemoveSoalImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        title="Hapus Gambar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Opsi Jawaban */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                                Opsi Jawaban<span className="text-red-500">*</span>
                            </label>
                            <p className="block text-sm font-medium text-gray-400  font-noto-sans">Pilih jawaban yang benar.</p>
                        </div>
                        
                        <div className="space-y-6">
                            {opsiJawaban.map((opsi) => (
                                <div key={opsi.id} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => handleCheckAnswer(opsi.id)}
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors 
                                                ${opsi.isCorrect ? 'border-primary bg-primary' : 'border-primary bg-white hover:border-primary'}
                                            `}
                                        >
                                            {opsi.isCorrect && (
                                                <div className={`primary ${tipeSoal === 'Pilihan Ganda' ? 'w-2.5 h-2.5 rounded-full' : 'w-full h-full flex items-center justify-center text-white bg-transparent'}`}>
                                                    {tipeSoal !== 'Pilihan Ganda' && (
                                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                                    )}
                                                </div>
                                            )}
                                        </button>

                                        {/* Input Field Opsi */}
                                        <div className="relative w-full">
                                            <input 
                                                type="text" 
                                                value={opsi.text}
                                                onChange={(e) => handleInputOpsi(opsi.id, e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 pr-12 font-noto-sans placeholder-gray-400" 
                                                placeholder={`Masukan jawaban ${String.fromCharCode(64 + opsi.id)}`} 
                                            />

                                            <input 
                                                type="file" 
                                                id={`file-input-opsi-${opsi.id}`}
                                                onChange={(e) => handleFileChangeOpsi(opsi.id, e)}
                                                accept="image/*"
                                                className="hidden"
                                            />

                                            <button 
                                                type="button" 
                                                onClick={() => handleTriggerOpsiFile(opsi.id)}
                                                className={`absolute inset-y-0 right-0 flex items-center pr-2 transition-colors ${opsi.preview ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                                title="Upload Gambar Jawaban"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {opsi.preview && (
                                        <div className="ml-9 mt-1 relative w-fit">
                                            <img 
                                                src={opsi.preview} 
                                                alt={`Preview Opsi ${opsi.id}`} 
                                                className="h-24 w-auto rounded-lg border border-gray-200 object-cover"
                                            />
                                            <button 
                                                onClick={() => handleRemoveOpsiImage(opsi.id)}
                                                className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-200 rounded-full p-0.5 shadow-sm hover:bg-red-50"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pembahasan */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Pembahasan<span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            rows="4"
                            value={pembahasan}
                            onChange={(e) => setPembahasan(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 font-noto-sans placeholder-gray-400"
                            placeholder="Tuliskan pembahasan lengkap untuk jawaban yang benar"
                        ></textarea>
                    </div>
                </div>

                {/* --- KOLOM KANAN --- */}
                <div className="w-full lg:max-w-[400px] space-y-4">
                    
                    {/* Button Simpan & Ajukan */}
                    <div className="mb-4 flex flex-col sm:flex-row justify-end items-center gap-3">
                        <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-2xl h-10 shadow-sm text-white bg-primary">
                            Ajukan Perubahan
                        </button>
                    </div>

                    <div className="mt-4">
                        <h1 className="font-noto-sans text-gray-900">Catatan revisi dari validator <span className="text-red-500">*</span></h1>
                        <div className="bg-white shadow-lg rounded-2xl p-6 mt-2">
                            <h1 className="font-noto-sans text-red-500 text-sm">Tolong perbaiki!, jawaban yang kamu tandai sebagai jawaban benar harusnya salah!</h1>
                        </div>
                    </div>

                    {/* Form Kanan */}
                    <div className="bg-white shadow-lg w-full rounded-2xl p-6 space-y-4">

                        {/* MATA PELAJARAN */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                                Mata Pelajaran <span className="text-red-500">*</span>
                            </label>
                            <button 
                                type="button"
                                onClick={() => setIsMapelOpen(!isMapelOpen)}
                                className="relative w-full text-left font-noto-sans bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl  p-3.5 flex justify-between items-center"
                            >
                                <span className={formData.nama_subject_display ? "text-gray-900" : "text-gray-500"}>
                                    {formData.nama_subject_display || "Pilih mata pelajaran"}
                                </span>
                                <svg className={`w-5 h-5 text-gray-900 transition-transform ${isMapelOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            
                            {isMapelOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                    <ul className="py-1 text-sm text-gray-700">
                                        {subjectList.map((subject) => (
                                            <li key={subject.id_subject}>
                                                <button type="button" 
                                                    onClick={() => {
                                                        setFormData({...formData, nama_subject_display: subject.nama_subject});
                                                        setIsMapelOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-noto-sans"
                                                >
                                                    {subject.nama_subject}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* TOPIK */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                                Topik <span className="text-red-500">*</span>
                            </label>
                            <button 
                                type="button"
                                onClick={() => setIsTopikOpen(!isTopikOpen)}
                                className="relative w-full text-left font-noto-sans bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl p-3.5 flex justify-between items-center"
                            >
                                <span className={formData.nama_topik_display ? "text-gray-900" : "text-gray-500"}>
                                    {formData.nama_topik_display || "Pilih topik"}
                                </span>
                                <svg className={`w-5 h-5 text-gray-900 transition-transform ${isTopikOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            
                            {isTopikOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                    <ul className="py-1 text-sm text-gray-700">
                                        {topikList.map((topik) => (
                                            <li key={topik.id}>
                                                <button type="button" 
                                                    onClick={() => {
                                                        setFormData({...formData, nama_topik_display: topik.nama});
                                                        setIsTopikOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-noto-sans"
                                                >
                                                    {topik.nama}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* LEVEL KESULITAN */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                                Level Kesulitan Soal <span className="text-red-500">*</span>
                            </label>
                            <button 
                                type="button"
                                onClick={() => setIsLevelOpen(!isLevelOpen)}
                                className="relative w-full text-left font-noto-sans bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl p-3.5 flex justify-between items-center"
                            >
                                <span className={formData.level_kesulitan_display ? "text-gray-900" : "text-gray-500"}>
                                    {formData.level_kesulitan_display || "Pilih level kesulitan"}
                                </span>
                                <svg className={`w-5 h-5 text-gray-900 transition-transform ${isLevelOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            
                            {isLevelOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                    <ul className="py-1 text-sm text-gray-700">
                                        {levelList.map((lvl, index) => (
                                            <li key={index}>
                                                <button type="button" 
                                                    onClick={() => {
                                                        setFormData({...formData, level_kesulitan_display: lvl});
                                                        setIsLevelOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-noto-sans"
                                                >
                                                    {lvl}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
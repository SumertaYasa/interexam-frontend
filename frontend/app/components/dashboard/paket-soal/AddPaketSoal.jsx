import { Link } from "react-router";
import { useState, useRef, useEffect } from "react"; 

const initialPaketSoalData = [
    {
        id: 1,
        nama_soal: "Tentukan hasil integral parsial $x \\cdot e^x$",
        tipe_soal: "Pilihan Ganda",
        level: "Sulit",
    },
    {
        id: 2,
        nama_soal: "Jelaskan proses fotosintesis!",
        tipe_soal: "Esai",
        level: "Sedang",
    },
    {
        id: 3,
        nama_soal: "Sebutkan 3 senyawa kimia organik!",
        tipe_soal: "Isian Singkat",
        level: "Mudah",
    },
];

const availableSoalData = [
    { id: 10, matapelajaran: "Matematika", nama_soal: "Hitung volume kerucut dengan jari-jari 7 dan tinggi 10.", tipe_soal: "Isian Singkat", level: "Mudah", status: "Aktif" },
    { id: 11, matapelajaran: "Biologi", nama_soal: "Sebutkan tahapan siklus Krebs!", tipe_soal: "Esai", level: "Sulit", status: "Aktif" },
    { id: 12, matapelajaran: "Kimia", nama_soal: "Apa yang dimaksud dengan ikatan kovalen?", tipe_soal: "Pilihan Ganda", level: "Sedang", status: "Draft" },
    { id: 13, matapelajaran: "Fisika", nama_soal: "Hitung percepatan benda jatuh bebas.", tipe_soal: "Isian Singkat", level: "Mudah", status: "Aktif" },
];

const cleanupVisuals = (target) => {
    if (!target) return;
    const rows = target.parentNode?.children || [];
    Array.from(rows).forEach(row => {
        row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500', 'bg-gray-200', 'shadow-2xl', 'opacity-30', 'scale-[1.01]', 'z-10');
    });
};


export default function AddPaketSoal() {

    const [formData, setFormData] = useState({
        matapelajaran: "",
        topik: "",
        jenjang: "",
        fotoSampul: null, 
    });

    const [paketSoal, setPaketSoal] = useState(initialPaketSoalData);
    const [selectedSoal, setSelectedSoal] = useState({}); 

    const [previewImage, setPreviewImage] = useState("/profile-default.png");
    const [previousObjectUrl, setPreviousObjectUrl] = useState(null); 

    useEffect(() => {
        if (previousObjectUrl && previousObjectUrl !== "/profile-default.png") {
            URL.revokeObjectURL(previousObjectUrl);
        }
        
        if (previewImage !== "/profile-default.png") {
            setPreviousObjectUrl(previewImage);
        } else {
            setPreviousObjectUrl(null);
        }

        return () => {
            if (previewImage && previewImage !== "/profile-default.png") {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);


    const dragItem = useRef(null);
    const dragOverItem = useRef(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fotoSampul: file });
            setPreviewImage(URL.createObjectURL(file)); 
        } else {
            setFormData({ ...formData, fotoSampul: null });
            setPreviewImage("/profile-default.png");
        }
    };

    const [isNewSoalModalOpen, setIsNewSoalModalOpen] = useState(false);
    const toggleNewSoalModal = () => setIsNewSoalModalOpen(prev => !prev);
    const closeNewSoalModal = () => {
        setIsNewSoalModalOpen(false);
    };

    const handleSoalSelection = (id, soal) => {
        setSelectedSoal(prev => {
            const newSelection = { ...prev };
            if (newSelection[id]) {
                delete newSelection[id];
            } else {
                newSelection[id] = soal;
            }
            return newSelection;
        });
    };

    const handleAddToPackage = () => {
        const soalToAdd = Object.values(selectedSoal);
        const existingIds = new Set(paketSoal.map(s => s.id));
        const uniqueSoalToAdd = soalToAdd.filter(soal => !existingIds.has(soal.id));

        setPaketSoal(prevSoal => [...prevSoal, ...uniqueSoalToAdd]);

        setSelectedSoal({});
        closeNewSoalModal();
    };

    const modalPrimaryButtonClasses = 'text-white bg-indigo-600 box-border border border-transparent hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none';
    const modalSecondaryButtonClasses = 'text-gray-900 bg-gray-100 box-border border border-gray-300 hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:ring-gray-300 shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none';

    const [isMapelOpen, setIsMapelOpen] = useState(false);
    const mataPelajaranList = ["Matematika", "Bahasa Indonesia", "Fisika", "Kimia", "Biologi", "Sejarah", "Geografi"];

    const handleSelectMapel = (subject) => {
        setFormData({ ...formData, matapelajaran: subject });
        setIsMapelOpen(false);
    };

    const [isJenjangOpen, setIsJenjangOpen] = useState(false);
    const jenjangList = ["Sulit", "Sedang", "Mudah"];

    const handleSelectJenjang = (value) => {
        setFormData({ ...formData, jenjang: value });
        setIsJenjangOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with:", {
            ...formData,
            paketSoalIds: paketSoal.map(s => s.id)
        });
    }

    const handleDragStart = (e, index) => {
        dragItem.current = index;
        if (!e.dataTransfer || !e.currentTarget) return;
        e.currentTarget.classList.add('bg-gray-200', 'shadow-2xl', 'opacity-30', 'scale-[1.01]', 'z-10'); 
        const emptyImg = new Image();
        e.dataTransfer.setDragImage(emptyImg, 0, 0); 
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        dragOverItem.current = index;
        if (dragItem.current === null) return;
        const rows = e.currentTarget.parentNode?.children || [];
        Array.from(rows).forEach(row => row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500'));
        
        if (dragItem.current !== dragOverItem.current) {
            if (dragItem.current < dragOverItem.current) {
                e.currentTarget.classList.add('border-b-4', 'border-blue-500');
            } else {
                e.currentTarget.classList.add('border-t-4', 'border-blue-500');
            }
        }
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('border-b-4', 'border-t-4', 'border-blue-500');
    };

    const handleDragEnd = (e) => {
        if (e.currentTarget) {
            cleanupVisuals(e.currentTarget); 
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dragIndex = dragItem.current;
        const dropIndex = dragOverItem.current;

        if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) {
            handleDragEnd(e); 
            return;
        }

        try {
            const listCopy = [...paketSoal];
            const draggedItemContent = listCopy[dragIndex];

            listCopy.splice(dragIndex, 1);
            listCopy.splice(dropIndex, 0, draggedItemContent);

            setPaketSoal(listCopy);
        } catch (error) {
            console.error("Error during DND splice operation:", error);
        }
        
        dragOverItem.current = null;
    };

    const handleDeleteSoal = (idToDelete) => {
        setPaketSoal(currentSoal => 
            currentSoal.filter(soal => soal.id !== idToDelete)
        );
        console.log(`Menghapus soal dengan ID: ${idToDelete} dari paket.`);
    };


    return (
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            {/* Navigasi Head */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-gray-900 font-bold font-sora">Add Paket Soal</h1>
                    </div>
                    {/* Breadcrumb Navigation*/}
                    <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                                </li>
                                <li className="inline-flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                    <Link to="../paket-soal" className="inline-flex text-gray-500 items-center text-sm font-noto-sans font-medium  ">
                                        Data Paket Soal
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                        <span className="ms-1 text-sm font-medium text-gray-900 font-noto-sans md:ms-2">Add Paket Soal</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Tombol Simpan/Batal */}
            <div className="mt-4 flex gap-4 justify-between">
                <button type="submit"
                    className="text-white bg-primary box-border border border-transparent shadow-xs font-medium leading-5 rounded-2xl text-sm px-6 py-2.5 focus:outline-none font-noto-sans ">
                    Simpan
                </button>
                <Link
                    to="/dashboard/paket-soal"
                    className="text-primary bg-white box-border border border-primary shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none font-noto-sans ">
                    Batal
                </Link>
            </div>

            {/* --- Form Detail Paket Soal --- */}
            <div className="bg-white shadow-lg flex-1 mt-4 h-auto rounded-2xl w-full">
                <div className="p-6">
                    {/* Mata Pelajaran Dropdown */}
                    <div className="relative ">
                        <label htmlFor="id_matapelajaran"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Mata Pelajaran<span
                            className="text-red-500">*</span></label>
                            <button id="dropdownDefaultButton"
                                type="button"
                                onClick={() => setIsMapelOpen(!isMapelOpen)}
                                className="relative z-20 truncate w-full font-noto-sans inline-flex text-gray-900 bg-white focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                                {formData.matapelajaran || "Pilih Mata Pelajaran"}
                                <svg className={`w-5 h-5 ms-1.5 -me-0.5 flex-shrink-0 text-gray-900 transition-transform ${isMapelOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {isMapelOpen && (
                                <div className="absolute z-20 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                    <ul className="p-2 text-sm text-gray-600 font-medium">
                                        {mataPelajaranList.map((subject) => (
                                            <li key={subject}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectMapel(subject)}
                                                    className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-left font-noto-sans">
                                                    <span className="text-gray-900">{subject}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        <p className="text-red-500 text-xs mt-1 font-noto-sans"></p>
                    </div>

                    {/* Nama Paket Soal Input */}
                    <div className="mt-4">
                        <label htmlFor="id_topik"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Nama Paket Soal<span
                            className="text-red-500">*</span></label>
                        <input type="text" id="id_topik" name="topik"
                            value={formData.topik}
                            onChange={handleChange}
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl   block w-full p-3.5"
                            placeholder="Masukan nama paket soal" required />
                        <p className="text-red-500 text-xs mt-1 font-noto-sans"></p>
                    </div>

                    {/* Status Paket Soal Dropdown */}
                    <div className="relative mt-4 ">
                        <label htmlFor="id_jenjang"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Status Paket Soal<span
                            className="text-red-500">*</span></label>
                            <button id="dropdownDefaultButton"
                                type="button"
                                onClick={() => setIsJenjangOpen(!isJenjangOpen)}
                                className="relative z-10 truncate w-full font-noto-sans inline-flex text-gray-900 bg-white focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                                {formData.jenjang || "Pilih status paket soal"}
                                <svg className={`w-5 h-5 ms-1.5 -me-0.5 flex-shrink-0 text-gray-900 transition-transform ${isJenjangOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {isJenjangOpen && (
                                <div className="absolute z-10 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                    <ul className="p-2 text-sm text-gray-600 font-medium">
                                        {jenjangList.map((item) => (
                                            <li key={item}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectJenjang(item)}
                                                    className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-left font-noto-sans">
                                                    <span className="text-gray-900">{item}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                        {/* --- FOTO SAMPUL --- */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                                Foto Sampul <span className="text-gray-400 text-xs">(Opsional)</span>
                            </label>
                            
                            {/* Preview Image */}
                            <div className="mb-4 flex justify-start">
                                <img 
                                    src={previewImage} 
                                    alt="Preview Sampul" 
                                    className=" h-48 sm:w-64 sm:h-40 rounded-xl object-cover border border-gray-300" 
                                    onError={(e) => { e.target.src = '/profile-default.png'; }} 
                                />
                            </div>

                            <div className="flex items-center w-full">
                                <label className="flex items-center w-full p-2 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50  transition-colors">
                                    {/* Tombol Pilih File */}
                                    <span className="w-1/2 sm:w-auto text-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl transition-colors hover:bg-primary/90 ">
                                        Pilih file
                                    </span>
                                    
                                    {/* Nama File yang Dipilih */}
                                    <span className="ml-4 text-sm text-gray-600  font-noto-sans truncate">
                                        {formData.fotoSampul ? formData.fotoSampul.name : "Maks. 2MB"}
                                    </span>
                                    
                                    {/* Input File Sebenarnya */}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/jpeg,image/png,image/webp" 
                                        onChange={handleFileChange} 
                                        name="fotoSampul"
                                        value="" 
                                    />
                                </label>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            

            
            {/* --- MODAL DAFTAR SOAL TERSEDIA --- */}
            {isNewSoalModalOpen && (
                <div 
                    id="static-modal" 
                    tabIndex="-1" 
                    aria-hidden={!isNewSoalModalOpen}
                    className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50 overflow-y-auto">
                    <div className="relative p-4 max-w-4xl w-full transition-transform duration-300 ease-out scale-100">
                        <div className="relative bg-white rounded-xl shadow-2xl">
                            
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 font-noto-sans">
                                    Daftar Soal yang Tersedia
                                </h3>
                                
                                {/* Close Button */}
                                <button 
                                    type="button" 
                                    className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" 
                                    onClick={closeNewSoalModal}
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path 
                                            stroke="currentColor" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M6 18 17.94 6M18 18 6.06 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            {/* Modal Body (Tabel Soal Tersedia) */}
                            <div className="p-4 md:p-5">
                                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                                    <table className="w-full divide-y divide-gray-200 font-noto-sans">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th scope="col" className="px-3 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">NO</th>
                                            <th scope="col" className="px-3 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">MATA PELAJARAN</th>
                                            <th scope="col" className="px-3 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">SOAL</th>
                                            <th scope="col" className="px-3 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">TIPE SOAL</th>
                                            <th scope="col" className="px-3 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">LEVEL KESULITAN</th>
                                            <th scope="col" className="px-3 py-3 font-noto-sans text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">AKSI</th> 
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {availableSoalData.map((soal, index) => (
                                            <tr key={soal.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{soal.matapelajaran}</td>
                                                <td className="px-3 py-4 text-sm text-gray-900 max-w-xs truncate">{soal.nama_soal}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{soal.tipe_soal}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`font-noto-sans p-1 rounded-lg ${
                                                        soal.level === 'Mudah' ? 'text-green-600 bg-green-100' : 
                                                        soal.level === 'Sedang' ? 'text-amber-600 bg-amber-100' : 
                                                        'text-red-600 bg-red-100'
                                                    }`}>
                                                        {soal.level}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selectedSoal[soal.id]}
                                                        onChange={() => handleSoalSelection(soal.id, soal)}
                                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            {/* Modal footer */}
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                    Dipilih: {Object.keys(selectedSoal).length} Soal
                                </span>
                                <div>
                                    <button
                                        onClick={closeNewSoalModal} 
                                        type="button" 
                                        className={modalSecondaryButtonClasses}>
                                        Tutup
                                    </button>
                                    <button
                                        onClick={handleAddToPackage}
                                        type="button" 
                                        className={`${modalPrimaryButtonClasses} ml-3`}
                                        disabled={Object.keys(selectedSoal).length === 0}>
                                        Tambah ke Paket
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* --- Tabel Paket Soal yang Telah Ditambahkan --- */}
            <div className=" mx-auto p-4 bg-white rounded-2xl shadow-xl mt-4 w-full">

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4 justify-between w-full">
                <button
                    type="button"
                    className="text-primary bg-white box-border border border-primary shadow-xs font-medium leading-5 rounded-3xl text-sm px-6 py-2.5 focus:outline-none font-noto-sans"
                >
                    PUBLISH
                </button>
                <button
                    type="button"
                    onClick={toggleNewSoalModal}
                    className="text-white bg-primary box-border border border-transparent shadow-xs font-medium leading-5 rounded-3xl text-sm px-6 py-2.5 focus:outline-none font-noto-sans"
                >
                    Tambah Soal Baru
                </button>
            </div>

                <div className="bg-white shadow-md rounded-lg overflow-x-auto mt-5">
                    <table className="w-full divide-y divide-gray-200 font-noto-sans">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">NO</th>
                            <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">SOAL</th>
                            <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">TIPE SOAL</th>
                            <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">LEVEL</th>
                            <th scope="col" className="px-6 py-3 font-noto-sans text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">AKSI</th> 
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {paketSoal.map((paket, index) => (
                            <tr
                                key={paket.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragLeave={handleDragLeave}
                                onDragEnd={handleDragEnd}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="cursor-move transition-all duration-300 ease-in-out hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium font-noto-sans text-gray-900 max-w-xs truncate">
                                    {paket.nama_soal}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                    {paket.tipe_soal}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                    <span className={`font-noto-sans p-1 rounded-lg ${
                                        paket.level === 'Mudah' ? 'text-green-600 bg-green-100' : 
                                        paket.level === 'Sedang' ? 'text-amber-600 bg-amber-100' : 
                                        'text-red-600 bg-red-100'
                                    }`}>
                                        {paket.level}
                                    </span>
                                </td>

                                {/* Kolom Aksi: Tombol Hapus */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900 text-center">

                                    <div className="flex gap-2 items-center justify-center">

                                    <button 
                                        type="button" 
                                        className="text-white bg-red-600 h-8 w-8 rounded-xl hover:bg-red-700 p-1 transition-colors" 
                                        onClick={() => handleDeleteSoal(paket.id)}
                                        title="Hapus Soal"
                                    >
                                        <svg className="w-full h-full text-white dark:text-white"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                        viewBox="0 0 24 24">

                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                        </svg>
                                    </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>

        </form>
    );
}
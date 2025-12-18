import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";

// --- MOCK DATA ---
const initialPaketSoalData = [
    { id: 1, nama_soal: "Tentukan hasil integral parsial", tipe_soal: "Pilihan Ganda", level: "Sulit" },
    { id: 2, nama_soal: "Jelaskan proses fotosintesis!", tipe_soal: "Multi Jawaban", level: "Sedang" },
    { id: 3, nama_soal: "Sebutkan 3 senyawa kimia organik!", tipe_soal: "Pilihan Ganda", level: "Mudah" },
];

const availableSoalData = [
    { id: 10, matapelajaran: "Matematika", nama_soal: "Hitung volume kerucut...", tipe_soal: "Pilihan Ganda", level: "Mudah", status: "Disetujui" },
    { id: 11, matapelajaran: "Biologi", nama_soal: "Sebutkan tahapan siklus Krebs!", tipe_soal: "Multi Jawaban", level: "Sulit", status: "Disetujui" },
    { id: 12, matapelajaran: "Kimia", nama_soal: "Apa yang dimaksud dengan ikatan kovalen?", tipe_soal: "Pilihan Ganda", level: "Sedang", status: "Disetujui" },
    { id: 13, matapelajaran: "Fisika", nama_soal: "Hitung percepatan benda jatuh bebas.", tipe_soal: "Multi Jawaban", level: "Mudah", status: "Disetujui" },
];

const mataPelajaranOptions = [
    { label: "Matematika", value: "Matematika" },
    { label: "Bahasa Indonesia", value: "Bahasa Indonesia" },
    { label: "Fisika", value: "Fisika" },
    { label: "Biologi", value: "Biologi" },
];

const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
];

// ==========================================================================
// KOMPONEN UI (Bisa dipindah ke file terpisah: components/common/...)
// ==========================================================================

const InputField = ({ label, value, onChange, placeholder, required, name }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="bg-white border font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-primary focus:border-primary block w-full p-3.5 outline-none transition-all"
            placeholder={placeholder}
        />
    </div>
);

const Dropdown = ({ label, options, selectedText, onSelect, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full text-left bg-white border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-1 focus:ring-primary font-medium px-4 py-3.5 flex justify-between items-center font-noto-sans"
            >
                <span className={`truncate ${!selectedText ? 'text-gray-400' : ''}`}>{selectedText || "Pilih..."}</span>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <ul className="py-1 text-sm text-gray-700 font-noto-sans">
                        {options.map((opt, idx) => (
                            <li key={idx}>
                                <button type="button" onClick={() => { onSelect(opt.value); setIsOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-primary">
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ImageUploadBox = ({ label, previewUrl, onChange, onRemove, required }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
                <div className="shrink-0 w-16 h-16 bg-white rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="flex gap-2 items-center">
                        <label className="cursor-pointer inline-block bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-primary/90 transition-all font-noto-sans">
                            Pilih file
                            <input type="file" className="hidden" accept="image/*" onChange={onChange} />
                        </label>
                        {previewUrl && (
                            <button type="button" onClick={onRemove} className="text-red-500 text-sm font-medium hover:underline font-noto-sans">Hapus</button>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 truncate">Format JPG, PNG, WEBP. Maks 2MB.</p>
                </div>
            </div>
        </div>
    </div>
);

const SearchInput = ({ placeholder }) => (
    <div className="relative w-full sm:w-80">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input 
            type="search" 
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary font-noto-sans outline-none" 
            placeholder={placeholder} 
        />
    </div>
);

const FilterButton = () => (
    <button type="button" className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
    </button>
);

// ==========================================================================
// MAIN PAGE
// ==========================================================================

export default function AddPaketSoal() {
    // --- STATE ---
    const [formData, setFormData] = useState({ matapelajaran: "", topik: "", status: "", fotoSampul: null });
    const [paketSoal, setPaketSoal] = useState(initialPaketSoalData);
    const [selectedSoal, setSelectedSoal] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Refs untuk Drag & Drop
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSelectMapel = (val) => setFormData({ ...formData, matapelajaran: val });
    const handleSelectStatus = (val) => setFormData({ ...formData, status: val });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fotoSampul: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    const handleRemoveImage = () => {
        setFormData({ ...formData, fotoSampul: null });
        setPreviewImage(null);
    };

    // --- DRAG AND DROP (Logika Asli Anda) ---
    const cleanupVisuals = (target) => {
        if (!target) return;
        const rows = target.parentNode?.children || [];
        Array.from(rows).forEach(row => {
            row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500', 'bg-gray-200', 'shadow-2xl', 'opacity-30', 'scale-[1.01]', 'z-10');
        });
    };

    const handleDragStart = (e, index) => {
        dragItem.current = index;
        if (!e.dataTransfer || !e.currentTarget) return;
        // Efek visual item yang ditarik
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

    const handleDragEnd = (e) => {
        if (e.currentTarget) cleanupVisuals(e.currentTarget);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dragIndex = dragItem.current;
        const dropIndex = dragOverItem.current;
        if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) {
            handleDragEnd(e); return;
        }
        const listCopy = [...paketSoal];
        const draggedItem = listCopy[dragIndex];
        listCopy.splice(dragIndex, 1);
        listCopy.splice(dropIndex, 0, draggedItem);
        setPaketSoal(listCopy);
        if (e.currentTarget) cleanupVisuals(e.currentTarget);
        dragOverItem.current = null;
    };

    const handleDeleteSoal = (id) => setPaketSoal(prev => prev.filter(s => s.id !== id));

    // --- MODAL LOGIC ---
    const toggleSelection = (soal) => {
        setSelectedSoal(prev => {
            const newState = { ...prev };
            if (newState[soal.id]) delete newState[soal.id];
            else newState[soal.id] = soal;
            return newState;
        });
    };

    const addSelectedToPaket = () => {
        const newItems = Object.values(selectedSoal).filter(s => !paketSoal.some(p => p.id === s.id));
        setPaketSoal([...paketSoal, ...newItems]);
        setSelectedSoal({});
        setIsModalOpen(false);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50">
            {/* HEADERS */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-900 font-bold font-sora">Add Paket Soal</h1>
                <nav className="flex text-sm font-medium text-gray-500 font-noto-sans">
                    <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <Link to="../paket-soal" className="hover:text-gray-900">Data Paket Soal</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Add</span>
                </nav>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); console.log(formData); }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* --- KIRI: TABEL SOAL (Drag & Drop) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <button type="button" onClick={() => setIsModalOpen(true)} className="text-white bg-primary rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition font-noto-sans shadow-sm border border-transparent">
                                + Soal Dari Bank Soal
                            </button>
                            <button type="button" className="text-primary bg-white border border-primary rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition font-noto-sans shadow-sm">
                                PUBLISH
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                            <table className="w-full text-sm text-left text-gray-500 font-noto-sans">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 font-bold">NO</th>
                                        <th className="px-6 py-3 font-bold">SOAL</th>
                                        <th className="px-6 py-3 font-bold">TIPE SOAL</th>
                                        <th className="px-6 py-3 font-bold">LEVEL</th>
                                        <th className="px-6 py-3 font-bold text-center">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {paketSoal.map((item, index) => (
                                        <tr 
                                            key={item.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragEnter={(e) => handleDragEnter(e, index)}
                                            onDragLeave={(e) => e.currentTarget.classList.remove('border-b-4', 'border-t-4', 'border-blue-500')}
                                            onDragEnd={handleDragEnd}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="hover:bg-gray-50 cursor-move transition-all duration-200"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 truncate max-w-xs text-gray-900 font-medium">{item.nama_soal}</td>
                                            <td className="px-6 py-4">{item.tipe_soal}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                                                    item.level === 'Mudah' ? 'bg-green-100 text-green-800' :
                                                    item.level === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button type="button" onClick={() => handleDeleteSoal(item.id)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition shadow-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {paketSoal.length === 0 && (
                                <div className="p-8 text-center text-gray-500 italic font-noto-sans">Belum ada soal ditambahkan.</div>
                            )}
                        </div>
                    </div>

                    {/* --- KANAN: FORM DETAIL --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-6 border border-gray-100">
                            
                            <Dropdown 
                                label="Mata Pelajaran"
                                required
                                options={mataPelajaranOptions}
                                selectedText={formData.matapelajaran}
                                onSelect={handleSelectMapel}
                            />

                            <InputField 
                                label="Nama Paket Soal"
                                name="topik"
                                required
                                value={formData.topik}
                                onChange={handleChange}
                                placeholder="Masukan nama paket soal"
                            />

                            <Dropdown 
                                label="Status Paket Soal"
                                required
                                options={statusOptions}
                                selectedText={formData.status}
                                onSelect={handleSelectStatus}
                            />

                            <ImageUploadBox 
                                label="Gambar Card Soal"
                                required
                                previewUrl={previewImage}
                                onChange={handleFileChange}
                                onRemove={handleRemoveImage}
                            />

                            <div className="mt-6 flex gap-3">
                                <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all font-noto-sans">
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* --- MODAL OVERLAY: BANK SOAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3 w-full">
                                <SearchInput placeholder="Cari Soal..." />
                                <FilterButton />
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="ml-4 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition shadow-sm whitespace-nowrap font-noto-sans">
                                + Add Soal
                            </button>
                        </div>

                        {/* Modal Body (Table) */}
                        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left text-gray-500 font-noto-sans">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 font-bold text-gray-600">NO</th>
                                            <th className="px-6 py-3 font-bold text-gray-600">MATA PELAJARAN</th>
                                            <th className="px-6 py-3 font-bold text-gray-600">SOAL</th>
                                            <th className="px-6 py-3 font-bold text-gray-600">TIPE SOAL</th>
                                            <th className="px-6 py-3 font-bold text-gray-600">LEVEL KESULITAN</th>
                                            <th className="px-6 py-3 font-bold text-gray-600">STATUS</th>
                                            <th className="px-6 py-3 font-bold text-gray-600 text-center">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {availableSoalData.map((soal, idx) => (
                                            <tr key={soal.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{idx + 1}</td>
                                                <td className="px-6 py-4 text-gray-900">{soal.matapelajaran}</td>
                                                <td className="px-6 py-4 text-gray-900 max-w-xs truncate" title={soal.nama_soal}>{soal.nama_soal}</td>
                                                <td className="px-6 py-4 text-gray-500">{soal.tipe_soal}</td>
                                                <td className="px-6 py-4 text-gray-900">{soal.level}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-200">
                                                        {soal.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <label className="inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={!!selectedSoal[soal.id]}
                                                            onChange={() => toggleSelection(soal)}
                                                        />
                                                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all">
                                                            {selectedSoal[soal.id] && (
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                                            )}
                                                        </div>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition font-noto-sans">
                                Batal
                            </button>
                            <button onClick={addSelectedToPaket} disabled={Object.keys(selectedSoal).length === 0} className={`px-5 py-2 text-sm font-medium text-white rounded-xl transition font-noto-sans shadow-sm ${Object.keys(selectedSoal).length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}>
                                Simpan Selection ({Object.keys(selectedSoal).length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
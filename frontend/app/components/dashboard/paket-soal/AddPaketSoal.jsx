import { useState, useRef, forwardRef } from "react";
import { useNavigate } from "react-router";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import SearchInput from "../common/SearchInput";
import DynamicTable from "../common/DynamicTable";
import DynamicFilter from "../common/DynamicFilter";

const formatSoalDisplay = (text) => {
    const cleanText = text ? String(text).replace(/<[^>]+>/g, '') : '-';
    const limit = 10; 
    const displayText = cleanText.length > limit ? cleanText.substring(0, limit) + "..." : cleanText;
    
    return <div title={cleanText} className="min-w-[100px]">{displayText}</div>;
};

const getLevelBadge = (level) => {
    const l = level?.toLowerCase() || "";
    let color = "bg-gray-100 text-gray-800 border-gray-200 rounded-lg";
    if (l === 'mudah') color = "bg-green-100 text-green-800 border-green-200 rounded-lg";
    if (l === 'sedang') color = "bg-yellow-100 text-yellow-800 border-yellow-200 rounded-lg";
    if (l === 'sulit') color = "bg-red-100 text-red-800 border-red-200 rounded-lg";
    return <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${color}`}>{level}</span>;
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
                    <p className="mt-1 text-xs text-gray-500 truncate">Format JPG, PNG. Maks 2MB.</p>
                </div>
            </div>
        </div>
    </div>
);

const ActionButton = ({ onClick, text, variant = "primary" }) => {
    const baseClass = "rounded-xl px-5 py-2.5 text-sm font-medium transition font-noto-sans shadow-sm border whitespace-nowrap w-full sm:w-auto text-center";
    const variants = {
        primary: "text-white bg-primary hover:bg-primary/90 border-transparent",
        outline: "text-primary bg-white border-primary hover:bg-gray-50 uppercase tracking-wide",
    };
    return (
        <button type="button" onClick={onClick} className={`${baseClass} ${variants[variant]}`}>
            {text}
        </button>
    );
};

const DraggableTable = forwardRef(({ data, onDragStart, onDragEnter, onDragEnd, onDrop, onDelete }, ref) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 font-noto-sans min-w-[800px] lg:min-w-0">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3">NO</th>
                        <th className="px-6 py-3">SOAL</th>
                        <th className="px-6 py-3">MATA PELAJARAN</th>
                        <th className="px-6 py-3">JENJANG</th>
                        <th className="px-6 py-3">TIPE SOAL</th>
                        <th className="px-6 py-3">LEVEL</th>
                        <th className="px-6 py-3 text-center">AKSI</th>
                    </tr>
                </thead>
                <tbody ref={ref} className="divide-y divide-gray-100 bg-white">
                    {data.length === 0 ? (
                        <tr><td colSpan="7" className="px-6 py-8 text-center">Belum ada soal ditambahkan.</td></tr>
                    ) : (
                        data.map((item, index) => (
                            <tr 
                                key={item.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragEnter={(e) => onDragEnter(e, index)}
                                onDragEnd={onDragEnd}
                                onDrop={onDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="hover:bg-gray-50 cursor-move transition-all duration-200 bg-white"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {formatSoalDisplay(item.nama_soal)}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{item.mata_pelajaran}</td>
                                <td className="px-6 py-4">{item.jenjang || "SMA"}</td>
                                <td className="px-6 py-4">{item.tipe_soal}</td>
                                <td className="px-6 py-4">{getLevelBadge(item.level)}</td>
                                <td className="px-6 py-4 text-center">
                                <button onClick={(e) => { stopProp(e); handleDelete(row.id_soal); }} className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base" title="Hapus">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/></svg>
                                </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
});

const initialPaketSoalData = [
    { id: 1, nama_soal: "Tentukan hasil integral parsial dari fungsi berikut ini", mata_pelajaran: "Matematika", jenjang: "SMA", tipe_soal: "Pilihan Ganda", level: "Sulit" },
    { id: 2, nama_soal: "Jelaskan proses fotosintesis secara detail", mata_pelajaran: "Biologi", jenjang: "SMP", tipe_soal: "Multi Jawaban", level: "Sedang" },
    { id: 3, nama_soal: "Jelaskan proses fotosintesis secara detail", mata_pelajaran: "Biologi", jenjang: "SMP", tipe_soal: "Multi Jawaban", level: "mudah" },
];

const availableSoalData = [
    { id: 10, matapelajaran: "Matematika", jenjang: "SMA", nama_soal: "Hitung volume kerucut jika jari-jari 7cm...", tipe_soal: "Pilihan Ganda", level: "Mudah", status: "Disetujui" },
    { id: 11, matapelajaran: "Biologi", jenjang: "SMA", nama_soal: "Sebutkan tahapan siklus Krebs secara berurutan!", tipe_soal: "Multi Jawaban", level: "Sulit", status: "Disetujui" },
    { id: 12, matapelajaran: "Kimia", jenjang: "SMA", nama_soal: "Apa yang dimaksud dengan ikatan kovalen polar?", tipe_soal: "Pilihan Ganda", level: "Sedang", status: "Disetujui" },
    { id: 13, matapelajaran: "Fisika", jenjang: "SMP", nama_soal: "Hitung percepatan benda jatuh bebas.", tipe_soal: "Multi Jawaban", level: "Mudah", status: "Disetujui" },
    { id: 14, matapelajaran: "Matematika", jenjang: "SD", nama_soal: "Perkalian dasar 1-10.", tipe_soal: "Pilihan Ganda", level: "Mudah", status: "Disetujui" },
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
    { label: "Draft", value: "Draft" },
];

const jenisPaketOptions = [
    { label: "Gratis", value: "Gratis" },
    { label: "Berbayar", value: "Berbayar" },
];

const overlayFilterConfig = [
    {
        key: "matapelajaran",
        label: "Mata Pelajaran",
        type: "radio", 
        defaultValue: "all",
        options: [
            { label: "Semua Mapel", value: "all" },
            { label: "Matematika", value: "Matematika" },
            { label: "Fisika", value: "Fisika" },
            { label: "Biologi", value: "Biologi" },
            { label: "Bahasa Indonesia", value: "Bahasa Indonesia" }
        ]
    },
    {
        key: "jenjang",
        label: "Jenjang",
        type: "radio",
        defaultValue: "all",
        options: [
            { label: "Semua Jenjang", value: "all" },
            { label: "SD", value: "SD" },
            { label: "SMP", value: "SMP" },
            { label: "SMA", value: "SMA" }
        ]
    },
    {
        key: "level",
        label: "Level Kesulitan",
        type: "radio",
        defaultValue: "all",
        options: [
            { label: "Semua Level", value: "all" },
            { label: "Mudah", value: "Mudah" },
            { label: "Sedang", value: "Sedang" },
            { label: "Sulit", value: "Sulit" }
        ]
    }
];

export default function AddPaketSoal() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nama_paket: "",
        matapelajaran: [], 
        jenis: "",         
        status: "",        
        deskripsi: "", 
        fotoSampul: null
    });
    
    const [paketSoalList, setPaketSoalList] = useState(initialPaketSoalData);
    const [previewImage, setPreviewImage] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSearch, setModalSearch] = useState("");
    const [selectedInModal, setSelectedInModal] = useState({}); 
    
    const [modalFilters, setModalFilters] = useState({
        matapelajaran: "all",
        jenjang: "all",
        level: "all"
    });

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const tableBodyRef = useRef(null);

    // HANDLERS
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSelectMapel = (val) => {
        setFormData(prev => {
            const current = prev.matapelajaran;
            if (current.includes(val)) {
                return { ...prev, matapelajaran: current.filter(item => item !== val) };
            } else {
                return { ...prev, matapelajaran: [...current, val] };
            }
        });
    };

    const handleSelectStatus = (val) => setFormData({ ...formData, status: val });
    const handleSelectJenis = (val) => setFormData({ ...formData, jenis: val });

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

    const cleanupVisuals = () => {
        if (tableBodyRef.current) {
            const rows = tableBodyRef.current.children;
            Array.from(rows).forEach(row => {
                row.classList.remove(
                    'border-b-4', 'border-t-4', 'border-blue-500', 
                    'bg-gray-200', 'shadow-2xl', 'opacity-30', 'z-10' 
                );
            });
        }
    };

    const handleDragStart = (e, index) => {
        dragItem.current = index;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.currentTarget.classList.add('bg-gray-200', 'shadow-2xl', 'opacity-30', 'z-10');
            const emptyImg = new Image();
            e.dataTransfer.setDragImage(emptyImg, 0, 0); 
        }
    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        dragOverItem.current = index;
        if (tableBodyRef.current) {
            const rows = tableBodyRef.current.children;
            Array.from(rows).forEach(row => row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500'));
        }
        const currentTarget = e.currentTarget;
        if (dragItem.current !== null && dragItem.current !== dragOverItem.current) {
            if (dragItem.current < dragOverItem.current) {
                currentTarget.classList.add('border-b-4', 'border-blue-500'); 
            } else {
                currentTarget.classList.add('border-t-4', 'border-blue-500'); 
            }
        }
    };

    const handleDragEnd = () => {
        cleanupVisuals();
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        cleanupVisuals(); 
        const dragIndex = dragItem.current;
        const dropIndex = dragOverItem.current;
        if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) return;
        const listCopy = [...paketSoalList];
        const draggedItem = listCopy[dragIndex];
        listCopy.splice(dragIndex, 1);
        listCopy.splice(dropIndex, 0, draggedItem);
        setPaketSoalList(listCopy);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDeleteSoal = (id) => {
        setPaketSoalList(prev => prev.filter(item => item.id !== id));
    };

    // LOGIKA OVERLAY
    const handleToggleModalSelection = (item) => {
        setSelectedInModal(prev => {
            const newState = { ...prev };
            if (newState[item.id]) delete newState[item.id];
            else newState[item.id] = item;
            return newState;
        });
    };

    const handleSaveModalSelection = () => {
        const newItems = Object.values(selectedInModal);
        const currentIds = new Set(paketSoalList.map(i => i.id));
        const filteredNewItems = newItems.filter(i => !currentIds.has(i.id));
        setPaketSoalList([...paketSoalList, ...filteredNewItems]);
        setIsModalOpen(false);
        setSelectedInModal({});
    };

    const handleOverlayFilterChange = (key, value) => {
        setModalFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredBankSoal = availableSoalData.filter(item => {
        const term = modalSearch.toLowerCase();
        const matchesSearch = item.nama_soal.toLowerCase().includes(term);
        const matchesMapel = modalFilters.matapelajaran !== "all" ? item.matapelajaran === modalFilters.matapelajaran : true;
        const matchesJenjang = modalFilters.jenjang !== "all" ? item.jenjang === modalFilters.jenjang : true;
        const matchesLevel = modalFilters.level !== "all" ? item.level === modalFilters.level : true;
        const alreadyInPacket = paketSoalList.some(p => p.id === item.id);
        return matchesSearch && matchesMapel && matchesJenjang && matchesLevel && !alreadyInPacket;
    });

    const modalColumns = [
        { 
            header: "SOAL", 
            accessor: "nama_soal", 
            render: (row) => formatSoalDisplay(row.nama_soal)
        },
        { header: "MATA PELAJARAN", accessor: "matapelajaran" },
        { header: "JENJANG", accessor: "jenjang" },
        { header: "TIPE SOAL", accessor: "tipe_soal" },
        { header: "LEVEL KESULITAN", render: (row) => getLevelBadge(row.level) },
        { header: "STATUS", render: (row) => <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-lg border border-green-200">{row.status}</span> },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex justify-center items-center">
                    <label className="cursor-pointer relative">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={!!selectedInModal[row.id]}
                            onChange={() => handleToggleModalSelection(row)}
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedInModal[row.id] ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                        }`}>
                            {selectedInModal[row.id] && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                        </div>
                    </label>
                </div>
            )
        }
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50">
            <PageHeader 
                title="Add Paket Soal"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Paket Soal", link: "../paket-soal" },
                    { label: "Add", link: null }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* KIRI TABEL UTAMA */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <ActionButton 
                            text="+ Soal Dari Bank Soal" 
                            onClick={() => setIsModalOpen(true)}
                            variant="primary"
                        />
                        <ActionButton 
                            text="PUBLISH" 
                            onClick={() => alert("Published!")}
                            variant="outline"
                        />
                    </div>

                    <DraggableTable 
                        ref={tableBodyRef}
                        data={paketSoalList}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                        onDelete={handleDeleteSoal}
                    />
                </div>

                {/* KANAN FORM DETAIL */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6 border border-gray-100 space-y-3">
                        
                        <Dropdown 
                            label="Mata Pelajaran"
                            required
                            options={mataPelajaranOptions}
                            selectedText={
                                formData.matapelajaran.length > 0 
                                ? formData.matapelajaran.join(", ") 
                                : ""
                            }
                            onSelect={handleSelectMapel}
                            multiSelect={true}
                            selectedValues={formData.matapelajaran}
                        />

                        <InputField 
                            label="Nama Paket Soal"
                            name="nama_paket"
                            required
                            value={formData.nama_paket}
                            onChange={handleChange}
                            placeholder="Masukan nama paket soal"
                        />

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="w-full sm:w-1/2">
                                <Dropdown 
                                    label="Jenis Paket"
                                    required
                                    options={jenisPaketOptions}
                                    selectedText={formData.jenis}
                                    onSelect={handleSelectJenis}
                                />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <Dropdown 
                                    label="Status"
                                    required
                                    options={statusOptions}
                                    selectedText={formData.status}
                                    onSelect={handleSelectStatus}
                                />
                            </div>
                        </div>

                        <InputField 
                            label="Deskripsi Paket"
                            name="deskripsi"
                            type="textarea"
                            rows={3}
                            value={formData.deskripsi}
                            onChange={handleChange}
                            placeholder="Tuliskan deskripsi singkat..."
                        />

                        <ImageUploadBox 
                            label="Gambar Card Soal"
                            required
                            previewUrl={previewImage}
                            onChange={handleFileChange}
                            onRemove={handleRemoveImage}
                        />

                        <div className="pt-2">
                            <ButtonSave text="Simpan" onClick={() => alert("Saved")} className="w-full justify-center" />
                        </div>
                    </div>
                </div>
            </div>

            {/* OVERLAY */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[500px] flex flex-col relative">
                        
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 rounded-t-2xl z-50 relative">
                            <div className="flex items-center gap-4 w-full">
                                <SearchInput 
                                    placeholder="Cari Soal..." 
                                    value={modalSearch} 
                                    onChange={(e) => setModalSearch(e.target.value)} 
                                />

                                <DynamicFilter 
                                    filters={overlayFilterConfig}
                                    currentValues={modalFilters}
                                    onFilterChange={handleOverlayFilterChange}
                                />
                            </div>
                            
                            {/* Icon X Close */}
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="ml-4 text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 z-0">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-fit">
                                
                                <DynamicTable 
                                    columns={modalColumns}
                                    data={filteredBankSoal}
                                    isLoading={false}
                                    itemsPerPage={10}
                                    emptyMessage="Tidak ada soal ditemukan sesuai filter."
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl shrink-0 z-10">
                            <ButtonCancel text="Batal" onClick={() => setIsModalOpen(false)} type="button"/>
                            <ButtonSave 
                                text={`Tambahkan (${Object.keys(selectedInModal).length})`}
                                onClick={handleSaveModalSelection}
                                disabled={Object.keys(selectedInModal).length === 0}
                                className="min-w-[180px] justify-center"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
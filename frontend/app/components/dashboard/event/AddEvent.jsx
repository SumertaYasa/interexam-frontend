import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import SearchInput from "../common/SearchInput";
import DynamicTable from "../common/DynamicTable";
import DynamicFilter from "../common/DynamicFilter";
import ActionButton from "../common/ActionButton";
import ImageUploadCard from "../common/ImageUploadCard";

const DUMMY_CATEGORIES = [
    { id_category: 1, nama_category: "Tryout" },
    { id_category: 2, nama_category: "CPNS" },
    { id_category: 3, nama_category: "Ujian Sekolah SD" },
];

const DUMMY_PACKAGES = [
    { id: 101, nama_paket: "Paket UTBK Penalaran Umum A", jumlah_soal: 20, jenis: "Gratis", status: "active", image: "https://placehold.co/100x100/e2e8f0/1e293b?text=UTBK" },
    { id: 102, nama_paket: "Paket UTBK Bahasa Inggris B", jumlah_soal: 15, jenis: "Gratis", status: "active", image: "https://placehold.co/100x100/fee2e2/991b1b?text=ING" },
    { id: 103, nama_paket: "Paket Premium CPNS TIU", jumlah_soal: 35, jenis: "Berbayar", status: "active", image: "https://placehold.co/100x100/dbeafe/1e40af?text=CPNS" },
    { id: 104, nama_paket: "Paket Kilat Matematika SD", jumlah_soal: 10, jenis: "Gratis", status: "active", image: "https://placehold.co/100x100/dcfce7/166534?text=MTK" },
    { id: 105, nama_paket: "Paket Saintek Fisika Kimia", jumlah_soal: 50, jenis: "Berbayar", status: "active", image: "https://placehold.co/100x100/f3e8ff/6b21a8?text=SAINTEK" },
];

const statusOptions = [
    { label: "Active", value: "active" }, 
    { label: "Inactive", value: "inactive" },
    { label: "Draft", value: "draft" },
];

const jenisEventOptions = [
    { label: "Gratis", value: "Gratis" }, 
    { label: "Berbayar", value: "Berbayar" }, 
];

export default function AddEvent() {
    const navigate = useNavigate();

    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        nama_event: "",
        id_category: "",   
        jenis: "",         
        status: "draft",
        tanggal_mulai: "", 
        tanggal_selesai: "", 
        durasi_pengerjaan: "", 
        deskripsi: "",
        fotoEvent: null    
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [selectedPaketList, setSelectedPaketList] = useState([]); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paketData, setPaketData] = useState([]); 
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalSearch, setModalSearch] = useState("");
    const [selectedInModal, setSelectedInModal] = useState({}); 
    const [modalFilters, setModalFilters] = useState({ jenis: "all" });

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const tableBodyRef = useRef(null);

    useEffect(() => {
        const formatted = DUMMY_CATEGORIES.map(c => ({
            label: c.nama_category, 
            value: c.id_category
        }));
        setKategoriOptions(formatted);
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            let filtered = DUMMY_PACKAGES.filter(p => p.status === 'active');

            if (modalSearch) {
                const lowerSearch = modalSearch.toLowerCase();
                filtered = filtered.filter(p => p.nama_paket.toLowerCase().includes(lowerSearch));
            }
            if (modalFilters.jenis !== 'all') {
                filtered = filtered.filter(p => p.jenis === modalFilters.jenis);
            }

            const existingIds = new Set(selectedPaketList.map(p => p.id));
            const available = filtered.filter(p => !existingIds.has(p.id));

            setPaketData(available);
        }
    }, [isModalOpen, modalSearch, modalFilters, selectedPaketList]); 

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSelectKategori = (val) => setFormData({ ...formData, id_category: val });
    const handleSelectStatus = (val) => setFormData({ ...formData, status: val });
    const handleSelectJenis = (val) => setFormData({ ...formData, jenis: val });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fotoEvent: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    const handleRemoveImage = () => {
        setFormData({ ...formData, fotoEvent: null });
        setPreviewImage(null);
    };

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
        setSelectedPaketList([...selectedPaketList, ...newItems]);
        setIsModalOpen(false);
        setSelectedInModal({});
    };

    const cleanupVisuals = () => {
        if (tableBodyRef.current) {
            Array.from(tableBodyRef.current.children).forEach(row => {
                row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500', 'bg-gray-200', 'opacity-30');
            });
        }
    };
    const handleDragStart = (e, index) => {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = "move";
    };
    const handleDragEnter = (e, index) => {
        e.preventDefault();
        dragOverItem.current = index;
        const currentTarget = e.currentTarget;
        cleanupVisuals();
        if (dragItem.current < dragOverItem.current) currentTarget.classList.add('border-b-4', 'border-blue-500');
        else currentTarget.classList.add('border-t-4', 'border-blue-500');
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
        
        const listCopy = [...selectedPaketList];
        const draggedItem = listCopy[dragIndex];
        listCopy.splice(dragIndex, 1);
        listCopy.splice(dropIndex, 0, draggedItem);
        setSelectedPaketList(listCopy);
    };
    const handleDeleteItem = (id) => {
        setSelectedPaketList(prev => prev.filter(item => item.id !== id));
    };

    const handleSubmit = async () => {
        if (!formData.nama_event || !formData.id_category || !formData.tanggal_mulai) {
            return alert("Mohon lengkapi Nama Event, Kategori, dan Tanggal.");
        }
        if (selectedPaketList.length === 0) {
            return alert("Pilih minimal satu Paket Soal.");
        }
        setIsSaving(true);
        console.log("Simpan Event:", formData);
        console.log("Paket:", selectedPaketList);
        alert("Event Berhasil Dibuat (Data Dummy)!");
        navigate("../event");
        setIsSaving(false);
    };

    //  KOLOM MODAL (OVERLAY) - GAMBAR, NAMA, JML SOAL, JENIS, AKSI
    const modalColumns = [
        { 
            header: "GAMBAR", 
            render: (row) => (
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img 
                        src={row.image || "/placeholder-image.jpg"} 
                        alt="Paket" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )
        },
        { 
            header: "NAMA PAKET", 
            render: (row) => <span className="font-medium text-gray-900">{row.nama_paket}</span>
        },
        { 
            header: "JUMLAH SOAL", 
            render: (row) => <span className="text-sm text-gray-600 font-medium">{row.jumlah_soal} Soal</span> 
        },
        { 
            header: "JENIS", 
            render: (row) => <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.jenis === 'Gratis' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{row.jenis}</span>
        },
        {
            header: "AKSI", 
            render: (row) => (
                <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
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

    const overlayFilterConfig = [
        {
            key: "jenis", label: "Jenis", type: "radio", defaultValue: "all",
            options: [{ label: "Semua", value: "all" }, { label: "Gratis", value: "Gratis" }, { label: "Berbayar", value: "Berbayar" }]
        }
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50 font-noto-sans">
            <PageHeader 
                title="Add Event"
                breadcrumbs={[{ label: "Dashboard", link: "/dashboard" }, { label: "Event", link: "../event" }, { label: "Add", link: null }]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* --- KIRI: TABEL PAKET --- */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="text-sm text-gray-500 font-noto-sans">
                        Total Paket: <b>{selectedPaketList.length}</b>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <ActionButton 
                            text="+ Add Paket Soal" 
                            onClick={() => setIsModalOpen(true)}
                            variant="primary"
                        />
                        <div className="flex gap-2">
                            <ButtonCancel 
                                text="Kembali" 
                                onClick={() => navigate("../event")} 
                            />
                            <ButtonSave 
                                text={isSaving ? "Menyimpan..." : "Simpan Event"} 
                                onClick={handleSubmit} 
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gambar</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Paket</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah Soal</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody ref={tableBodyRef} className="bg-white divide-y divide-gray-200">
                                {selectedPaketList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                                            Belum ada paket soal yang dipilih.
                                        </td>
                                    </tr>
                                ) : (
                                    selectedPaketList.map((item, index) => (
                                        <tr 
                                            key={item.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragEnter={(e) => handleDragEnter(e, index)}
                                            onDragEnd={handleDragEnd}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="cursor-move hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{index + 1}</td>
                                            
                                            {/* GAMBAR */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                    <img 
                                                        src={item.image || "/placeholder-image.jpg"} 
                                                        alt="Paket" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>

                                            {/* NAMA PAKET */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-bold text-base text-gray-800">{item.nama_paket}</span>
                                            </td>

                                            {/* JUMLAH SOAL */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {item.jumlah_soal || 0} Soal
                                                </span>
                                            </td>

                                            {/* JENIS */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.jenis === 'Gratis' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {item.jenis}
                                                </span>
                                            </td>

                                            {/* AKSI DELETE */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button 
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                                    title="Hapus Paket"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* KANAN: FORM DETAIL*/}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6 border border-gray-100 space-y-4">
                        <h3 className="font-bold text-gray-800 border-b pb-2">Detail Event</h3>
                        
                        <Dropdown 
                            label="Kategori Event" required
                            options={kategoriOptions}
                            selectedText={kategoriOptions.find(o => o.value == formData.id_category)?.label || "Pilih Kategori"}
                            onSelect={handleSelectKategori} selectedValues={formData.id_category}
                        />

                        <InputField label="Nama Event" name="nama_event" required value={formData.nama_event} onChange={handleChange} placeholder="Contoh: Tryout Gratis" />

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="w-full sm:w-1/2">
                                <Dropdown 
                                    label="Jenis" required
                                    options={jenisEventOptions}
                                    selectedText={formData.jenis || "Pilih"}
                                    onSelect={handleSelectJenis} selectedValues={formData.jenis}
                                />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <Dropdown 
                                    label="Status" required
                                    options={statusOptions}
                                    selectedText={statusOptions.find(s => s.value === formData.status)?.label}
                                    onSelect={handleSelectStatus} selectedValues={formData.status}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="w-full sm:w-1/2">
                                <InputField label="Tanggal Mulai" name="tanggal_mulai" type="datetime-local" required value={formData.tanggal_mulai} onChange={handleChange} />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <InputField label="Tanggal Selesai" name="tanggal_selesai" type="datetime-local" required value={formData.tanggal_selesai} onChange={handleChange} />
                            </div>
                        </div>

                        <InputField label="Durasi (Menit)" name="durasi_pengerjaan" type="number" required value={formData.durasi_pengerjaan} onChange={handleChange} placeholder="Contoh: 120" />
                        <InputField label="Deskripsi" name="deskripsi" type="textarea" rows={3} value={formData.deskripsi} onChange={handleChange} placeholder="Contoh: Tryout Gratis untuk semua siswa" />
                        
                        <ImageUploadCard label="Banner Event" previewUrl={previewImage} onChange={handleFileChange} onRemove={handleRemoveImage} />
                    </div>
                </div>
            </div>

            {/* MODAL OVERLAY*/}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[550px] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
                            <h3 className="text-lg font-bold text-gray-800 font-noto-sans">Pilih Paket Soal</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
                            <SearchInput placeholder="Cari Paket..." value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} />
                            <DynamicFilter filters={overlayFilterConfig} currentValues={modalFilters} onFilterChange={(key, val) => setModalFilters(prev => ({...prev, [key]: val}))} />
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <DynamicTable columns={modalColumns} data={paketData} isLoading={isModalLoading} itemsPerPage={10} emptyMessage="Tidak ada paket ditemukan." />
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
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
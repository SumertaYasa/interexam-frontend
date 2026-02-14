import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { eventService } from "../../../services/eventService";
import { lookupService } from "../../../services/lookupService"; 

import ModalPreviewPaket from "./ModalPreviewPaket"; 

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import SearchInput from "../common/SearchInput";
import DynamicTable from "../common/DynamicTable";
import DynamicFilter from "../common/DynamicFilter";
import ActionButton from "../common/ActionButton";
import DraggableTable from "../common/DraggableTable";
import ImageUploadCard from "../common/ImageUploadCard";

const statusOptions = [
    { label: "Active", value: "active" }, 
    { label: "Inactive", value: "inactive" },
    { label: "Draft", value: "draft" },
];

const jenisEventOptions = [
    { label: "Gratis", value: "Gratis" }, 
    { label: "Berbayar", value: "Berbayar" }, 
];

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        nama_event: "", id_category: "", jenis: "", status: "draft",
        tanggal_mulai: "", tanggal_selesai: "", durasi_pengerjaan: "", deskripsi: "", fotoEvent: null    
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedPaketList, setSelectedPaketList] = useState([]); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paketData, setPaketData] = useState([]); 
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalSearch, setModalSearch] = useState("");
    const [selectedInModal, setSelectedInModal] = useState({}); 
    const [modalFilters, setModalFilters] = useState({ jenis: "all" });

    const [previewPaketId, setPreviewPaketId] = useState(null);

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const tableBodyRef = useRef(null);

    useEffect(() => {
        const initData = async () => {
            try {
                const catResult = await lookupService.getCategories(); 
                setKategoriOptions(catResult.map(c => ({ label: c.nama_category, value: String(c.id_category) })));

                const response = await eventService.getEventDetail(id);
                const data = response.data;

                setFormData({
                    nama_event: data.nama_event,
                    id_category: String(data.id_category),
                    jenis: data.jenis,
                    status: data.status,
                    tanggal_mulai: data.tanggal_mulai, 
                    tanggal_selesai: data.tanggal_selesai,
                    durasi_pengerjaan: data.durasi_pengerjaan,
                    deskripsi: data.deskripsi || "",
                    fotoEvent: null 
                });

                if (data.bannerUrl) setPreviewImage(data.bannerUrl);
                
                if (data.selectedPaket) {
                    const formattedPakets = data.selectedPaket.map(item => ({
                        id: item.id,
                        image: item.image,
                        nama_paket: item.nama_paket,
                        jumlah_soal: item.jumlah_soal ?? 0,
                        jenis: item.jenis ? (String(item.jenis).toLowerCase() === 'gratis' ? 'Gratis' : 'Berbayar') : 'Gratis'
                    }));
                    setSelectedPaketList(formattedPakets);
                }

            } catch (error) {
                console.error("Gagal load event:", error);
                alert("Event tidak ditemukan.");
                navigate("../event");
            } finally {
                setIsLoading(false);
            }
        };
        initData();
    }, [id]);

    useEffect(() => {
        if (isModalOpen) fetchPaketLookup();
    }, [isModalOpen, modalSearch, modalFilters]);

    const fetchPaketLookup = async () => {
        setIsModalLoading(true);
        try {
            const params = { search: modalSearch, jenis: modalFilters.jenis };
            const result = await eventService.getPackagesLookup(params);
            const existingIds = new Set(selectedPaketList.map(p => p.id));
            
            const available = (result.data || []).filter(p => !existingIds.has(p.id))
                .map(p => ({
                    ...p,
                    jenis: String(p.jenis).toLowerCase() === 'gratis' ? 'Gratis' : 'Berbayar'
                }));

            setPaketData(available);
        } catch (error) {
            setPaketData([]);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handlePreviewPaket = (item) => setPreviewPaketId(item.id);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSelectKategori = (val) => setFormData({ ...formData, id_category: val });
    const handleSelectStatus = (val) => setFormData({ ...formData, status: val });
    const handleSelectJenis = (val) => setFormData({ ...formData, jenis: val });
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setFormData({ ...formData, fotoEvent: file }); setPreviewImage(URL.createObjectURL(file)); }
    };
    const handleRemoveImage = () => { setFormData({ ...formData, fotoEvent: null }); setPreviewImage(null); };

    const handleToggleModalSelection = (item) => {
        setSelectedInModal(prev => {
            const newState = { ...prev };
            if (newState[item.id]) delete newState[item.id];
            else newState[item.id] = item;
            return newState;
        });
    };
    
    const handleSaveModalSelection = () => {
        const newItems = Object.values(selectedInModal).map(item => ({
            ...item,
            jenis: String(item.jenis).toLowerCase() === 'gratis' ? 'Gratis' : 'Berbayar'
        }));
        setSelectedPaketList([...selectedPaketList, ...newItems]);
        setIsModalOpen(false);
        setSelectedInModal({});
    };

    const cleanupVisuals = () => {
        if (tableBodyRef.current) {
            Array.from(tableBodyRef.current.children).forEach(row => {
                row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500', 'bg-gray-200', 'shadow-2xl', 'opacity-30', 'z-10');
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
            Array.from(tableBodyRef.current.children).forEach(row => row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500'));
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
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
        
        const listCopy = [...selectedPaketList];
        const draggedItem = listCopy[dragItem.current];
        listCopy.splice(dragItem.current, 1);
        listCopy.splice(dragOverItem.current, 0, draggedItem);
        setSelectedPaketList(listCopy);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDeleteItem = (id) => { setSelectedPaketList(prev => prev.filter(item => item.id !== id)); };

    const handleSubmit = async () => {
        if (!formData.nama_event || !formData.id_category) return alert("Mohon lengkapi data wajib.");
        if (selectedPaketList.length === 0) return alert("Pilih minimal satu Paket Soal.");
        
        setIsSaving(true);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'fotoEvent' && formData[key]) payload.append(key, formData[key]);
            });
            const paketIds = selectedPaketList.map(p => p.id);
            payload.append("paket_ids", JSON.stringify(paketIds)); 
            
            if (formData.fotoEvent) payload.append("fotoEvent", formData.fotoEvent); 

            await eventService.updateEvent(id, payload);
            alert("Event Berhasil Diperbarui!");
            navigate("../event");
        } catch (error) {
            alert(error.response?.data?.message || "Terjadi kesalahan.");
        } finally { setIsSaving(false); }
    };

    const eventTableColumns = [
        { header: "NO", render: (_, idx) => <span className="font-medium text-gray-900">{idx + 1}</span> },

        { header: "GAMBAR", 
            render: (row) => (
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={row.image || "/placeholder-image.jpg"} alt="Paket" className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-image.jpg"; }} />
                </div>
            )
        },

        { header: "NAMA PAKET", 
            render: (row) => 
                <span className="font-bold text-gray-800">
                    {row.nama_paket}
                </span> 
            },

        { header: "JUMLAH SOAL", 
            render: (row) => 
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {row.jumlah_soal} Soal
                </span> 
        },

        { header: "JENIS", 
            render: (row) => 
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${String(row.jenis).toLowerCase() === 'gratis' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {row.jenis}
                </span> 
        },
        { header: "AKSI",
            className: "text-center",
            render: (row) => (
                <div className="flex justify-center">
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(row.id); }} 
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                    </button>
                </div>
            )
        }
    ];

    const modalColumns = [
        { 
            header: "GAMBAR", 
            render: (row) => (
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={row.image || "/placeholder-image.jpg"} alt="Paket" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-image.jpg"; }} />
                </div>
            )
        },

        { header: "NAMA PAKET", render: (row) => 
            <span className="font-medium text-gray-900">
                {row.nama_paket}
            </span> 
        },

        { header: "JUMLAH SOAL", render: (row) => 
            <span className="text-sm text-gray-600 font-medium">
                {row.jumlah_soal} Soal
            </span> 
        },

        { header: "JENIS", render: (row) => 
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${String(row.jenis).toLowerCase() === 'gratis' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {row.jenis}
            </span> 
        },

        {
            header: "AKSI", 
            render: (row) => (
                <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                    <label className="cursor-pointer relative">
                        <input type="checkbox" className="sr-only peer" checked={!!selectedInModal[row.id]} onChange={() => handleToggleModalSelection(row)} />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedInModal[row.id] ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                            {selectedInModal[row.id] && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                        </div>
                    </label>
                </div>
            )
        }
    ];

    const overlayFilterConfig = [
        {
            key: "jenis", 
            label: "Jenis", 
            type: "radio", 
            defaultValue: "all",

            options: [{ 
                label: "Semua", 
                value: "all" }, 
                { label: "Gratis", value: "gratis" }, 
                { label: "Berbayar", value: "berbayar" }
            ]
        }
    ];

    if (isLoading) return <div className="p-10 text-center font-noto-sans text-gray-500">Memuat data event...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50 font-noto-sans">
            <PageHeader 
                title="Edit Event" 
                breadcrumbs={[{ label: "Dashboard", link: "/dashboard" }, 
                            { label: "Event", link: "../event" }, 
                            { label: "Edit", link: null }]} 
            />

            {previewPaketId && <ModalPreviewPaket paketId={previewPaketId} onClose={() => setPreviewPaketId(null)} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <div className="text-sm text-gray-500 font-noto-sans">Total Paket: <b>{selectedPaketList.length}</b></div>
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

                            <ButtonSave text={isSaving ? "Memperbarui..." : "Update Event"} 
                                onClick={handleSubmit} 
                                disabled={isSaving} 
                            />

                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <DraggableTable 
                            ref={tableBodyRef}
                            columns={eventTableColumns}
                            data={selectedPaketList}
                            onDragStart={handleDragStart}
                            onDragEnter={handleDragEnter}
                            onDragEnd={handleDragEnd}
                            onDrop={handleDrop}
                            onRowClick={handlePreviewPaket}
                            emptyMessage="Belum ada paket soal yang dipilih."
                        />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6 border border-gray-100 space-y-4">
                        <h3 className="font-bold text-gray-800 border-b pb-2">Detail Event</h3>

                        <Dropdown 
                            label="Kategori Event" 
                            required options={kategoriOptions} 
                            selectedText={kategoriOptions.find(o => o.value == formData.id_category)?.label || "Pilih"} 
                            onSelect={handleSelectKategori} 
                            selectedValues={formData.id_category} 
                        />

                        <InputField 
                            label="Nama Event" 
                            name="nama_event" 
                            required value={formData.nama_event} 
                            onChange={handleChange} 
                        />

                        <div className="flex gap-4">

                            <div className="w-1/2">
                                <Dropdown 
                                    label="Jenis" 
                                    required options={jenisEventOptions} 
                                    selectedText={formData.jenis || "Pilih"} 
                                    onSelect={handleSelectJenis} 
                                    selectedValues={formData.jenis} 
                                />
                            </div>

                            <div className="w-1/2">
                                <Dropdown label="Status" 
                                    required options={statusOptions} 
                                    selectedText={statusOptions.find(s => s.value === formData.status)?.label} 
                                    onSelect={handleSelectStatus} 
                                    selectedValues={formData.status} 
                                />
                            </div>

                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            <div className="w-full">
                                <InputField label="Tanggal Mulai" 
                                    name="tanggal_mulai" 
                                    type="datetime-local" 
                                    required value={formData.tanggal_mulai} 
                                    onChange={handleChange} 
                                />
                            </div>

                            <div className="w-full">
                                <InputField label="Tanggal Selesai" 
                                    name="tanggal_selesai" 
                                    type="datetime-local" 
                                    required value={formData.tanggal_selesai} 
                                    onChange={handleChange} 
                                />
                            </div>

                        </div>

                        <InputField label="Durasi (Menit)" 
                            name="durasi_pengerjaan" 
                            type="number" required 
                            value={formData.durasi_pengerjaan} 
                            onChange={handleChange} 
                        />

                        <InputField label="Deskripsi" 
                            name="deskripsi" 
                            type="textarea" rows={3} 
                            value={formData.deskripsi} 
                            onChange={handleChange} 
                        />

                        <ImageUploadCard label="Banner Event" 
                            previewUrl={previewImage} 
                            onChange={handleFileChange} 
                            onRemove={handleRemoveImage} 
                        />

                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[550px] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
                            <h3 className="text-lg font-bold text-gray-800 font-noto-sans">Pilih Paket Soal</h3>
                            <button onClick={() => setIsModalOpen(false)} 
                                className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                            </button>
                        </div>

                        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
                            <SearchInput 
                                placeholder="Cari Paket..." 
                                value={modalSearch} 
                                onChange={(e) => setModalSearch(e.target.value)} 
                            />

                            <DynamicFilter 
                                filters={overlayFilterConfig} 
                                currentValues={modalFilters} 
                                onFilterChange={(key, val) => setModalFilters(prev => ({...prev, [key]: val}))} 
                            />

                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <DynamicTable 
                                columns={modalColumns} 
                                data={paketData} 
                                isLoading={isModalLoading} 
                                itemsPerPage={10} 
                                onRowClick={handlePreviewPaket} 
                                emptyMessage="Tidak ada paket." 
                            />
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
                            <ButtonCancel 
                                text="Batal" 
                                onClick={() => setIsModalOpen(false)} 
                            />

                            <ButtonSave 
                                text={`Tambahkan (${Object.keys(selectedInModal).length})`} 
                                onClick={handleSaveModalSelection} 
                                disabled={Object.keys(selectedInModal).length===0} 
                            />
                            
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

import { paketSoalService } from "../../../services/paketSoalService";
import { lookupService } from "../../../services/lookupService"; 

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import SearchInput from "../common/SearchInput";
import DynamicTable from "../common/DynamicTable";
import DynamicFilter from "../common/DynamicFilter";
import ActionButton from "../common/ActionButton";
import DraggableTable, { formatSoalDisplay, getLevelBadge } from "../common/DraggableTable";
import ImageUploadCard from "../common/ImageUploadCard";

import ModalDetailSoal from "../bank-soal/ModalDetailSoal";

const statusOptions = [
    { label: "Active", value: "active" }, 
    { label: "Inactive", value: "inactive" },
    { label: "Draft", value: "draft" },
];

const jenisPaketOptions = [
    { label: "Gratis", value: "gratis" }, 
    { label: "Berbayar", value: "berbayar" }, 
];

export default function AddPaketSoal() {
    const navigate = useNavigate();

    const [subjectOptions, setSubjectOptions] = useState([]);
    const [kategoriOptions, setKategoriOptions] = useState([]);

    const [formData, setFormData] = useState({
        nama_paket: "",
        matapelajaran: [], 
        id_category: "",   
        jenis: "",         
        status: "draft",
        deskripsi: "", 
        fotoSampul: null
    });
    
    // State Table Utama
    const [paketSoalList, setPaketSoalList] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // STATE MODAL BANK SOAL 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bankSoalData, setBankSoalData] = useState([]); 
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalSearch, setModalSearch] = useState("");
    const [selectedInModal, setSelectedInModal] = useState({}); 

    const [detailSoalId, setDetailSoalId] = useState(null);
    
    const [modalFilters, setModalFilters] = useState({
        jenjang: "all",
        level: "all"
    });

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const tableBodyRef = useRef(null);

    const formatTipeSoal = (rawType) => {
        if (!rawType) return "-";
        const lower = String(rawType).toLowerCase().trim();
        
        if (lower.includes('multi_jawaban') || lower.includes('answer') || lower.includes('complex')) {
            return "Multi Jawaban";
        }

        if (lower.includes('pilihan') || lower.includes('choice') || lower.includes('ganda')) {
            return "Pilihan Ganda";
        }
        return rawType; 
    };

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [subjects, categories] = await Promise.all([
                    lookupService.getSubjects(),
                    lookupService.getCategories() 
                ]);

                setSubjectOptions(subjects.map(s => ({
                    label: s.nama_subject,
                    value: s.nama_subject 
                })));

                setKategoriOptions(categories.map(c => ({
                    label: c.nama_category, 
                    value: c.id_category
                })));

            } catch (error) {
                console.error("Error loading references", error);
            }
        };
        fetchLookups();
    }, []);

    // LOGIKA BISNIS: KATEGORI & JENIS PAKET
    useEffect(() => {
        if (formData.id_category) {
            const selectedCat = kategoriOptions.find(c => c.value == formData.id_category);
            if (selectedCat) {
                const catName = selectedCat.label.toLowerCase();
                
                // Logic: Jika nama kategori mengandung "try out" atau "ujian" -> Default Berbayar
                // Selain itu -> Default Gratis
                if (catName.includes("try out") || catName.includes("ujian")) {
                     setFormData(prev => ({ ...prev, jenis: "berbayar" }));
                } else {
                     setFormData(prev => ({ ...prev, jenis: "gratis" }));
                }
            }
        }
    }, [formData.id_category, kategoriOptions]);

    const isJenisDisabled = () => {
        return false; 
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchBankSoal();
        }
    }, [isModalOpen, modalSearch, modalFilters]); 

    const fetchBankSoal = async () => {
        setIsModalLoading(true);
        try {
            const params = {
                search: modalSearch,
                matapelajaran: formData.matapelajaran.join(','), 
                jenjang: modalFilters.jenjang,
                level: modalFilters.level,
                page: 1,
                limit: 50 
            };

            const result = await paketSoalService.getBankSoal(params);
            
            const existingIds = new Set(paketSoalList.map(p => p.id));
            
            const available = result.data
                .filter(soal => !existingIds.has(soal.id || soal.id_soal))
                .map(item => ({
                    id: item.id || item.id_soal,
                    
                    //  Ambil dari berbagai key
                    nama_soal: item.nama_soal || item.text_soal || item.soal_text || "-", 
                    matapelajaran: item.matapelajaran || (item.topic?.subject?.nama_subject) || "-",
                    jenjang: item.jenjang || (item.topic?.jenjang?.nama_jenjang) || "-",
                    
                    // Simpan tipe asli
                    tipe_soal: item.tipe_soal || item.jenis_soal, 
                    level: item.level || item.level_kesulitan || "mudah"
                }));
            
            setBankSoalData(available);
        } catch (error) {
            console.error("Gagal load bank soal", error);
        } finally {
            setIsModalLoading(false);
        }
    };

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

    const handleSelectKategori = (val) => setFormData({ ...formData, id_category: val });
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
        
        const formattedNewItems = newItems.map(item => ({
            ...item,
            mata_pelajaran: item.matapelajaran,
            tipe_soal: formatTipeSoal(item.tipe_soal) 
        }));

        setPaketSoalList([...paketSoalList, ...formattedNewItems]);
        setIsModalOpen(false);
        setSelectedInModal({});
    };

    const cleanupVisuals = () => {
        if (tableBodyRef.current) {
            const rows = tableBodyRef.current.children;
            Array.from(rows).forEach(row => {
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

    const handleSubmit = async () => {
        if (!formData.nama_paket || formData.matapelajaran.length === 0 ) {
            return alert("Mohon lengkapi Nama Paket dan Mata Pelajaran");
        }
        if (paketSoalList.length === 0) {
            return alert("Pilih minimal satu soal.");
        }

        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append("nama_paket", formData.nama_paket);
            payload.append("deskripsi", formData.deskripsi);
            payload.append("jenis", formData.jenis);
            payload.append("status", formData.status);
            payload.append("id_category", formData.id_category);
            
            const sortedIds = paketSoalList.map(s => s.id);
            payload.append("soal_ids", JSON.stringify(sortedIds));

            if (formData.fotoSampul) {
                payload.append("image", formData.fotoSampul);
            }

            await paketSoalService.createPaketSoal(payload);
            
            alert("Paket Soal Berhasil Dibuat!");
            navigate("../paket-soal");

        } catch (error) {
            console.error("Detail error saat menyimpan paket soal:", error.response?.data || error);
            const errMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Terjadi kesalahan saat menyimpan.";
            alert(errMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRowClick = (item) => {
        // Set ID soal yang diklik agar modal detail muncul
        setDetailSoalId(item.id);
    };

    const modalColumns = [
        { 
            header: "SOAL", 
            render: (row) => {

                const text = row.nama_soal || row.text_soal || row.soal_text || "-";
                return formatSoalDisplay(text);
            }
        },
        { header: "MATA PELAJARAN", accessor: "matapelajaran" },
        { header: "JENJANG", accessor: "jenjang" },
        { 
            header: "TIPE SOAL", 
            render: (row) => formatTipeSoal(row.tipe_soal) 
        },
        
        { header: "LEVEL KESULITAN", render: (row) => getLevelBadge(row.level) },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex justify-center items-center"
                    onClick={(e) => e.stopPropagation()}
                >
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

    // Filter
    const overlayFilterConfig = [
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

    const getSelectedLabel = (options, value) => options.find(o => o.value == value)?.label || "Pilih...";

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

            {detailSoalId && (
                <ModalDetailSoal 
                    soalId={detailSoalId} 
                    onClose={() => setDetailSoalId(null)} 
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* KIRI TABEL UTAMA */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="text-sm text-gray-500 font-noto-sans">
                        Total Soal: <b>{paketSoalList.length}</b>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between  gap-4">
                        <ActionButton 
                            text="Add Soal dari Bank Soal" 
                            onClick={() => setIsModalOpen(true)}
                            variant="primary"
                            disabled={formData.matapelajaran.length === 0}
                            title={formData.matapelajaran.length === 0 ? "Pilih Mata Pelajaran Terlebih Dahulu" : ""}
                        />
                        <div className="">
                            <ButtonSave 
                                text={isSaving ? "Menyimpan..." : "Simpan"} 
                                onClick={handleSubmit} 
                                className="w-full md:w-auto justify-center" 
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <DraggableTable 
                        ref={tableBodyRef}
                        data={paketSoalList}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                        onDelete={handleDeleteSoal}
                        onRowClick={handleRowClick}
                    />
                </div>

                {/* KANAN FORM DETAIL */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6 border border-gray-100 space-y-3">
                        
                        {/* Mata Pelajaran */}
                        <Dropdown 
                            label="Mata Pelajaran"
                            required
                            options={subjectOptions}
                            selectedText={
                                formData.matapelajaran.length > 0 
                                ? formData.matapelajaran.join(", ") 
                                : "Pilih Mata Pelajaran"
                            }
                            onSelect={handleSelectMapel}
                            multiSelect={true}
                            selectedValues={formData.matapelajaran}
                        />

                        {/* Kategori */}
                        {/* <Dropdown 
                            label="Kategori"
                            // required
                            options={kategoriOptions}
                            selectedText={getSelectedLabel(kategoriOptions, formData.id_category)}
                            onSelect={handleSelectKategori}
                            selectedValues={formData.id_category}
                        /> */}

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
                                    selectedText={formData.jenis || "Jenis paket"}
                                    onSelect={handleSelectJenis}
                                    selectedValues={formData.jenis}
                                    disabled={isJenisDisabled()}
                                />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <Dropdown 
                                    label="Status"
                                    required
                                    options={statusOptions}
                                    selectedText={statusOptions.find(s => s.value === formData.status)?.label}
                                    onSelect={handleSelectStatus}
                                    selectedValues={formData.status}
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
                            placeholder="Masukan deskripsi..."
                        />

                        <ImageUploadCard 
                            label="Gambar Card Soal"
                            required
                            previewUrl={previewImage}
                            onChange={handleFileChange}
                            onRemove={handleRemoveImage}
                        />

                        
                    </div>
                </div>
            </div>

            {/* OVERLAY */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[550px] flex flex-col relative">
                        
                        {/* Header Modal */}
                        <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-2 bg-white shrink-0 rounded-t-2xl z-50">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 font-noto-sans">
                                    Bank Soal: <span className="text-primary font-normal font-noto-sans">{formData.matapelajaran.join(", ")}</span>
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-4 w-full mt-2">
                                <SearchInput 
                                    placeholder="Cari Soal..." 
                                    value={modalSearch} 
                                    onChange={(e) => setModalSearch(e.target.value)} 
                                />
                                <DynamicFilter 
                                    filters={overlayFilterConfig}
                                    currentValues={modalFilters}
                                    onFilterChange={(key, val) => setModalFilters(prev => ({...prev, [key]: val}))}
                                />
                            </div>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-fit">
                                <DynamicTable 
                                    columns={modalColumns}
                                    data={bankSoalData}
                                    isLoading={isModalLoading}
                                    itemsPerPage={10}
                                    onRowClick={handleRowClick}
                                    emptyMessage="Tidak ada soal ditemukan untuk mapel ini."
                                />
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl shrink-0">
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
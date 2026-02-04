import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { paketSoalService } from "../../../services/paketSoalService";
import { lookupService } from "../../../services/lookupService";
import { soalService } from "../../../services/soalService"; 

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
    { label: "Gratis", value: "latihan" }, 
    { label: "Berbayar", value: "try_out" }, 
];

export default function EditPaketSoal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subjectOptions, setSubjectOptions] = useState([]);
    const [kategoriOptions, setKategoriOptions] = useState([]);

    const [formData, setFormData] = useState({
        nama_paket: "",
        matapelajaran: [], 
        id_category: "",   
        jenis: "",         
        status: "",
        deskripsi: "", 
        fotoSampul: null   
    });
    
    const [paketSoalList, setPaketSoalList] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    const [isSaving, setIsSaving] = useState(false);

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
    
    const isFirstRender = useRef(true);

    const formatTipeSoal = (rawType) => {
        if (!rawType) return "-";
        
        const lower = String(rawType).toLowerCase().trim();
        
        if (lower === 'pilihan_ganda' || lower === 'multiple_choice' || lower.includes('pilihan')) {
            return "Pilihan Ganda";
        }

        if (lower === 'multi_jawaban' || lower === 'multiple_answer' || lower.includes('jawaban') || lower.includes('answer')) {
            return "Multi Jawaban";
        }
        
        return rawType; 
    };

    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            try {
                const [subjects, categories, responseDetail] = await Promise.all([
                    lookupService.getSubjects(),
                    lookupService.getCategories(),
                    paketSoalService.getPaketDetail(id)
                ]);

                // setSubjectOptions(subjects.map(s => ({ label: s.nama_subject, value: s.nama_subject })));
                // setKategoriOptions(categories.map(c => ({ label: c.nama_category, value: c.id_category })));

                setSubjectOptions(subjects.map(s => ({ label: s.nama_subject, value: s.nama_subject })));
                // setKategoriOptions(categories.map(c => ({ label: c.nama_category, value: String(c.id_category) })));
                setKategoriOptions(categories.map(c => ({ 
                    label: c.nama_category, 
                    value: String(c.id_category) // Paksa jadi String
                })));

                const data = responseDetail.data;
                
                setFormData({
                    nama_paket: data.nama_paket,
                    // matapelajaran: extractSubjectsFromSoal(data.soal_paket_soal), 
                    // id_category: data.id_category,

                    matapelajaran: extractSubjectsFromSoal(data.soal_paket_soal), 
                
                    // id_category: data.id_category ? String(data.id_category) : "",
                    id_category: data.id_category ? String(data.id_category) : "",
                    
                    jenis: data.jenis, 
                    status: data.status,
                    deskripsi: data.deskripsi || "",
                    fotoSampul: data.image 
                });

                setPreviewImage(soalService.getAssetUrl(data.image));

                const mappedSoal = data.soal_paket_soal.map(item => ({
                    id: item.soal.id_soal,
                    nama_soal: item.soal.text_soal,
                    // mata_pelajaran: item.soal.topic?.subject?.nama_subject || "-", 
                    // jenjang: item.soal.topic?.jenjang?.nama_jenjang || "-",
                    mata_pelajaran: item.soal.subject || "-", 
                    jenjang: item.soal.jenjang || "-",
                    
                    tipe_soal: formatTipeSoal(item.soal.jenis_soal || item.soal.tipe_soal),
                    
                    level: item.soal.level_kesulitan,
                    status: 'Disetujui'
                }));
                
                setPaketSoalList(mappedSoal);

            } catch (error) {
                console.error("Error init data:", error);
                alert("Gagal memuat detail paket soal.");
                navigate("../paket-soal");
            } finally {
                setIsLoading(false);
                setTimeout(() => { isFirstRender.current = false; }, 500);
            }
        };

        initData();
    }, [id]);

    const extractSubjectsFromSoal = (soalList) => {
        if (!soalList) return [];
        const subjects = new Set();
        soalList.forEach(item => {
        if (item.soal && item.soal.subject) {
            subjects.add(item.soal.subject);
        }
    });
        return Array.from(subjects);
    };

    // LOGIKA KATEGORI ---
    useEffect(() => {
        if (isLoading || isFirstRender.current) return;

        if (formData.id_category) {
            const selectedCat = kategoriOptions.find(c => c.value == formData.id_category);
            if (selectedCat) {
                const catName = selectedCat.label.toLowerCase();
                if (!catName.includes("latihan soal")) {
                    setFormData(prev => ({ ...prev, jenis: "latihan" })); 
                }
            }
        }
    }, [formData.id_category, kategoriOptions]);

    const isJenisDisabled = () => {
        const selectedCat = kategoriOptions.find(c => c.value == formData.id_category);
        if (!selectedCat) return false;
        return !selectedCat.label.toLowerCase().includes("latihan soal");
    };

    // FETCH BANK SOAL
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
            
            const mappedAvailable = result.data
                .filter(soal => !existingIds.has(soal.id || soal.id_soal))
                .map(item => ({
                    id: item.id || item.id_soal,
                    
                    nama_soal: item.nama_soal || item.text_soal || item.soal_text || "-", 
                    
                    matapelajaran: item.matapelajaran || (item.topic?.subject?.nama_subject) || "-",
                    jenjang: item.jenjang || (item.topic?.jenjang?.nama_jenjang) || "-",
                    
                    tipe_soal: item.tipe_soal || item.jenis_soal,
                    
                    level: item.level || item.level_kesulitan || "mudah"
                }));
            
            setBankSoalData(mappedAvailable);
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
            if (current.includes(val)) return { ...prev, matapelajaran: current.filter(item => item !== val) };
            else return { ...prev, matapelajaran: [...current, val] };
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

    const handleDeleteSoal = (id) => {
        setPaketSoalList(prev => prev.filter(item => item.id !== id));
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
            const emptyImg = new Image(); e.dataTransfer.setDragImage(emptyImg, 0, 0); 
        }
    };
    const handleDragEnter = (e, index) => { e.preventDefault(); dragOverItem.current = index; if (tableBodyRef.current) { Array.from(tableBodyRef.current.children).forEach(row => row.classList.remove('border-b-4', 'border-t-4', 'border-blue-500')); } const currentTarget = e.currentTarget; if (dragItem.current !== null && dragItem.current !== dragOverItem.current) { if (dragItem.current < dragOverItem.current) { currentTarget.classList.add('border-b-4', 'border-blue-500'); } else { currentTarget.classList.add('border-t-4', 'border-blue-500'); } } };
    const handleDragEnd = () => { cleanupVisuals(); dragItem.current = null; dragOverItem.current = null; };
    const handleDrop = (e) => { e.preventDefault(); cleanupVisuals(); const dragIndex = dragItem.current; const dropIndex = dragOverItem.current; if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) return; const listCopy = [...paketSoalList]; const draggedItem = listCopy[dragIndex]; listCopy.splice(dragIndex, 1); listCopy.splice(dropIndex, 0, draggedItem); setPaketSoalList(listCopy); dragItem.current = null; dragOverItem.current = null; };

    const handleSubmit = async () => {
        if (!formData.nama_paket || !formData.id_category) {
            return alert("Nama Paket dan Kategori wajib diisi.");
        }
        if (paketSoalList.length === 0) {
            return alert("Paket soal tidak boleh kosong.");
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

            if (formData.fotoSampul instanceof File) {
                payload.append("image", formData.fotoSampul);
            } 

            await paketSoalService.updatePaket(id, payload);
            alert("Paket Soal Berhasil Diperbarui!");
            navigate("../paket-soal");

        } catch (error) {
            alert(error.response?.data?.message || "Gagal memperbarui paket.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- RENDER HELPERS ---
    const getSelectedLabel = (options, value) => options.find(o => o.value == value)?.label || "Pilih...";
    const overlayFilterConfig = [
        { key: "jenjang", label: "Jenjang", type: "radio", defaultValue: "all", options: [{ label: "Semua Jenjang", value: "all" }, { label: "SD", value: "SD" }, { label: "SMP", value: "SMP" }, { label: "SMA", value: "SMA" }] },
        { key: "level", label: "Level Kesulitan", type: "radio", defaultValue: "all", options: [{ label: "Semua Level", value: "all" }, { label: "Mudah", value: "Mudah" }, { label: "Sedang", value: "Sedang" }, { label: "Sulit", value: "Sulit" }] }
    ];

    const handleRowClick = (item) => {
        // Set ID soal yang diklik agar modal detail muncul
        setDetailSoalId(item.id);
    };

    const modalColumns = [
        { 
            header: "SOAL", 
            render: (row) => formatSoalDisplay(row.nama_soal || row.text_soal || "-") 
        },
        { header: "MATA PELAJARAN", accessor: "matapelajaran" },
        { header: "JENJANG", accessor: "jenjang" },
        
        // [FIX TIPE SOAL] 
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

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-noto-sans">Memuat data...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50">
            <PageHeader 
                title="Edit Paket Soal"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Paket Soal", link: "../paket-soal" },
                    { label: "Edit", link: null }
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
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <ActionButton 
                            text="+ Soal Dari Bank Soal" 
                            onClick={() => setIsModalOpen(true)}
                            variant="primary"
                            disabled={formData.matapelajaran.length === 0}
                            title={formData.matapelajaran.length === 0 ? "Pilih Mata Pelajaran Terlebih Dahulu" : ""}
                        />
                        <ButtonSave 
                                text={isSaving ? "Menyimpan..." : "Update"} 
                                onClick={handleSubmit} 
                                className="w-full justify-center" 
                                disabled={isSaving}
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
                        onRowClick={handleRowClick}
                    />
                </div>

                {/* KANAN FORM DETAIL */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6 border border-gray-100 space-y-3">
                        
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

                        <Dropdown 
                            label="Kategori"
                            required
                            options={kategoriOptions}
                            selectedText={getSelectedLabel(kategoriOptions, formData.id_category)}
                            onSelect={handleSelectKategori}
                            selectedValues={formData.id_category}
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
                                    selectedText={jenisPaketOptions.find(j => j.value === formData.jenis)?.label || "Pilih"}
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
                                    selectedText={statusOptions.find(s => s.value === formData.status)?.label || "Pilih"}
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
                            placeholder="Tuliskan deskripsi singkat..."
                        />

                        <ImageUploadCard 
                            label="Gambar Card Soal"
                            required
                            previewUrl={previewImage}
                            onChange={handleFileChange}
                            onRemove={handleRemoveImage}
                        />

                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                            
                            <ButtonCancel 
                                text="Batal"
                                onClick={() => navigate("../paket-soal")}
                                type="button"
                                className="w-full justify-center"
                            />
                        </div>
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

                        {/* Body Modal (Table) */}
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
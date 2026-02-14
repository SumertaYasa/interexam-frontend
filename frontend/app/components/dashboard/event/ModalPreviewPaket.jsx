import { useState, useEffect } from "react";
import { paketSoalService } from "../../../services/paketSoalService";
import { lookupService } from "../../../services/lookupService";
import { soalService } from "../../../services/soalService";

import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ButtonCancel from "../common/ButtonCancel";
import DynamicTable from "../common/DynamicTable"; 
import ImageUploadCard from "../common/ImageUploadCard";
import { formatSoalDisplay, getLevelBadge } from "../common/DraggableTable"; 

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

export default function ModalPreviewPaket({ paketId, onClose }) {
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
    
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [kategoriOptions, setKategoriOptions] = useState([]);

    const [detailSoalId, setDetailSoalId] = useState(null);

    const formatTipeSoal = (rawType) => {
        if (!rawType) return "-";
        const lower = String(rawType).toLowerCase().trim();
        if (lower === 'pilihan_ganda' || lower === 'multiple_choice' || lower.includes('pilihan')) return "Pilihan Ganda";
        if (lower === 'multi_jawaban' || lower === 'multiple_answer' || lower.includes('jawaban')) return "Multi Jawaban";
        return rawType; 
    };

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

    useEffect(() => {
        const initData = async () => {
            if (!paketId) return;
            setIsLoading(true);
            try {
                const [subjects, categories, responseDetail] = await Promise.all([
                    lookupService.getSubjects(),
                    lookupService.getCategories(),
                    paketSoalService.getPaketDetail(paketId)
                ]);

                setSubjectOptions(subjects.map(s => ({ label: s.nama_subject, value: s.nama_subject })));
                setKategoriOptions(categories.map(c => ({ 
                    label: c.nama_category, 
                    value: String(c.id_category) 
                })));

                const data = responseDetail.data;
                
                setFormData({
                    nama_paket: data.nama_paket,
                    matapelajaran: extractSubjectsFromSoal(data.soal_paket_soal), 
                    id_category: data.id_category ? String(data.id_category) : "",
                    jenis: data.jenis || 'gratis',
                    status: data.status,
                    deskripsi: data.deskripsi || "-",
                    fotoSampul: data.image 
                });

                if (data.image) {
                    setPreviewImage(soalService.getAssetUrl(data.image));
                }

                const mappedSoal = data.soal_paket_soal.map(item => ({
                    id: item.soal.id_soal,
                    nama_soal: item.soal.text_soal,
                    mata_pelajaran: item.soal.subject || "-", 
                    jenjang: item.soal.jenjang || "-",
                    tipe_soal: formatTipeSoal(item.soal.jenis_soal || item.soal.tipe_soal),
                    level: item.soal.level_kesulitan,
                }));
                
                setPaketSoalList(mappedSoal);

            } catch (error) {
                console.error("Error init data detail:", error);
                alert("Gagal memuat detail paket soal.");
                onClose();
            } finally {
                setIsLoading(false);
            }
        };

        initData();
    }, [paketId]);

    const handleRowClick = (item) => {
        setDetailSoalId(item.id);
    };

    const columns = [
        { header: "SOAL", render: (row) => formatSoalDisplay(row.nama_soal) },
        { header: "MATA PELAJARAN", accessor: "mata_pelajaran" },
        { header: "JENJANG", accessor: "jenjang" },
        { header: "TIPE SOAL", accessor: "tipe_soal" },
        { header: "LEVEL KESULITAN", render: (row) => getLevelBadge(row.level) }
    ];

    const getSelectedLabel = (options, value) => options.find(o => o.value == value)?.label || "-";
    const getSelectedStatusLabel = (value) => statusOptions.find(o => o.value === value)?.label || value;
    const getSelectedJenisLabel = (value) => jenisPaketOptions.find(o => o.value === value)?.label || value;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
            <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-[95%] max-h-[95vh] flex flex-col relative my-auto">
                
                <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 font-noto-sans">Preview Paket Soal</h3>
                        {!isLoading && <p className="text-sm text-gray-500">{formData.nama_paket}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center text-gray-500">Memuat data paket...</div>
                    ) : (
                        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                            
                            <div className="w-full lg:col-span-2 space-y-4">
                                <div className="text-sm text-gray-500 font-noto-sans">
                                    Total Soal: <b>{paketSoalList.length}</b>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
                                    <div className="min-w-[600px]">
                                        <DynamicTable 
                                            columns={columns}
                                            data={paketSoalList}
                                            isLoading={false}
                                            itemsPerPage={10}
                                            onRowClick={handleRowClick} 
                                            emptyMessage="Tidak ada soal dalam paket ini."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:col-span-1">
                                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3 pointer-events-none"> 
                                    <Dropdown 
                                        label="Mata Pelajaran"
                                        options={subjectOptions}
                                        selectedText={formData.matapelajaran.length > 0 ? formData.matapelajaran.join(", ") : "-"}
                                        disabled={true} 
                                    />
                                    <InputField label="Nama Paket Soal" value={formData.nama_paket} disabled={true} readOnly />
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <div className="w-full sm:w-1/2">
                                            <Dropdown label="Jenis Paket" options={jenisPaketOptions} selectedText={getSelectedJenisLabel(formData.jenis)} disabled={true} />
                                        </div>
                                        <div className="w-full sm:w-1/2">
                                            <Dropdown label="Status" options={statusOptions} selectedText={getSelectedStatusLabel(formData.status)} disabled={true} />
                                        </div>
                                    </div>

                                    <InputField label="Deskripsi Paket" type="textarea" rows={3} value={formData.deskripsi} disabled={true} readOnly />
                                    
                                    <div className="opacity-100"> 
                                        <ImageUploadCard label="Gambar Card Soal" required={false} previewUrl={previewImage} disabled={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end shrink-0">
                    <ButtonCancel text="Tutup Preview" onClick={onClose} className="w-auto" />
                </div>

                {detailSoalId && (
                    <div className="fixed inset-0 z-[70]"> 
                        <ModalDetailSoal 
                            soalId={detailSoalId} 
                            onClose={() => setDetailSoalId(null)} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
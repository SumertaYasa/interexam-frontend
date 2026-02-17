import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { paketSoalService } from "../../../services/paketSoalService";
import { lookupService } from "../../../services/lookupService";
import { soalService } from "../../../services/soalService"; 

import PageHeader from "../common/PageHeader";
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

export default function DetailPaketSoal() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Data
    const [formData, setFormData] = useState({
        nama_paket: "",
        matapelajaran: [], 
        id_category: "",   
        jenis: "",         
        status: "",
        deskripsi: "", 
        fotoSampul: null   
    });
    
    // State UI
    const [paketSoalList, setPaketSoalList] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [kategoriOptions, setKategoriOptions] = useState([]);

    const [detailSoalId, setDetailSoalId] = useState(null);

    const handleFileChange = () => {}; 
    const handleRemoveImage = () => {};

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
            setIsLoading(true);
            try {
                const [subjects, categories, responseDetail] = await Promise.all([
                    lookupService.getSubjects(),
                    lookupService.getCategories(),
                    paketSoalService.getPaketDetail(id)
                ]);

                setSubjectOptions(subjects.map(s => ({ label: s.nama_subject, value: s.nama_subject })));
                setKategoriOptions(categories.map(c => ({ 
                    label: c.nama_category, 
                    value: String(c.id_category) // Paksa jadi String
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
                navigate("../paket-soal");
            } finally {
                setIsLoading(false);
            }
        };

        initData();
    }, [id, navigate]);

    const handleRowClick = (item) => {
        // Set ID soal yang diklik agar modal detail muncul
        setDetailSoalId(item.id);
    };

    const columns = [
        { 
            header: "SOAL", 
            render: (row) => formatSoalDisplay(row.nama_soal) 
        },
        { header: "MATA PELAJARAN", accessor: "mata_pelajaran" },
        { header: "JENJANG", accessor: "jenjang" },
        { header: "TIPE SOAL", accessor: "tipe_soal" },
        { header: "LEVEL KESULITAN", render: (row) => getLevelBadge(row.level) }
    ];

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-noto-sans">Memuat detail...</div>;

    const getSelectedLabel = (options, value) => options.find(o => o.value == value)?.label || "-";
    const getSelectedStatusLabel = (value) => statusOptions.find(o => o.value === value)?.label || value;
    const getSelectedJenisLabel = (value) => jenisPaketOptions.find(o => o.value === value)?.label || value;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50">
            <PageHeader 
                title="Detail Paket Soal"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Paket Soal", link: "../paket-soal" },
                    { label: "Detail", link: null }
                ]}
            />

             {detailSoalId && (
                <ModalDetailSoal 
                    soalId={detailSoalId} 
                    onClose={() => setDetailSoalId(null)} 
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* KIRI: TABEL SOAL */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="text-sm text-gray-500 font-noto-sans">
                        Total Soal: <b>{paketSoalList.length}</b>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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

                {/* KANAN: FORM DETAIL */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6 border border-gray-100 space-y-3">
                        
                        <Dropdown 
                            label="Mata Pelajaran"
                            options={subjectOptions}
                            selectedText={
                                formData.matapelajaran.length > 0 
                                ? formData.matapelajaran.join(", ") 
                                : "-"
                            }
                            disabled={true} 
                        />

                        {/* <Dropdown 
                            label="Kategori"
                            options={kategoriOptions}
                            selectedText={getSelectedLabel(kategoriOptions, formData.id_category)}
                            disabled={true} 
                        /> */}

                        <InputField 
                            label="Nama Paket Soal"
                            name="nama_paket"
                            value={formData.nama_paket}
                            disabled={true} 
                            readOnly
                        />

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="w-full sm:w-1/2">
                                <Dropdown 
                                    label="Jenis Paket"
                                    options={jenisPaketOptions}
                                    selectedText={getSelectedJenisLabel(formData.jenis)}
                                    disabled={true} 
                                />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <Dropdown 
                                    label="Status"
                                    options={statusOptions}
                                    selectedText={getSelectedStatusLabel(formData.status)}
                                    disabled={true} 
                                />
                            </div>
                        </div>

                        <InputField 
                            label="Deskripsi Paket"
                            name="deskripsi"
                            type="textarea"
                            rows={3}
                            value={formData.deskripsi}
                            disabled={true} 
                            readOnly
                        />

                        <ImageUploadCard 
                            label="Gambar Card Soal"
                            required={false} 
                            previewUrl={previewImage}
                            onChange={handleFileChange} 
                            onRemove={handleRemoveImage}
                            disabled={true}
                        />

                        <div className="pt-2">
                            <ButtonCancel 
                                text="Kembali" 
                                onClick={() => navigate("../paket-soal")} 
                                type="button"
                                className="w-full justify-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
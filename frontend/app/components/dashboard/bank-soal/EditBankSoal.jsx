import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { bankSoalService } from "../../../services/bankSoalService";
import { soalService } from "../../../services/soalService";
import { paketSoalService } from "../../../services/paketSoalService";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ImageUploadBox from "../common/ImageUploadBox";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import AnswerOption from "../common/AnswerOption";

export default function EditSoalApproved() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dataSoal, setDataSoal] = useState(null);
    const [paketOptions, setPaketOptions] = useState([]);
    const [selectedPaket, setSelectedPaket] = useState("");

    const [existingPackages, setExistingPackages] = useState([]);
  
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const initData = async () => {
            try {
                // Ambil Detail Soal
                const resSoal = await bankSoalService.getSoalDetail(id);
                if (resSoal.status === 'success' || resSoal.data) {
                    const raw = resSoal.data;
                    
                    setExistingPackages(raw.list_paket || []);

                    // Logic Gambar
                    const attachSoal = raw.attachments?.find(a => a.keterangan === "Gambar Soal");
                    const attachBahas = raw.attachments?.find(a => a.keterangan === "Gambar Pembahasan");

                    // Logic Teks Pembahasan
                    const textBahas = raw.pembahasan_umum || (raw.jawaban && raw.jawaban[0]?.pembahasan) || "";

                    let topikDisplay = "-";
                    if (raw.topic) {
                        const namaTopik = raw.topic.nama_topics;
                        const namaJenjang = raw.topic.jenjang?.nama_jenjang;
                        topikDisplay = namaJenjang ? `${namaTopik} (${namaJenjang})` : namaTopik;
                    }

                    const formattedData = {
                        tipe_soal: (raw.jenis_soal === 'multiple_choice' || raw.jenis_soal === 'pilihan_ganda') 
                                   ? "Pilihan Ganda" : "Multi Jawaban",
                        
                        text_soal: raw.text_soal || "",
                        gambar_soal: soalService.getAssetUrl(raw.gambar_soal || attachSoal?.path_attachment),
                        
                        pembahasan: textBahas,
                        gambar_pembahasan: soalService.getAssetUrl(raw.gambar_pembahasan || attachBahas?.path_attachment),
                        
                        subject_label: raw.topic?.subject?.nama_subject || "-",
                        // topik_label: raw.topic?.nama_topics || "-",
                        topik_label: topikDisplay,
                        level: raw.level_kesulitan || "mudah",
                        
                        contributor_name: raw.contributor?.nama_user || "-",
                        validator_name: raw.nama_validator || "-",
                        
                        // List paket dimana soal ini berada 
                        existing_packages: [], 

                        list_jawaban: raw.jawaban?.map((jw, index) => ({
                            id: jw.id_jawaban || index,
                            text: jw.opsi_jawaban_text,
                            isCorrect: jw.status,
                            image: soalService.getAssetUrl(jw.path_gambar_jawaban),
                            preview: soalService.getAssetUrl(jw.path_gambar_jawaban),
                            oldPath: jw.path_gambar_jawaban  
                        })) || []
                    };
                    setDataSoal(formattedData);
                }

                const listPaket = await paketSoalService.getAllPaket();
                if (listPaket) {
                    const options = listPaket.map(p => ({
                        label: p.nama_paket,
                        value: p.id_paket_soal
                    }));
                    setPaketOptions(options);
                }

            } catch (error) {
                console.error("Gagal init data:", error);
                alert("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        };

        initData();
    }, [id]);

    const handleSimpan = async () => {
        if (!selectedPaket) {
            return alert("Harap pilih Paket Soal terlebih dahulu jika ingin menambahkan!");
        }

        const namaPaket = paketOptions.find(p => p.value === selectedPaket)?.label;

        if(confirm(`Simpan soal ini ke dalam paket "${namaPaket}"?`)) {
            setIsSubmitting(true);
            try {
                // await paketSoalService.addQuestionToPacket(selectedPaket, id);
                await bankSoalService.updateSoal(id, { 
                    id_paket_soal: selectedPaket 
                });
                
                alert(`Berhasil menambahkan soal ke paket: ${namaPaket}`);
                // navigate("/dashboard/bank-soal");
                window.location.reload();
            } catch (error) {
                alert("Gagal menambahkan: " + (error.message || error));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBatal = () => {
        navigate("/dashboard/bank-soal");
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-noto-sans">Memuat data...</div>;
    if (!dataSoal) return <div className="p-10 text-center text-red-500 font-noto-sans">Data tidak ditemukan.</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">
            
            <PageHeader 
                title="Detail Soal Diverifikasi"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Bank Soal", link: "../bank-soal" },
                    { label: "Detail Soal", link: null }
                ]}
            />

            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* --- KOLOM KIRI --- */}
                <div className="w-full lg:flex-1 space-y-6">
                    
                    {/* SOAL */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <div className="pointer-events-none opacity-80">
                            <Dropdown 
                                label="Tipe Soal"
                                options={[{label: dataSoal.tipe_soal, value: dataSoal.tipe_soal}]}
                                selectedText={dataSoal.tipe_soal}
                                onSelect={() => {}}
                                selectedValues={dataSoal.tipe_soal}
                            />
                        </div>

                        <div className="mt-4">
                            <InputField 
                                label="Soal"
                                type="textarea"
                                rows={3}
                                value={dataSoal.text_soal}
                                readOnly={true} 
                            />
                            {/* GAMBAR SOAL */}
                            {dataSoal.gambar_soal && (
                                <div className="pointer-events-none mt-4">
                                    <ImageUploadBox 
                                        label="Gambar Soal"
                                        previewUrl={dataSoal.gambar_soal}
                                        disabled={true} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OPSI JAWABAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 font-noto-sans">
                                Opsi Jawaban
                            </label>
                            <p className="text-xs text-gray-400">Pilih salah satu jawaban yang benar.</p>
                        </div>
                        <div className="space-y-6 pointer-events-none opacity-90">
                            {dataSoal.list_jawaban.map((opsi, index) => (
                                <AnswerOption 
                                    key={opsi.id || index}
                                    index={index}
                                    data={opsi}
                                    inputType={dataSoal.tipe_soal === "Pilihan Ganda" ? "radio" : "checkbox"}
                                    onTextChange={() => {}}
                                    onImageChange={() => {}}
                                    onRemoveImage={() => {}}
                                    onCheck={() => {}}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PEMBAHASAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <InputField 
                            label="Pembahasan"
                            type="textarea"
                            rows={3}
                            value={dataSoal.pembahasan}
                            readOnly={true}
                        />
                         {/* GAMBAR PEMBAHASAN */}
                         {dataSoal.gambar_pembahasan && (
                            <div className="pointer-events-none mt-4">
                                <ImageUploadBox 
                                    label="Gambar Pembahasan"
                                    previewUrl={dataSoal.gambar_pembahasan}
                                    disabled={true}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/*  KOLOM KANAN  */}
                <div className="w-full lg:max-w-[400px] space-y-6">
                    
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <ButtonCancel 
                            text="Batal"
                            onClick={handleBatal}
                            disabled={isSubmitting}
                            type="button" 
                        />
                        <ButtonSave 
                            text={isSubmitting ? "Menyimpan..." : "Simpan ke Paket"}
                            isLoading={isSubmitting}
                            onClick={handleSimpan}
                        />
                    </div>

                    {/* CARD INFO CONTRIBUTOR & VALIDATOR */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
                        <InputField 
                            label="Nama Contributor"
                            value={dataSoal.contributor_name}
                            readOnly={true}
                        />
                        {/* <InputField 
                            label="Nama Validator"
                            value={dataSoal.validator_name}
                            readOnly={true}
                        /> */}

                        <InputField 
                            label="Nama Validator"
                            value={dataSoal.validator_name}
                            readOnly={true}
                        />

                        {/* LIST PAKET YANG SUDAH ADA */}
                        <div className="pt-2 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 font-noto-sans mb-2">Tersedia di Paket Soal:</label>
                            {existingPackages.length > 0 ? (
                                <ul className="space-y-1">
                                    {existingPackages.map((pkg, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            {pkg}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Belum masuk ke paket manapun.</p>
                            )}
                        </div>
                    </div>

                    {/* METADATA SOAL */}
                    <div className="bg-white shadow-lg w-full rounded-2xl p-6 space-y-4 pointer-events-none opacity-80">
                        <InputField 
                            label="Mata Pelajaran"
                            value={dataSoal.subject_label}
                            readOnly={true}
                        />
                        <InputField 
                            label="Topik"
                            value={dataSoal.topik_label}
                            readOnly={true}
                        />
                        <Dropdown 
                            label="Level Kesulitan Soal"
                            options={[{label: dataSoal.level, value: dataSoal.level}]}
                            selectedText={dataSoal.level}
                            selectedValues={dataSoal.level}
                        />
                    </div>

                    {/* PILIH PAKET SOAL BARU */}
                    <div className="bg-white shadow-lg w-full rounded-2xl p-6">
                        <div className="mb-1">
                             <label className="block text-sm font-medium text-gray-700 font-noto-sans mb-1">
                                Pilih Paket Soal
                            </label>
                        </div>
                        
                        <Dropdown 
                            label="" 
                            options={paketOptions}
                            selectedText={paketOptions.find(p => p.value === selectedPaket)?.label || "Pilih paket soal yang mau di masukan"}
                            onSelect={setSelectedPaket}
                            selectedValues={selectedPaket}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Pilih paket soal yang aktif untuk menambahkan soal ini ke dalamnya.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
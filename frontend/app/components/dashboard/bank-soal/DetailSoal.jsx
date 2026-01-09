import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { bankSoalService } from "../../../services/bankSoalService";
import { soalService } from "../../../services/soalService"; 


import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ImageUploadBox from "../common/ImageUploadBox";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import AnswerOption from "../common/AnswerOption";

export default function DetailSoal() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [dataSoal, setDataSoal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [pesanContributor, setPesanContributor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await bankSoalService.getSoalDetail(id);
                
                if (response.status === 'success' || response.data) {
                    const raw = response.data;

                    // Cari Gambar di Attachments 
                    const attachSoal = raw.attachments?.find(a => a.keterangan === "Gambar Soal");
                    const attachBahas = raw.attachments?.find(a => a.keterangan === "Gambar Pembahasan");

                    // Cari Teks Pembahasan 
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
                        
                        // GAMBAR SOAL
                        gambar_soal: soalService.getAssetUrl(raw.gambar_soal || attachSoal?.path_attachment),
                        
                        // PEMBAHASAN (Text & Gambar)
                        pembahasan: textBahas,
                        gambar_pembahasan: soalService.getAssetUrl(raw.gambar_pembahasan || attachBahas?.path_attachment),
                        
                        subject_label: raw.topic?.subject?.nama_subject || "-",
                        // topik_label: raw.topic?.nama_topics || "-",
                        topik_label: topikDisplay,
                        level: raw.level_kesulitan || "mudah",
                        contributor_name: raw.contributor?.nama_user || "-",
                        
                        // LIST JAWABAN
                        list_jawaban: raw.jawaban?.map((jw, index) => ({
                            id: jw.id_jawaban || index,
                            text: jw.opsi_jawaban_text,
                            isCorrect: jw.status, 
                            // Convert path gambar jawaban menggunakan service
                            image: soalService.getAssetUrl(jw.path_gambar_jawaban),
                            preview: soalService.getAssetUrl(jw.path_gambar_jawaban),
                            oldPath: jw.path_gambar_jawaban  
                        })) || []
                    };

                    setDataSoal(formattedData);
                }
            } catch (error) {
                console.error("Gagal ambil detail:", error);
                alert("Gagal memuat detail soal.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleVerifikasi = async () => {
        if(confirm("Yakin verifikasi soal ini?")) {
            setIsSubmitting(true);
            try {
                await bankSoalService.updateSoal(id, { status: 'disetujui' });
                alert("Soal berhasil disetujui!");
                navigate("/dashboard/bank-soal");
            } catch (error) {
                alert("Gagal verifikasi: " + (error.message || "Error"));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleTolak = async () => {
        if(!pesanContributor.trim()) return alert("Harap isi pesan untuk contributor!");
        if(confirm("Yakin tolak soal ini?")) {
            setIsSubmitting(true);
            try {
                await bankSoalService.updateSoal(id, { 
                    status: 'ditolak',
                    catatan_revisi: pesanContributor
                });
                alert("Soal ditolak!");
                navigate("/dashboard/bank-soal");
            } catch (error) {
                alert("Gagal menolak: " + (error.message || "Error"));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-noto-sans">Memuat data...</div>;
    if (!dataSoal) return <div className="p-10 text-center text-red-500 font-noto-sans">Data tidak ditemukan.</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">
            <PageHeader 
                title="Detail Soal Belum Diverifikasi"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Bank Soal", link: "../bank-soal" },
                    { label: "Detail", link: null }
                ]}
            />

            <div className="flex flex-col lg:flex-row gap-10">
                {/* KOLOM KIRI */}
                <div className="w-full lg:flex-1 space-y-6">
                    
                    {/* BAGIAN SOAL */}
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
                                rows={4}
                                value={dataSoal.text_soal}
                                readOnly={true} 
                            />
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

                    {/* BAGIAN OPSI JAWABAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 font-noto-sans">Opsi Jawaban</label>
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

                    {/* BAGIAN PEMBAHASAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <InputField 
                            label="Pembahasan"
                            type="textarea"
                            rows={4}
                            value={dataSoal.pembahasan} 
                            readOnly={true}
                        />
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

                {/* KOLOM KANAN */}
                <div className="w-full lg:max-w-[400px] space-y-4">
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <ButtonCancel 
                            text={isSubmitting ? "Memproses..." : "Tolak"}
                            onClick={handleTolak}
                            disabled={isSubmitting}
                            type="button" 
                        />
                        <ButtonSave 
                            text={isSubmitting ? "Memproses..." : "Verifikasi"}
                            isLoading={isSubmitting}
                            onClick={handleVerifikasi}
                        />
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <InputField label="Nama Contributor" value={dataSoal.contributor_name} readOnly={true} />
                    </div>

                    <div className="bg-white shadow-lg w-full rounded-2xl p-6 space-y-4 pointer-events-none opacity-80">
                        <Dropdown 
                            label="Mata Pelajaran"
                            options={[{label: dataSoal.subject_label, value: ""}]}
                            selectedText={dataSoal.subject_label}
                            selectedValues=""
                        />
                        <Dropdown 
                            label="Topik"
                            options={[{label: dataSoal.topik_label, value: ""}]}
                            selectedText={dataSoal.topik_label}
                            selectedValues=""
                        />
                        <Dropdown 
                            label="Level Kesulitan"
                            options={[{label: dataSoal.level, value: ""}]}
                            selectedText={dataSoal.level}
                            selectedValues=""
                        />
                    </div>

                    <div className="bg-white shadow-lg w-full rounded-2xl p-6">
                        <InputField 
                            label="Pesan kepada Contributor (Wajib jika menolak)"
                            placeholder="Contoh: Jawaban salah"
                            type="textarea"
                            rows={3}
                            value={pesanContributor}
                            onChange={(e) => setPesanContributor(e.target.value)}
                        />
                        <div className="mt-3 w-full">
                            <ButtonSave 
                                text="Kirim Pesan"
                                onClick={() => {
                                    if(pesanContributor) alert(`Pesan tersimpan: ${pesanContributor}`);
                                    else alert("Pesan kosong");
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
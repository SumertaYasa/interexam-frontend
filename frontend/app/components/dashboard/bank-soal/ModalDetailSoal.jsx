import { useState, useEffect } from "react";
import { bankSoalService } from "../../../services/bankSoalService";
import { soalService } from "../../../services/soalService"; 

import InputField from "../common/InputField"; 
import Dropdown from "../common/Dropdown"; 
import ImageUploadBox from "../common/ImageUploadBox"; 
import AnswerOption from "../common/AnswerOption"; 
import ButtonCancel from "../common/ButtonCancel"; 

export default function ModalDetailSoal({ soalId, onClose }) {
    const [dataSoal, setDataSoal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!soalId) return;
            setIsLoading(true);
            try {
                const resSoal = await bankSoalService.getSoalDetail(soalId);
                
                if (resSoal.status === 'success' || resSoal.data) {
                    const raw = resSoal.data;
                    
                    const attachSoal = raw.attachments?.find(a => a.keterangan === "Gambar Soal");
                    const attachBahas = raw.attachments?.find(a => a.keterangan === "Gambar Pembahasan");
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
                        topik_label: topikDisplay,
                        level: raw.level_kesulitan || "mudah",
                        
                        contributor_name: raw.contributor?.nama_user || "-",
                        validator_name: raw.nama_validator || "-",
                        
                        existing_packages: [], 

                        list_jawaban: raw.jawaban?.map((jw, index) => ({
                            id: jw.id_jawaban || index,
                            text: jw.opsi_jawaban_text,
                            isCorrect: jw.status,
                            image: soalService.getAssetUrl(jw.path_gambar_jawaban),
                            preview: soalService.getAssetUrl(jw.path_gambar_jawaban),
                        })) || []
                    };
                    setDataSoal(formattedData);
                }
            } catch (error) {
                console.error("Gagal load detail soal:", error);
                alert("Gagal memuat detail soal.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [soalId]);

    if (!soalId) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col relative overflow-hidden">
                
                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 font-noto-sans">Detail Soal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center text-gray-500 font-noto-sans">Memuat data...</div>
                    ) : !dataSoal ? (
                        <div className="text-center text-red-500 font-noto-sans">Data tidak ditemukan</div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            
                            {/* KOLOM KIRI */}
                            <div className="w-full lg:flex-1 space-y-6">
                                {/* SOAL */}
                                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 pointer-events-none">
                                    <Dropdown 
                                        label="Tipe Soal"
                                        options={[{label: dataSoal.tipe_soal, value: dataSoal.tipe_soal}]}
                                        selectedText={dataSoal.tipe_soal}
                                        disabled={true}
                                    />
                                    <div className="mt-4">
                                        <InputField 
                                            label="Soal"
                                            type="textarea"
                                            rows={3}
                                            value={dataSoal.text_soal}
                                            readOnly={true}
                                        />
                                        {dataSoal.gambar_soal && (
                                            <div className="mt-4">
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
                                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 pointer-events-none">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 font-noto-sans">Opsi Jawaban</label>
                                    </div>
                                    <div className="space-y-4">
                                        {dataSoal.list_jawaban.map((opsi, index) => (
                                            <AnswerOption 
                                                key={opsi.id || index}
                                                index={index}
                                                data={opsi}
                                                inputType={dataSoal.tipe_soal === "Pilihan Ganda" ? "radio" : "checkbox"}
                                                readOnly={true} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* PEMBAHASAN */}
                                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 pointer-events-none">
                                    <InputField 
                                        label="Pembahasan"
                                        type="textarea"
                                        rows={3}
                                        value={dataSoal.pembahasan}
                                        readOnly={true}
                                    />
                                    {dataSoal.gambar_pembahasan && (
                                        <div className="mt-4">
                                            <ImageUploadBox 
                                                label="Gambar Pembahasan"
                                                previewUrl={dataSoal.gambar_pembahasan}
                                                disabled={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* KOLOM KANAN  */}
                            <div className="w-full lg:max-w-[350px] space-y-6 pointer-events-none">
                                {/* INFO */}
                                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-4">
                                    <InputField label="Nama Contributor" value={dataSoal.contributor_name} readOnly={true} />
                                    <InputField label="Nama Validator" value={dataSoal.validator_name} readOnly={true} />
                                </div>

                                {/* METADATA */}
                                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-4">
                                    <InputField label="Mata Pelajaran" value={dataSoal.subject_label} readOnly={true} />
                                    <InputField label="Topik" value={dataSoal.topik_label} readOnly={true} />
                                    <Dropdown 
                                        label="Level Kesulitan Soal"
                                        options={[{label: dataSoal.level, value: dataSoal.level}]}
                                        selectedText={dataSoal.level}
                                        disabled={true}
                                    />
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
                    <ButtonCancel text="Tutup" onClick={onClose} type="button" />
                </div>
            </div>
        </div>
    );
}
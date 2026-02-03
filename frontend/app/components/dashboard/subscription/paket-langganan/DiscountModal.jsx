import { useState, useEffect } from "react";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";
import DateTimeInput from "../../common/DateTimeInput";

import { subscriptionService } from "../../../../services/subscriptionService";

export default function DiscountModal({ isOpen, onClose, packetName, packetId, currentDiscount, onSave }) {
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        diskon: "",
        tanggalMulai: "",
        tanggalBerakhir: "",
    });

    useEffect(() => {
        if (currentDiscount) {
            const formatForInput = (dateStr) => {
                if (!dateStr) return "";
                const d = new Date(dateStr);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); 
                return d.toISOString().slice(0, 16);
            };

            setFormData({
                diskon: currentDiscount.diskon || "",
                tanggalMulai: formatForInput(currentDiscount.tanggal_mulai_diskon),
                tanggalBerakhir: formatForInput(currentDiscount.tanggal_selesai_diskon),
            });
        } else {
            // Reset jika tidak ada diskon aktif
            setFormData({ diskon: "", tanggalMulai: "", tanggalBerakhir: "" });
        }
    }, [currentDiscount, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.diskon || !formData.tanggalMulai || !formData.tanggalBerakhir) {
            alert("Harap isi semua kolom!");
            return;
        }

        setIsLoading(true);

        try {
            // Persiapan Payload ke Backend
            const payload = {
                id_paket_langganan: packetId,
                diskon: formData.diskon,
                tanggal_mulai: new Date(formData.tanggalMulai).toISOString(),
                tanggal_selesai: new Date(formData.tanggalBerakhir).toISOString()
            };

            // Panggil API
            await subscriptionService.setDiscount(payload);

            alert(`Diskon untuk ${packetName} berhasil disimpan!`);
            onSave(); 
            onClose(); 

        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan diskon. Cek koneksi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-noto-sans">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                <div className="p-6 border-b border-gray-100 bg-primary/10">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        Kelola Diskon
                    </h2>
                    <p className="text-sm text-primary mt-1">
                        Paket: <span className="font-bold">{packetName}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Input Persentase */}
                    <div className="relative">
                        <InputField 
                            label="Besar Diskon (%)"
                            name="diskon"
                            type="number"
                            value={formData.diskon}
                            onChange={handleChange}
                            placeholder="Contoh: 20"
                            required
                        />
                        <div className="absolute right-4 top-[38px] text-gray-400 font-bold">%</div>
                    </div>

                    {/* Input Tanggal (Grid 2 Kolom) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateTimeInput 
                            label="Mulai Berlaku"
                            name="tanggalMulai"
                            value={formData.tanggalMulai}
                            onChange={handleChange}
                            required
                        />
                        <DateTimeInput 
                            label="Berakhir Pada"
                            name="tanggalBerakhir"
                            value={formData.tanggalBerakhir}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Info Helper */}
                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-primary flex items-start gap-2 font-noto-sans">
                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p>Diskon akan otomatis aktif dan non-aktif sesuai rentang tanggal yang Anda atur.</p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <ButtonSave 
                            text="Simpan Perubahan" 
                            isLoading={isLoading} 
                            onClick={handleSubmit}
                        />
                        
                        <ButtonCancel 
                            text="Batal"
                            onClick={onClose} 
                            disabled={isLoading}
                        />

                    </div>
                </form>
            </div>
        </div>
    );
}
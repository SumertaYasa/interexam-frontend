import { useState, useEffect } from "react";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";
import DateTimeInput from "../../common/DateTimeInput";

export default function DiscountModal({ isOpen, onClose, packetName, currentDiscount, onSave }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        diskon: "",
        tanggalMulai: "",
        tanggalBerakhir: "",
    });

    useEffect(() => {
        if (currentDiscount) {
            setFormData({
                diskon: currentDiscount.rate || "",
                tanggalMulai: currentDiscount.start || "",
                tanggalBerakhir: currentDiscount.end || "",
            });
        }
    }, [currentDiscount, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulasi API call
        setTimeout(() => {
            onSave({ ...formData, packetName });
            setIsLoading(false);
            onClose();
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Kelola Diskon</h2>
                    <p className="text-sm text-gray-500 mt-1">Paket: <span className="font-medium text-primary">{packetName}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <InputField 
                        label="Besar Diskon (Decimal)"
                        name="diskon"
                        value={formData.diskon}
                        onChange={handleChange}
                        placeholder="Contoh: 0.2 untuk 20%"
                        required
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <DateTimeInput 
                            label="Tanggal Mulai Diskon"
                            name="tanggalMulai"
                            value={formData.tanggalMulai}
                            onChange={handleChange}
                        />
                        <DateTimeInput 
                            label="Tanggal Berakhir Diskon"
                            name="tanggalBerakhir"
                            value={formData.tanggalBerakhir}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <ButtonSave text="Simpan Diskon" isLoading={isLoading} />
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
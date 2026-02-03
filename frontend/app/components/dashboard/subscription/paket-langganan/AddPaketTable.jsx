import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import SegmentedSwitch from "../../common/SegmentedSwitch";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";
import Dropdown from "../../common/Dropdown";

import { subscriptionService } from "../../../../services/subscriptionService";

export default function AddPaketTable() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // Format opsi untuk komponen Dropdown
    const jenjangOptions = [
        { label: "Hari", value: "Hari" },
        { label: "Minggu", value: "Minggu" },
        { label: "Bulan", value: "Bulan" },
        { label: "Tahun", value: "Tahun" },
    ];

    const [formData, setFormData] = useState({
        nama_paket: "",
        harga_asli: "",
        masa_berlaku: "",
        masa_periode: "", 
        status: "Aktif",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Validasi input angka
        if ((name === "masa_berlaku" || name === "harga_asli") && value !== "" && !/^\d+$/.test(value)) return;
        
        setFormData({ ...formData, [name]: value });
    };

    // Handler untuk Dropdown kustom
    const handleSelectPeriode = (value) => {
        setFormData({ ...formData, masa_periode: value });
    };

    const handleStatusChange = (newStatus) => {
        setFormData({ ...formData, status: newStatus });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nama_paket || !formData.harga_asli || !formData.masa_berlaku || !formData.masa_periode) {
            alert("Mohon lengkapi semua data wajib (*)");
            return;
        }

        setIsLoading(true);

        try {
            await subscriptionService.createPackage(formData);
            
            alert("Paket Berhasil Disimpan!");
            navigate("/dashboard/paket-langganan"); 
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan paket. Pastikan server backend menyala.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            <PageHeader
                title="Add Paket"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Paket", link: "/dashboard/paket-langganan" },
                    { label: "Add Paket", link: null },
                ]}
            />

            <form onSubmit={handleSubmit} className="w-full h-auto">
                <div className="bg-white rounded-2xl shadow-xl lg:w-[500px] p-6 border border-gray-100">
                    
                    {/* Input Nama Paket */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Nama Paket <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nama_paket"
                            value={formData.nama_paket}
                            onChange={handleChange}
                            className="bg-gray-50 border placeholder:text-gray-400 font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Masukan nama paket"
                            required
                        />
                    </div>

                    {/* Input Harga Asli */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Harga Asli <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rp</span>
                            <input
                                type="text"
                                name="harga_asli"
                                value={formData.harga_asli}
                                onChange={handleChange}
                                className="bg-gray-50 border placeholder:text-gray-400 font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 pl-11 focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Contoh: 100000"
                                required
                            />
                        </div>
                    </div>

                    {/* Input Masa Berlaku (Angka) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Masa Berlaku <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="masa_berlaku"
                            value={formData.masa_berlaku}
                            onChange={handleChange}
                            className="bg-gray-50 border placeholder:text-gray-400 font-noto-sans border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Contoh: 1"
                            required
                        />
                    </div>

                    {/* Implementasi Komponen Dropdown Kustom */}
                    <div className="mb-4">
                        <Dropdown 
                            label="Masa Periode"
                            selectedText={formData.masa_periode || "Pilih Periode"}
                            options={jenjangOptions}
                            onSelect={handleSelectPeriode}
                            selectedValues={formData.masa_periode}
                        />
                    </div>

                    {/* Komponen Switch Status */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <SegmentedSwitch 
                            status={formData.status} 
                            onChange={handleStatusChange} 
                        />
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <ButtonSave 
                        isLoading={isLoading} 
                        onClick={handleSubmit} 
                        text="Simpan" 
                    />
                    <ButtonCancel 
                        to="../paket-langganan" 
                        disabled={isLoading}
                    />
                </div>
            </form>
        </div>
    );
}
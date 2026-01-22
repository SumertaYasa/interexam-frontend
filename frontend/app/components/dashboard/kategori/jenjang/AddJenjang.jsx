import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { jenjangService } from "../../../../services/jenjangService";

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";



export default function AddSubTopik() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nama_jenjang: "",
        keterangan: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   

    const handleSubmit = async (e) => {

        if (e && e.preventDefault) {
        e.preventDefault();
    }
    
        if (!formData.nama_jenjang) {
            alert("Nama Jenjang wajib diisi!");
            return;
        }

        setIsLoading(true);
        try {
            // Panggil Service
            await jenjangService.createJenjang(formData);
            
            alert("Jenjang berhasil ditambahkan!");
            navigate("../jenjang"); // Redirect kembali ke tabel jenjang
            
        } catch (error) {
            console.error("Error creating jenjang:", error);
            // Tampilkan pesan error dari backend (misal: duplikat nama)
            alert(error.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            {/* Header */}
            <PageHeader 
                title="Add Jenjang"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Jenjang", link: "../jenjang" },
                    { label: "Add", link: null }
                ]}
            />

            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                {/* Input Nama Jenjang */}
                <InputField 
                    label="Nama Jenjang"
                    name="nama_jenjang"
                    value={formData.nama_jenjang}
                    onChange={handleChange}
                    placeholder="Contoh: SD, SMP, SMA"
                    required
                />

                {/* Input Keterangan */}
                <InputField 
                    label="Keterangan / Deskripsi"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    placeholder="Masukan deskripsi jenjang"
                    required={false}
                    type="textarea" 
                    rows={4}
                />

                {/* Tombol Aksi */}
                <div className="mt-6 flex gap-4">
                    <ButtonSave 
                        onClick={handleSubmit} 
                        isLoading={isLoading} 
                        text="Simpan" 
                    />
                    <ButtonCancel 
                        to="../jenjang" 
                        text="Batal" 
                    />
                </div>
            </div>
        </div>
    );
}
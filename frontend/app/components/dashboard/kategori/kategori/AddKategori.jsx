import { useState } from "react";
import { useNavigate } from "react-router";

import { categoryService } from "../../../../services/categoryService";

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";

export default function AddKategori() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nama_category: "",
        keterangan: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        if (e && e.preventDefault) e.preventDefault();

        if (!formData.nama_category) {
            alert("Nama Kategori wajib diisi!");
            return;
        }

        setIsLoading(true);
        try {

            await categoryService.createCategory(formData);
            
            alert("Kategori berhasil ditambahkan!");
            navigate("../kategori"); 
            
        } catch (error) {
            console.error("Error creating category:", error);
            alert(error.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            {/* Header */}
            <PageHeader 
                title="Add Kategori"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Kategori", link: "../kategori" },
                    { label: "Add", link: null }
                ]}
            />

            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                
                {/* Form Wrapper */}
                <form onSubmit={handleSubmit}>
                    
                    {/* Input Nama Kategori */}
                    <InputField 
                        label="Nama Kategori"
                        name="nama_category" 
                        value={formData.nama_category}
                        onChange={handleChange}
                        placeholder="Contoh: Pemrograman, Desain, Matematika"
                        required
                    />

                    {/* Input Keterangan */}
                    <InputField 
                        label="Keterangan / Deskripsi"
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleChange}
                        placeholder="Masukan deskripsi kategori..."
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
                            to="../kategori" 
                            text="Batal" 
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
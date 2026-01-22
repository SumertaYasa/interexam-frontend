import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { categoryService } from "../../../../services/categoryService"; 

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";

export default function EditKategori() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState({
        nama_category: "",
        keterangan: ""
    });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const allData = await categoryService.getAllCategories();
                
                const dataArray = Array.isArray(allData) ? allData : [];
                
                const currentData = dataArray.find(item => item.id_category === parseInt(id));

                if (currentData) {
                    setFormData({
                        nama_category: currentData.nama_category,
                        keterangan: currentData.keterangan || ""
                    });
                } else {
                    alert("Data kategori tidak ditemukan!");
                    navigate("../kategori");
                }

            } catch (error) {
                console.error("Gagal ambil detail:", error);
                alert("Gagal memuat data.");
                navigate("../kategori");
            } finally {
                setIsFetching(false);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        // Mencegah reload halaman
        if (e && e.preventDefault) e.preventDefault();

        // Validasi
        if (!formData.nama_category) {
            alert("Mohon lengkapi Nama Kategori!");
            return;
        }

        setIsLoading(true);
        try {
            // Panggil service update
            await categoryService.updateCategory(id, formData);
            
            alert("Kategori berhasil diperbarui!");
            navigate("../kategori"); 
            
        } catch (error) {
            console.error("Error updating:", error);
            const errorMessage = error.response?.data?.message || error.message || "Gagal memperbarui data.";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center text-gray-500 font-noto-sans">Memuat data...</div>;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            {/* Header */}
            <PageHeader 
                title="Edit Kategori"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Kategori", link: "../kategori" },
                    { label: "Edit", link: null }
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
                        placeholder="Contoh: Sains, Matematika"
                        required
                    />

                    {/* Input Keterangan */}
                    <InputField 
                        label="Keterangan / Deskripsi"
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleChange}
                        placeholder="Masukan deskripsi kategori"
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
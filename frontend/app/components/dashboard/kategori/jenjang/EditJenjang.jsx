import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { jenjangService } from "../../../../services/jenjangService"; 

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";



export default function EditJenjang() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

   const [formData, setFormData] = useState({
        nama_jenjang: "",
        keterangan: ""
    });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const allData = await jenjangService.getAllJenjang();
                const dataArray = Array.isArray(allData) ? allData : [];
                const currentData = allData.find(item => item.id_jenjang === parseInt(id));

                if (currentData) {
                    setFormData({
                        nama_jenjang: currentData.nama_jenjang,
                        keterangan: currentData.keterangan || ""
                    });
                } else {
                    alert("Data jenjang tidak ditemukan!");
                    navigate("../jenjang");
                }

            } catch (error) {
                console.error("Gagal ambil detail:", error);
                alert("Gagal memuat data.");
                navigate("../jenjang");
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
      if (e && e.preventDefault) e.preventDefault();
        if (!formData.nama_jenjang) {
            alert("Mohon lengkapi Nama Jenjang!");
            return;
        }
        setIsLoading(true);
        try {
            await jenjangService.updateJenjang(id, formData);
            
            alert("Jenjang berhasil diperbarui!");
            navigate("../jenjang"); 
            
        } catch (error) {
            console.error("Error updating:", error);
            alert(error.message || "Gagal memperbarui data.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
    }

    
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            {/* Header */}
            <PageHeader 
                title="Edit Jenjang"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Jenjang", link: "../jenjang" },
                    { label: "Edit", link: null }
                ]}
            />

            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                {/* Input Nama Jenjang */}
                <form onSubmit={handleSubmit}>
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
                </form>
            </div>
        </div>
    );
}
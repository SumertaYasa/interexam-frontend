import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// import { topicService } from "../../../../services/topicService"; 
// import { lookupService } from "../../../../services/lookupService"; 

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";



export default function AddSubTopik() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        jenjang: "",
        keterangan: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   

    const handleSubmit = async () => {
        if (!formData.jenjang || !formData.keterangan) {
            alert("Mohon lengkapi semua data wajib!");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            console.log("Data Submitted:", formData);
            alert("Jenjang berhasil ditambahkan!");
            setIsLoading(false);
            navigate("../jenjang"); 
        }, 1000);
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
                    label="Jenjang"
                    name="jenjang"
                    value={formData.jenjang}
                    onChange={handleChange}
                    placeholder="Masukan nama jenjang"
                    required
                />

                {/* Input Keterangan */}
                <InputField 
                    label="Deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Masukan deskripsi jenjang"
                    required
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
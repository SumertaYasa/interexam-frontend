import { useState } from "react";
import { useNavigate } from "react-router";

import { subjectService } from "../../../../services/subjectService";

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";

export default function AddMataPelajaran() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        nama_subject: "", 
        keterangan: ""   
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault(); 

        if (!formData.nama_subject) {
            return alert("Nama Mata Pelajaran wajib diisi!");
        }

        setIsLoading(true);
        try {
            const result = await subjectService.createSubject(formData);
            alert(`Sukses! ${result.message}`);
            navigate("/dashboard/mata-pelajaran");
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            {/* Header */}
            <PageHeader 
                title="Add Mata Pelajaran"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Mata Pelajaran", link: "../mata-pelajaran" },
                    { label: "Add", link: null }
                ]}
            />

            {/* Form */}
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                <form onSubmit={handleSubmit}>
                    
                    <InputField 
                        label="Nama Mata Pelajaran" 
                        name="nama_subject" 
                        value={formData.nama_subject} 
                        onChange={handleChange} 
                        placeholder="Masukan nama mata pelajaran" 
                        required 
                    />

                    <InputField 
                        label="Keterangan (Opsional)" 
                        type="textarea" // Fitur baru di InputField
                        name="keterangan" 
                        value={formData.keterangan} 
                        onChange={handleChange} 
                        placeholder="Deskripsi singkat mata pelajaran ini..." 
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
                            to="../mata-pelajaran" 
                            text="Batal" 
                        />
                    </div>

                </form>
            </div>

        </div>
    );
}
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { subjectService } from "../../../../services/subjectService";

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";

export default function EditMataPelajaran() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        nama_subject: "", 
        keterangan: ""   
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const subjects = await subjectService.getAllSubjects();
                
                const subject = subjects.find(s => s.id_subject === parseInt(id));
                
                if (subject) {
                    setFormData({
                        nama_subject: subject.nama_subject,
                        keterangan: subject.keterangan || ""
                    });
                } else {
                    alert("Mata pelajaran tidak ditemukan!");
                    navigate("../mata-pelajaran");
                }
            } catch (error) {
                alert("Gagal memuat data.");
                navigate("../mata-pelajaran");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        if (e && e.preventDefault) e.preventDefault(); 

        if (!formData.nama_subject) {
            return alert("Nama Mata Pelajaran wajib diisi!");
        }

        setIsSaving(true);
        try {
            const result = await subjectService.updateSubject(id, formData);
            alert(`Sukses! ${result.message}`);
            navigate("/dashboard/mata-pelajaran"); 
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

    return(
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            {/* Header */}
            <PageHeader 
                title="Edit Mata Pelajaran"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Mata Pelajaran", link: "../mata-pelajaran" },
                    { label: "Edit", link: null }
                ]}
            />

            {/* Form */}
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                <form onSubmit={handleUpdate}>
                    
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
                        type="textarea"
                        name="keterangan" 
                        value={formData.keterangan} 
                        onChange={handleChange} 
                        placeholder="Deskripsi singkat..." 
                        rows={4}
                    />

                    {/* Tombol Aksi */}
                    <div className="mt-6 flex gap-4">
                        <ButtonSave 
                            onClick={handleUpdate} 
                            isLoading={isSaving} 
                            text="Update" 
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
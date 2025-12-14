import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { topicService } from "../../../../services/topicService";
import { lookupService } from "../../../../services/lookupService";

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import Dropdown from "../../common/Dropdown";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";

export default function AddTopik() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nama_topics: "",
        keterangan : "",
        id_subjects: "",
        id_jenjang: ""
    });

    const [subjectOptions, setSubjectOptions] = useState([]);
    const [jenjangOptions, setJenjangOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [subjects, jenjangs] = await Promise.all([
                    lookupService.getSubjects(),
                    lookupService.getJenjang()
                ]);

                setSubjectOptions(subjects.map(s => ({ 
                    label: s.nama_subject, 
                    value: s.id_subject 
                })));

                setJenjangOptions(jenjangs.map(j => ({ 
                    label: j.nama_jenjang, 
                    value: j.id_jenjang 
                })));

            } catch (error) {
                console.error("Gagal load referensi:", error);
            }
        };
        fetchLookups();
    }, []);

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSelectSubject = (val) => setFormData({ ...formData, id_subjects: val });
    const handleSelectJenjang = (val) => setFormData({ ...formData, id_jenjang: val });

    const getSelectedLabel = (options, value) => {
        const found = options.find(opt => opt.value === value);
        return found ? found.label : null;
    };

    const handleSubmit = async () => {
        if (!formData.nama_topics || !formData.id_subjects || !formData.id_jenjang) {
            return alert("Harap lengkapi Topik, Mata Pelajaran, dan Jenjang!");
        }

        setIsLoading(true);
        try {
            const payload = {
                nama_topics: formData.nama_topics,
                keterangan: formData.keterangan,
                id_subjects: parseInt(formData.id_subjects),
                id_jenjang: parseInt(formData.id_jenjang)
            };

            await topicService.createTopic(payload);
            
            alert("Topik berhasil disimpan!");
            navigate("../topik");

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
                title="Add Topik"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Topik", link: "../topik" },
                    { label: "Add", link: null }
                ]}
            />

            {/* Form Container */}
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                
                {/* 1. Dropdown Mata Pelajaran */}
                <Dropdown 
                    label="Mata Pelajaran"
                    options={subjectOptions}
                    selectedText={getSelectedLabel(subjectOptions, formData.id_subjects) || "Pilih Mata Pelajaran"}
                    onSelect={handleSelectSubject}
                    selectedValues={formData.id_subjects}
                />

                {/* 2. Input Nama Topik */}
                <InputField 
                    label="Topik"
                    name="nama_topics"
                    value={formData.nama_topics}
                    onChange={handleChange}
                    placeholder="Masukan nama topik (Contoh: Aljabar)"
                    required
                />

                {/* 3. Input Keterangan */}
                <InputField 
                    label="Keterangan"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    placeholder="Masukan keterangan topik"
                    required
                />

                {/* 4. Dropdown Jenjang */}
                <Dropdown 
                    label="Jenjang"
                    options={jenjangOptions}
                    selectedText={getSelectedLabel(jenjangOptions, formData.id_jenjang) || "Pilih Jenjang"}
                    onSelect={handleSelectJenjang}
                    selectedValues={formData.id_jenjang}
                />

                {/* Tombol Aksi */}
                <div className="mt-6 flex gap-4">
                    <ButtonSave 
                        onClick={handleSubmit} 
                        isLoading={isLoading} 
                        text="Simpan" 
                    />
                    <ButtonCancel 
                        to="../topik" 
                        text="Batal" 
                    />
                </div>

            </div>
        </div>
    );
}
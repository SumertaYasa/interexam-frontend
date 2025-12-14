import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { topicService } from "../../../../services/topicService";
import { lookupService } from "../../../../services/lookupService";

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import Dropdown from "../../common/Dropdown";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";

export default function EditTopik() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        nama_topics: "",
        keterangan: "",
        id_subjects: "",
        id_jenjang: ""
    });

    const [subjectOptions, setSubjectOptions] = useState([]);
    const [jenjangOptions, setJenjangOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [subjects, jenjangs] = await Promise.all([
                    lookupService.getSubjects(),
                    lookupService.getJenjang()
                ]);

                setSubjectOptions(subjects.map(s => ({ label: s.nama_subject, value: s.id_subject })));
                setJenjangOptions(jenjangs.map(j => ({ label: j.nama_jenjang, value: j.id_jenjang })));

                const topic = await topicService.getTopicById(id);

                setFormData({
                    nama_topics: topic.nama_topics,
                    keterangan: topic.keterangan || "",
                    id_subjects: topic.id_subjects,
                    id_jenjang: topic.id_jenjang
                });

            } catch (error) {
                alert("Gagal memuat data topik.");
                navigate("../topik");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, navigate]);

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
            return alert("Harap lengkapi data wajib (*)");
        }

        setIsSaving(true);
        try {
            const payload = {
                nama_topics: formData.nama_topics,
                keterangan: formData.keterangan,
                id_subjects: parseInt(formData.id_subjects),
                id_jenjang: parseInt(formData.id_jenjang)
            };

            await topicService.updateTopic(id, payload);
            
            alert("Topik berhasil diperbarui!");
            navigate("../topik");

        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            {/* Header */}
            <PageHeader 
                title="Edit Topik"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Topik", link: "../topik" },
                    { label: "Edit", link: null }
                ]}
            />

            {/* Form */}
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                
                {/* Dropdown Mata Pelajaran */}
                <Dropdown 
                    label="Mata Pelajaran"
                    options={subjectOptions}
                    selectedText={getSelectedLabel(subjectOptions, formData.id_subjects) || "Pilih Mata Pelajaran"}
                    onSelect={handleSelectSubject}
                    selectedValues={formData.id_subjects}
                />

                {/* Input Nama Topik */}
                <InputField 
                    label="Topik" 
                    name="nama_topics" 
                    value={formData.nama_topics} 
                    onChange={handleChange} 
                    placeholder="Masukan nama topik" 
                    required 
                />

                {/* Input Keterangan */}
                <InputField 
                    label="Keterangan" 
                    name="keterangan" 
                    value={formData.keterangan} 
                    onChange={handleChange} 
                    placeholder="Masukan keterangan" 
                />

                {/* Dropdown Jenjang */}
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
                        isLoading={isSaving} 
                        text="Update" 
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
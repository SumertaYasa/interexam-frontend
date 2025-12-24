import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// import { topicService } from "../../../../services/topicService"; 
// import { lookupService } from "../../../../services/lookupService"; 

import PageHeader from "../../common/PageHeader";
import InputField from "../../common/InputField";
import Dropdown from "../../common/Dropdown";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";

const mockSubjects = [
    { value: "1", label: "Matematika" },
    { value: "2", label: "Biologi" },
    { value: "3", label: "Fisika" },
    { value: "4", label: "Kimia" },
];

const mockTopics = [
    { id: "101", id_subject: "1", nama_topik: "Aljabar", jenjang: "SMP" },
    { id: "102", id_subject: "1", nama_topik: "Geometri", jenjang: "SD" },
    { id: "103", id_subject: "1", nama_topik: "Trigonometri", jenjang: "SMA" },
    { id: "201", id_subject: "2", nama_topik: "Sel", jenjang: "SMA" },
    { id: "202", id_subject: "2", nama_topik: "Ekosistem", jenjang: "SMP" },
    { id: "301", id_subject: "3", nama_topik: "Hukum Newton", jenjang: "SMA" },
];

export default function AddSubTopik() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        id_subjects: "",
        id_topics: "",
        sub_topik: "",
        keterangan: ""
    });

    const [subjectOptions, setSubjectOptions] = useState(mockSubjects);
    const [topicOptions, setTopicOptions] = useState([]); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectSubject = (val) => {
        setFormData({ 
            ...formData, 
            id_subjects: val, 
            id_topics: "" 
        });

        const filteredTopics = mockTopics
            .filter(t => t.id_subject === val)
            .map(t => ({
                value: t.id,
                label: `${t.nama_topik} (${t.jenjang})` 
            }));
        
        setTopicOptions(filteredTopics);
    };

    const handleSelectTopic = (val) => {
        setFormData({ ...formData, id_topics: val });
    };

    const handleSubmit = async () => {
        if (!formData.id_subjects || !formData.id_topics || !formData.sub_topik) {
            alert("Mohon lengkapi semua data wajib!");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            console.log("Data Submitted:", formData);
            alert("Sub Topik berhasil ditambahkan!");
            setIsLoading(false);
            navigate("../sub-topik"); 
        }, 1000);
    };

    const getSelectedLabel = (options, value) => {
        const selected = options.find(opt => opt.value === value);
        return selected ? selected.label : null;
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            {/* Header */}
            <PageHeader 
                title="Add Sub Topik"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Sub Topik", link: "../sub-topik" },
                    { label: "Add", link: null }
                ]}
            />

            <div className="bg-white shadow-lg rounded-2xl w-full max-w-[600px] p-6">
                
                {/* Dropdown Mata Pelajaran */}
                <Dropdown 
                    label="Mata Pelajaran"
                    required
                    options={subjectOptions}
                    selectedText={getSelectedLabel(subjectOptions, formData.id_subjects)}
                    onSelect={handleSelectSubject}
                />

                {/* Dropdown Topik */}
                <Dropdown 
                    label="Topik"
                    required
                    options={topicOptions}
                    selectedText={getSelectedLabel(topicOptions, formData.id_topics)}
                    onSelect={handleSelectTopic}
                    disabled={!formData.id_subjects} 
                />

                {/* Input Nama Sub Topik */}
                <InputField 
                    label="Sub Topik"
                    name="sub_topik"
                    value={formData.sub_topik}
                    onChange={handleChange}
                    placeholder="Masukan nama sub topik"
                    required
                />

                {/* Input Keterangan */}
                <InputField 
                    label="Deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Masukan deskripsi sub topik"
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
                        to="../sub-topik" 
                        text="Batal" 
                    />
                </div>
            </div>
        </div>
    );
}
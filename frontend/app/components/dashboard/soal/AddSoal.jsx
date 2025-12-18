import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { soalService } from "../../../services/soalService";
import { lookupService } from "../../../services/lookupService";

import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ImageUploadBox from "../common/ImageUploadBox";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import AnswerOption from "../common/AnswerOption";

export default function AddSoal() {
    const navigate = useNavigate();

    const [tipeSoal, setTipeSoal] = useState("Pilihan Ganda");
    const [soalText, setSoalText] = useState("");
    const [soalImage, setSoalImage] = useState(null);
    const [soalPreview, setSoalPreview] = useState(null);
    
    const [pembahasan, setPembahasan] = useState("");
    const [pembahasanImage, setPembahasanImage] = useState(null);
    const [pembahasanPreview, setPembahasanPreview] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // Dropdown Data
    const [subjectList, setSubjectList] = useState([]);
    const [topikList, setTopikList] = useState([]);
    
    // Level Kesulitan
    const levelList = [
        { label: "Mudah", value: "mudah" },
        { label: "Sedang", value: "sedang" },
        { label: "Sulit", value: "sulit" }
    ];

    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedTopik, setSelectedTopik] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");

    const [opsiJawaban, setOpsiJawaban] = useState([]);

    useEffect(() => {
        const initData = async () => {
            try {
                // Fetch Subjects
                const subjects = await lookupService.getSubjects();

                console.log("DATA SUBJECT ADD SOAL:", subjects); // Debugging

                setSubjectList(subjects.map(s => ({ 
                    label: s.nama_subject, 
                    value: s.id_subject   
                })));

                resetOpsiJawaban("Pilihan Ganda");
            } catch (error) {
                console.error("Error init:", error);
            }
        };
        initData();
    }, []);


    const resetOpsiJawaban = (tipe) => {
        const count = tipe === "Pilihan Ganda" ? 4 : 6;
        const newOpsi = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            text: "",
            isCorrect: false,
            image: null,
            preview: null
        }));
        setOpsiJawaban(newOpsi);
    };

    const handleTipeSoalChange = (val) => {
        setTipeSoal(val);
        resetOpsiJawaban(val);
    };

    const handleSelectSubject = async (subjectId) => {
        setSelectedSubject(subjectId);
        setSelectedTopik(""); 
        
        try {
            const topics = await lookupService.getTopicsBySubject(subjectId);
            
            setTopikList(topics.map(t => ({
                value: t.id_topics,    // DULU: t.id (Salah)
                label: `${t.nama_topics} (${t.jenjang ? t.jenjang.nama_jenjang : '-'})`
            })));
        } catch (error) {
            console.error("Gagal load topik:", error);
            setTopikList([]);
        }
    };

    // Handler Image
    const handleImageChange = (file, setImg, setPrev) => {
        if (file) {
            setImg(file);
            setPrev(URL.createObjectURL(file));
        }
    };
    const handleRemoveImage = (setImg, setPrev) => {
        setImg(null);
        setPrev(null);
    };

    // Handler Opsi
    const handleOpsiTextChange = (id, val) => {
        setOpsiJawaban(prev => prev.map(o => o.id === id ? { ...o, text: val } : o));
    };

    const handleOpsiImageChange = (id, file) => {
        if (file) {
            setOpsiJawaban(prev => prev.map(o => 
                o.id === id ? { ...o, image: file, preview: URL.createObjectURL(file) } : o
            ));
        }
    };

    const handleOpsiImageRemove = (id) => {
        setOpsiJawaban(prev => prev.map(o => 
            o.id === id ? { ...o, image: null, preview: null } : o
        ));
    };

    const handleCheckAnswer = (id) => {
        if (tipeSoal === "Pilihan Ganda") {
            setOpsiJawaban(prev => prev.map(o => ({ ...o, isCorrect: o.id === id })));
        } else {
            setOpsiJawaban(prev => prev.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o));
        }
    };

    // Submit
    const handleSubmit = async (actionType) => {
        if (!soalText || !selectedSubject || !selectedTopik || !selectedLevel) {
            return alert("Harap lengkapi Soal, Mapel, Topik, dan Level!");
        }
        
        const hasCorrect = opsiJawaban.some(o => o.isCorrect);
        if (!hasCorrect) return alert("Pilih minimal satu jawaban benar!");

        setIsLoading(true);
        try {
            const formData = new FormData();
            const backendTipe = tipeSoal === "Pilihan Ganda" ? "pilihan_ganda" : "multi_jawaban";
            formData.append("tipe_soal", backendTipe);
            formData.append("text_soal", soalText);
            formData.append("id_topik", selectedTopik);
            formData.append("level_kesulitan", selectedLevel);
            formData.append("pembahasan_umum", pembahasan);
            formData.append("action_type", actionType);

            if (soalImage) formData.append("image_soal", soalImage);
            if (pembahasanImage) formData.append("image_pembahasan", pembahasanImage);

            const opsiData = opsiJawaban.map(o => ({
                text: o.text,
                is_correct: o.isCorrect,
                has_image: !!o.image
            }));
            formData.append("opsi_jawaban", JSON.stringify(opsiData));

            opsiJawaban.forEach(o => {
                if (o.image) formData.append("image_jawaban", o.image);
            });

            await soalService.createQuestion(formData);
            alert(`Berhasil ${actionType === 'Ajukan' ? 'diajukan' : 'disimpan'}!`);
            navigate("../soal");
        } catch (error) {
            alert("Gagal menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">
            
            <PageHeader 
                title="Add Soal"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Soal", link: "../soal" },
                    { label: "Add", link: null }
                ]}
            />

            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* --- KOLOM KIRI  --- */}
                <div className="w-full lg:flex-1 space-y-6">
                    
                    {/* TIPE & SOAL */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <Dropdown 
                            label="Tipe Soal"
                            options={[{label: "Pilihan Ganda", value: "Pilihan Ganda"}, {label: "Multi Jawaban", value: "Multi Jawaban"}]}
                            selectedText={tipeSoal}
                            onSelect={handleTipeSoalChange}
                            selectedValues={tipeSoal}
                        />

                        <div className="mt-4">
                            <InputField 
                                label="Soal"
                                type="textarea"
                                rows={4}
                                value={soalText}
                                onChange={(e) => setSoalText(e.target.value)}
                                placeholder="Masukan soal"
                                required
                            />
                            <ImageUploadBox 
                                label="Gambar Soal (Opsional)"
                                previewUrl={soalPreview}
                                onChange={(e) => handleImageChange(e.target.files[0], setSoalImage, setSoalPreview)}
                                onRemove={() => handleRemoveImage(setSoalImage, setSoalPreview)}
                            />
                        </div>
                    </div>

                    {/* OPSI JAWABAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 font-noto-sans">
                                Opsi Jawaban<span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-400 font-noto-sans">Pilih jawaban yang benar.</p>
                        </div>

                        <div className="space-y-6">
                            {opsiJawaban.map((opsi, index) => (
                                <AnswerOption 
                                    key={opsi.id}
                                    index={index}
                                    data={opsi}
                                    inputType={tipeSoal === "Pilihan Ganda" ? "radio" : "checkbox"}
                                    onTextChange={handleOpsiTextChange}
                                    onImageChange={handleOpsiImageChange}
                                    onRemoveImage={handleOpsiImageRemove}
                                    onCheck={handleCheckAnswer}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PEMBAHASAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <InputField 
                            label="Pembahasan"
                            type="textarea"
                            rows={4}
                            value={pembahasan}
                            onChange={(e) => setPembahasan(e.target.value)}
                            placeholder="Tuliskan pembahasan lengkap..."
                        />
                        <ImageUploadBox 
                            label="Gambar Pembahasan (Opsional)"
                            previewUrl={pembahasanPreview}
                            onChange={(e) => handleImageChange(e.target.files[0], setPembahasanImage, setPembahasanPreview)}
                            onRemove={() => handleRemoveImage(setPembahasanImage, setPembahasanPreview)}
                        />
                    </div>
                </div>

                {/* --- KOLOM KANAN --- */}
                <div className="w-full lg:max-w-[400px] space-y-4">
                    
                    {/* BUTTONS */}
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <ButtonCancel 
                            text={isLoading ? "Menyimpan..." : "Simpan"}
                            onClick={() => handleSubmit("Draft")}
                            disabled={isLoading}
                            type="button" 
                        />
                        <ButtonSave 
                            text="Ajukan Soal"
                            loadingText="Mengajukan..."
                            isLoading={isLoading}
                            onClick={() => handleSubmit("Ajukan")}
                        />
                    </div>

                    {/* METADATA CARD */}
                    <div className="bg-white shadow-lg w-full rounded-2xl p-6 space-y-4">
                        <Dropdown 
                            label="Mata Pelajaran"
                            options={subjectList}
                            selectedText={subjectList.find(s => s.value === selectedSubject)?.label || "Pilih mata pelajaran"}
                            onSelect={handleSelectSubject}
                            selectedValues={selectedSubject}
                        />

                        <Dropdown 
                            label="Topik"
                            options={topikList}
                            selectedText={topikList.find(t => t.value === selectedTopik)?.label || "Pilih topik"}
                            onSelect={(val) => setSelectedTopik(val)}
                            selectedValues={selectedTopik}
                        />

                        <Dropdown 
                            label="Level Kesulitan Soal"
                            options={levelList}
                            selectedText={levelList.find(l => l.value === selectedLevel)?.label || "Pilih level kesulitan"}
                            onSelect={(val) => setSelectedLevel(val)}
                            selectedValues={selectedLevel}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
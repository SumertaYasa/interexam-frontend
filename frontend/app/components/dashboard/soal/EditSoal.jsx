import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { soalService } from "../../../services/soalService";
import { lookupService } from "../../../services/lookupService";

import ValidatorNote from "../common/ValidatorNote";
import PageHeader from "../common/PageHeader";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import ImageUploadBox from "../common/ImageUploadBox";
import ButtonSave from "../common/ButtonSave";
import ButtonCancel from "../common/ButtonCancel";
import AnswerOption from "../common/AnswerOption";

export default function EditSoal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [tipeSoal, setTipeSoal] = useState("Pilihan Ganda");
    const [soalText, setSoalText] = useState("");
    
    const [soalImage, setSoalImage] = useState(null);  
    const [soalPreview, setSoalPreview] = useState(null); 

    // Pembahasan
    const [pembahasan, setPembahasan] = useState("");
    const [pembahasanImage, setPembahasanImage] = useState(null); 
    const [pembahasanPreview, setPembahasanPreview] = useState(null); 

    const [catatanRevisi, setCatatanRevisi] = useState("");
    const [statusSoal, setStatusSoal] = useState("");

    const [subjectList, setSubjectList] = useState([]);
    const [topikList, setTopikList] = useState([]);
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
                // Ambil List Mata Pelajaran
                const subjects = await lookupService.getSubjects();
                const formattedSubjects = subjects.map(s => ({ label: s.name, value: s.id }));
                setSubjectList(formattedSubjects);

                // Ambil Detail Soal
                const data = await soalService.getQuestionById(id);

                console.log("FULL DATA DARI BACKEND:", data);
                console.log("ISI CATATAN REVISI:", data.catatan_revisi);

                // Populate Form Dasar
                setSoalText(data.text_soal || "");
                setPembahasan(data.pembahasan_umum || "");
                setCatatanRevisi(data.catatan_revisi || "");

                setStatusSoal(data.status || "");

                setTipeSoal(data.tipe_soal === 'multiple_choice' ? 'Pilihan Ganda' : 'Multi Jawaban');
                setSelectedLevel(data.level_kesulitan || "mudah");

                // Handle Preview Gambar
                if (data.gambar_soal) {
                    setSoalPreview(soalService.getAssetUrl(data.gambar_soal));
                }
                if (data.gambar_pembahasan) {
                    setPembahasanPreview(soalService.getAssetUrl(data.gambar_pembahasan));
                }

                if (data.id_subject) {
                    setSelectedSubject(data.id_subject);
                  
                    const topics = await lookupService.getTopicsBySubject(data.id_subject);
                    const formattedTopics = topics.map(t => ({
                        value: t.id,
                        label: `${t.name} (${t.jenjang_name || '-'})`
                    }));
                    setTopikList(formattedTopics);

                    setSelectedTopik(data.id_topik);
                }

                // Populate Opsi Jawaban
                if (data.list_jawaban && data.list_jawaban.length > 0) {
                    const mappedOpsi = data.list_jawaban.map((jw, index) => ({
                        id: index + 1,
                        text: jw.opsi_jawaban_text || "",
                        isCorrect: jw.status === true,
                        image: null, 
                        preview: soalService.getAssetUrl(jw.path_gambar_jawaban),
                        oldPath: jw.path_gambar_jawaban 
                    }));

                    // minimal 4 opsi
                    while (mappedOpsi.length < 4) mappedOpsi.push(createEmptyOpsi(mappedOpsi.length + 1));
                    setOpsiJawaban(mappedOpsi);
                } else {
                    resetOpsiJawaban("Pilihan Ganda");
                }

            } catch (error) {
                console.error("Gagal init data:", error);
                alert("Gagal memuat data. Pastikan backend berjalan dan Route ID benar.");
            } finally {
                setIsLoading(false);
            }
        };

        initData();
    }, [id]);

    const createEmptyOpsi = (id) => ({ id, text: "", isCorrect: false, image: null, preview: null, oldPath: null });

    const resetOpsiJawaban = (tipe) => {
        const count = tipe === "Pilihan Ganda" ? 4 : 6;
        setOpsiJawaban(Array.from({ length: count }, (_, i) => createEmptyOpsi(i + 1)));
    };

    
    // Ganti Tipe Soal
    const handleTipeSoalChange = (val) => {
        setTipeSoal(val);
        const targetCount = val === "Pilihan Ganda" ? 4 : 6;
        let newOpsi = opsiJawaban.map(o => ({...o, isCorrect: false}));
        
        if (newOpsi.length < targetCount) {
             while(newOpsi.length < targetCount) newOpsi.push(createEmptyOpsi(newOpsi.length+1));
        } else {
             newOpsi = newOpsi.slice(0, targetCount);
        }
        setOpsiJawaban(newOpsi);
    };

    // Ganti Subject
    const handleSelectSubject = async (subjectId) => {
        setSelectedSubject(subjectId);
        setSelectedTopik(""); 
        try {
            const topics = await lookupService.getTopicsBySubject(subjectId);
            setTopikList(topics.map(t => ({
                value: t.id,
                label: `${t.name} (${t.jenjang_name || '-'})`
            })));
        } catch (error) {
            setTopikList([]);
        }
    };

    // Handler Gambar
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
    const handleOpsiText = (id, val) => setOpsiJawaban(p => p.map(o => o.id === id ? { ...o, text: val } : o));
    const handleOpsiFile = (id, file) => {
        if(file) setOpsiJawaban(p => p.map(o => o.id === id ? { ...o, image: file, preview: URL.createObjectURL(file) } : o));
    };
    const handleOpsiRemoveFile = (id) => setOpsiJawaban(p => p.map(o => o.id === id ? { ...o, image: null, preview: null, oldPath: null } : o));
    
    const handleCheck = (id) => {
        if (tipeSoal === "Pilihan Ganda") setOpsiJawaban(p => p.map(o => ({ ...o, isCorrect: o.id === id })));
        else setOpsiJawaban(p => p.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o));
    };

    const handleSubmit = async (actionType) => {
        if (!soalText || !selectedTopik || !selectedLevel) {
            return alert("Harap lengkapi Soal, Topik, dan Level!");
        }

        setIsSubmitting(true);
        const formData = new FormData();
        const backendTipe = tipeSoal === "Pilihan Ganda" ? "pilihan_ganda" : "multi_jawaban";

        // Append Data Utama
        formData.append("tipe_soal", backendTipe);
        formData.append("text_soal", soalText);
        formData.append("id_topik", selectedTopik);
        formData.append("level_kesulitan", selectedLevel);
        formData.append("pembahasan_umum", pembahasan);
        formData.append("action_type", actionType);

        // Append Gambar
        if (soalImage) formData.append("image_soal", soalImage);
        if (pembahasanImage) formData.append("image_pembahasan", pembahasanImage);

        // Append Opsi Jawaban
        const formattedOpsi = opsiJawaban.map(opsi => ({
            text: opsi.text,
            is_correct: opsi.isCorrect,
            has_image: !!opsi.image,
            old_path: opsi.oldPath 
        }));
        formData.append("opsi_jawaban", JSON.stringify(formattedOpsi));

        opsiJawaban.forEach(o => {
            if (o.image) formData.append("image_jawaban", o.image);
        });

        try {
            await soalService.updateQuestion(id, formData);
            alert("Berhasil menyimpan perubahan!");
            navigate("../soal");
        } catch (error) {
            const msg = error.response?.data?.message || "Gagal menyimpan.";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-noto-sans">Memuat data soal...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto min-h-screen bg-gray-50">
            
            <PageHeader 
                title="Edit Soal"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Soal", link: "../soal" },
                    { label: "Edit", link: null }
                ]}
            />

            <ValidatorNote 
            note={catatanRevisi} 
            status={statusSoal} 
            />

            <div className="flex flex-col lg:flex-row gap-10">
                {/* --- KOLOM KIRI --- */}
                <div className="w-full lg:flex-1 space-y-6">
                    
                    {/* SOAL */}
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

                    {/*  OPSI JAWABAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 font-noto-sans">
                                Opsi Jawaban<span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="space-y-6">
                            {opsiJawaban.map((opsi, index) => (
                                <AnswerOption 
                                    key={opsi.id}
                                    index={index}
                                    data={opsi}
                                    inputType={tipeSoal === "Pilihan Ganda" ? "radio" : "checkbox"}
                                    onTextChange={handleOpsiText}
                                    onImageChange={handleOpsiFile}
                                    onRemoveImage={handleOpsiRemoveFile}
                                    onCheck={handleCheck}
                                />
                            ))}
                        </div>
                    </div>

                    {/*  PEMBAHASAN */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <InputField 
                            label="Pembahasan"
                            type="textarea"
                            rows={4}
                            value={pembahasan}
                            onChange={(e) => setPembahasan(e.target.value)}
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
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <ButtonCancel 
                            text={isSubmitting ? "Menyimpan..." : "Simpan Draft"}
                            onClick={() => handleSubmit("Draft")}
                            disabled={isSubmitting}
                            type="button" 
                        />
                        <ButtonSave 
                            text="Ajukan Revisi"
                            loadingText="Mengirim..."
                            isLoading={isSubmitting}
                            onClick={() => handleSubmit("Ajukan")}
                        />
                    </div>

                    {catatanRevisi && (
                        <div className="bg-red-50 border border-red-200 shadow-lg rounded-2xl p-6">
                            <h3 className="text-red-600 font-bold mb-2 font-noto-sans">Catatan Revisi</h3>
                            <p className="text-sm text-gray-700 font-noto-sans">{catatanRevisi}</p>
                        </div>
                    )}

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
                            label="Level Kesulitan"
                            options={levelList}
                            selectedText={levelList.find(l => l.value === selectedLevel)?.label || "Pilih level"}
                            onSelect={(val) => setSelectedLevel(val)}
                            selectedValues={selectedLevel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
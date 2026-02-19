import React, { useState, useEffect } from "react";
import { Bookmark as BookmarkIcon, AlertCircle } from "lucide-react";

export default function QuestionCard({
  question,
  index,
  onAnswer,
  selectedAnswer = null,
  onBookmark,
  onReport,
}) {
  // State lokal untuk handling input text/checkbox sebelum dikirim ke parent
  const [localAnswer, setLocalAnswer] = useState(selectedAnswer);

  // Sinkronisasi state lokal jika props selectedAnswer berubah (misal saat navigasi soal)
  useEffect(() => {
    setLocalAnswer(selectedAnswer);
  }, [selectedAnswer]);

  // --- LOGIC DEBOUNCE KHUSUS SHORT ANSWER ---
  useEffect(() => {
    // Hanya jalankan debounce jika jenis soal adalah short_answer dan nilai berbeda dari props
    if (
      question.jenis_soal === "short_answer" &&
      localAnswer !== selectedAnswer
    ) {
      const timeoutId = setTimeout(() => {
        onAnswer(index, localAnswer);
      }, 500); // 0.5 detik

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAnswer, question.jenis_soal, index]);

  // Handler: Checkbox (Multiple Answer) - Langsung update parent karena interaksi klik jarang
  const handleCheckboxChange = (optionValue) => {
    let currentArray = Array.isArray(localAnswer) ? [...localAnswer] : [];

    if (currentArray.includes(optionValue)) {
      currentArray = currentArray.filter((val) => val !== optionValue);
    } else {
      currentArray.push(optionValue);
    }

    setLocalAnswer(currentArray);
    onAnswer(index, currentArray);
  };

  // Handler: Radio (Multiple Choice) - Langsung update parent
  const handleRadioChange = (optionValue) => {
    setLocalAnswer(optionValue);
    onAnswer(index, optionValue);
  };

  // Handler: Textarea (Short Answer) - HANYA UPDATE STATE LOKAL
  const handleTextChange = (e) => {
    setLocalAnswer(e.target.value);
    // onAnswer dipanggil oleh useEffect debounce di atas
  };

  // Helper Format Jenis Soal
  const formatJenisSoal = (jenis) => {
    return jenis ? jenis.replace(/_/g, " ").toUpperCase() : "";
  };

  return (
    <div className="border rounded-md p-6 bg-white shadow-sm font-sans antialiased">
      {/* --- HEADER SOAL --- */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex flex-col gap-2 w-full">
          <span className="w-fit text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">
            {formatJenisSoal(question.jenis_soal)}
          </span>
          <div className="text-lg font-bold text-slate-800 tracking-tight leading-relaxed">
            <span className="font-black tracking-tighter mr-2">
              {index + 1}.
            </span>
            <div
              className="inline"
              dangerouslySetInnerHTML={{ __html: question.text_soal }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onReport(index)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
          >
            <AlertCircle size={20} />
          </button>
          <button
            onClick={() => onBookmark(question.id)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-yellow-500 transition-colors"
          >
            <BookmarkIcon size={20} />
          </button>
        </div>
      </div>

      {/* --- BODY JAWABAN --- */}
      <div className="flex flex-col gap-3">
        {/* RADIO BUTTON */}
        {(question.jenis_soal === "multiple_choice" ||
          question.jenis_soal === "true_false") &&
          question.options.map((opt, i) => {
            const optionValue = opt.text;
            const isSelected = localAnswer === optionValue;
            return (
              <label
                key={opt.id || i}
                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 group ${isSelected ? "bg-primary-50 border-primary-500 ring-1 ring-primary-500 shadow-sm" : "hover:bg-slate-50 border-slate-200 hover:border-slate-300"}`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    checked={isSelected}
                    onChange={() => handleRadioChange(optionValue)}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <span
                    className={`text-sm font-medium tracking-tight leading-relaxed ${isSelected ? "text-primary-900" : "text-slate-700"}`}
                  >
                    {opt.text}
                  </span>
                  {opt.image && (
                    <img
                      src={opt.image}
                      alt="Opsi"
                      className="max-w-[200px] rounded-md border border-slate-200 mt-1"
                    />
                  )}
                </div>
              </label>
            );
          })}

        {/* CHECKBOX */}
        {question.jenis_soal === "multiple_answer" &&
          question.options.map((opt, i) => {
            const optionValue = opt.text;
            const isChecked =
              Array.isArray(localAnswer) && localAnswer.includes(optionValue);
            return (
              <label
                key={opt.id || i}
                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${isChecked ? "bg-primary-50 border-primary-500 ring-1 ring-primary-500 shadow-sm" : "hover:bg-slate-50 border-slate-200 hover:border-slate-300"}`}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(optionValue)}
                    className="accent-primary w-4 h-4 rounded cursor-pointer"
                  />
                </div>
                <span
                  className={`text-sm font-medium tracking-tight leading-relaxed w-full ${isChecked ? "text-primary-900" : "text-slate-700"}`}
                >
                  {opt.text}
                </span>
              </label>
            );
          })}

        {/* TEXTAREA (SHORT ANSWER) */}
        {question.jenis_soal === "short_answer" && (
          <div className="mt-1 relative">
            <textarea
              rows={4}
              placeholder="Ketik jawaban Anda di sini..."
              value={localAnswer || ""}
              onChange={handleTextChange}
              className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-sm text-slate-800 placeholder-slate-400 transition-all resize-none shadow-sm"
            />
            {/* Indikator Simpan */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded text-[10px] text-slate-400 pointer-events-none">
              {localAnswer !== selectedAnswer ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Mengetik...
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Tersimpan
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

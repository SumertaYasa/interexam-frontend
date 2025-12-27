import React, { useState, useEffect } from "react";
import { Bookmark, Bookmark as BookmarkIcon, AlertCircle } from "lucide-react";

export default function QuestionCard({
  question,
  index,
  onAnswer,
  selectedAnswer = null,
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [reported, setReported] = useState(false);
  const [selected, setSelected] = useState(selectedAnswer ?? null);

  // Keep internal selected state in sync with persisted/parent state
  useEffect(() => {
    setSelected(selectedAnswer ?? null);
  }, [selectedAnswer]);

  const handleBookmark = (e) => {
    e.preventDefault();
    setBookmarked((s) => !s);
    // TODO: persist bookmark to backend
  };

  const handleReport = (e) => {
    e.preventDefault();
    setReported(true);
    // TODO: open modal or send report payload
    alert("Laporan terkirim (mock). Kami akan review soal ini.");
  };

  const handleSelect = (opt) => {
    setSelected(opt);
    onAnswer && onAnswer(index, opt);
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="font-semibold">
          {index + 1}. {question.text}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReport}
            title="Laporkan soal"
            className="p-2 rounded-full hover:bg-slate-50"
          >
            <AlertCircle size={18} />
          </button>
          <button
            onClick={handleBookmark}
            title={bookmarked ? "Unbookmark" : "Bookmark"}
            className="p-2 rounded-full hover:bg-slate-50"
          >
            <BookmarkIcon
              size={18}
              className={bookmarked ? "text-primary" : "text-gray-400"}
            />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {question.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center gap-3 p-2 rounded ${selected === opt ? "bg-slate-50" : ""}`}
          >
            <input
              type="radio"
              name={`q-${index}`}
              checked={selected === opt}
              onChange={() => handleSelect(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

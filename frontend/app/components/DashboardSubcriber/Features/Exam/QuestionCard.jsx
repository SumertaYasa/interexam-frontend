import React, { useState, useEffect } from "react";
import { Bookmark as BookmarkIcon, AlertCircle } from "lucide-react";

export default function QuestionCard({
  question,
  index,
  onAnswer,
  selectedAnswer = null,
  onBookmark,
}) {
  const [selected, setSelected] = useState(selectedAnswer ?? null);

  useEffect(() => {
    setSelected(selectedAnswer ?? null);
  }, [selectedAnswer]);

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="font-semibold text-lg">
          {index + 1}. {question.text}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100">
            <AlertCircle size={18} className="text-gray-400" />
          </button>
          <button
            onClick={() => onBookmark(question.id)} // Kirim id_question
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <BookmarkIcon size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {question.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selected === opt ? "bg-primary-50 border-primary-200" : "hover:bg-slate-50"}`}
          >
            <input
              type="radio"
              name={`q-${index}`}
              checked={selected === opt}
              onChange={() => {
                setSelected(opt);
                onAnswer(index, opt);
              }}
              className="accent-primary"
            />
            <span className="text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

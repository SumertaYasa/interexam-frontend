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
  const [selected, setSelected] = useState(selectedAnswer ?? null);

  useEffect(() => {
    setSelected(selectedAnswer ?? null);
  }, [selectedAnswer]);

  return (
    <div className="border rounded-md p-6 bg-white shadow-sm font-sans antialiased">
      <div className="flex justify-between items-start gap-4">
        <div className="text-lg font-bold text-slate-800 tracking-tight leading-relaxed">
          <span className="font-black tracking-tighter mr-1">{index + 1}.</span>{" "}
          {question.text}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onReport(index)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <AlertCircle size={18} className="text-slate-400" />
          </button>
          <button
            onClick={() => onBookmark(question.id)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <BookmarkIcon size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
              selected === opt
                ? "bg-primary-50 border-primary-200"
                : "hover:bg-slate-50 border-slate-200"
            }`}
          >
            <input
              type="radio"
              name={`q-${index}`}
              checked={selected === opt}
              onChange={() => {
                setSelected(opt);
                onAnswer(index, opt);
              }}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700 tracking-tight leading-none">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

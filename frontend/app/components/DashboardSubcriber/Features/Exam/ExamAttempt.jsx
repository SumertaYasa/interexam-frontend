import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, Link } from "react-router";
import QuestionCard from "./QuestionCard";
import { humanizeSlug } from "../../../../utils/slugify";

// Simple mock questions per exam (in real app this should come from loader/backend)
const MOCK_QUESTIONS = [
  {
    id: "q1",
    text: "She _______ to the market when it started to rain.",
    options: ["go", "goes", "went", "was going"],
  },
  {
    id: "q2",
    text: "Choose the correct sentence:",
    options: [
      "He don't like coffee.",
      "He doesn't likes coffee.",
      "He doesn't like coffee.",
      "He not like coffee.",
    ],
  },
  {
    id: "q3",
    text: "If I _______ enough money, I would buy a new phone.",
    options: ["have", "had", "will have", "would have"],
  },
];

export async function loader({ params }) {
  // in production: fetch exam and questions by label param
  const label = params.label;
  // return minimal exam info for now
  return { exam: { label }, questions: MOCK_QUESTIONS };
}

export default function ExamAttempt() {
  const { exam, questions } = useLoaderData();
  const [answers, setAnswers] = useState({});

  // Countdown / pre-start UI
  const START_SECONDS = 5;
  const countdownKey = `exam-countdown-${exam.label}`;
  const startedKey = `exam-started-${exam.label}`;
  const answersKey = `exam-answers-${exam.label}`;

  const [countdown, setCountdown] = useState(START_SECONDS);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  // On mount: restore answers and countdown state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(answersKey);
      if (raw) {
        setAnswers(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }

    // If exam was already started, skip countdown
    const wasStarted = localStorage.getItem(startedKey);
    if (wasStarted === "1") {
      setStarted(true);
      return;
    }

    // Restore existing countdown if exists
    const existing = localStorage.getItem(countdownKey);
    if (existing) {
      const endTs = Number(existing);
      const remaining = Math.ceil((endTs - Date.now()) / 1000);
      if (remaining > 0) {
        // resume remaining seconds
        setCountdown(remaining);
        setStarted(false);
        return;
      }
      // expired: instead of marking as started, start a fresh countdown so UX is consistent
      try {
        localStorage.removeItem(countdownKey);
      } catch (e) {}
      const newEndTs = Date.now() + START_SECONDS * 1000;
      localStorage.setItem(countdownKey, String(newEndTs));
      setCountdown(START_SECONDS);
      setStarted(false);
      return;
    }

    // No existing countdown, create one so refreshes continue it
    const endTs = Date.now() + START_SECONDS * 1000;
    localStorage.setItem(countdownKey, String(endTs));
    setCountdown(START_SECONDS);
    setStarted(false);
  }, [exam.label]);

  useEffect(() => {
    // start countdown when component mounts or when restarted
    if (!started) {
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current);
            try {
              localStorage.removeItem(countdownKey);
              localStorage.setItem(startedKey, "1");
            } catch (e) {}
            setStarted(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, countdownKey, startedKey]);

  // lock page scroll while overlay is active to prevent background scrolling
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (!started) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [started]);

  const handleSkipCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      localStorage.removeItem(countdownKey);
      localStorage.setItem(startedKey, "1");
    } catch (e) {}
    setStarted(true);
  };

  const handleCancelStart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      localStorage.removeItem(countdownKey);
      localStorage.removeItem(answersKey);
      localStorage.removeItem(startedKey);
    } catch (e) {}
    // go back to previous page
    window.history.back();
  };

  const handleAnswer = (idx, value) => {
    setAnswers((s) => ({ ...s, [idx]: value }));
  };

  // persist draft answers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(answersKey, JSON.stringify(answers));
    } catch (e) {}
  }, [answers, answersKey]);

  const handleSubmit = () => {
    // TODO: submit answers to backend
    try {
      localStorage.removeItem(answersKey);
      localStorage.removeItem(startedKey);
    } catch (e) {}
    alert("Jawaban disubmit (mock). Hasil akan muncul di halaman hasil.");
  };

  const label = humanizeSlug(exam.label, { capitalize: true });

  return (
    <div className="w-full">
      <div className="mx-7-5 my-5">
        <Link to={-1} className="p-2 rounded-full border w-full ">
          Kembali
        </Link>
      </div>
      <div className="px-7-5 py-5 flex flex-col gap-5">
        <div className="w-full border py-4 px-5 rounded-md">
          <h1 className="text-heading-3 font-semibold w-full text-wrap">
            {label}
          </h1>
        </div>

        <div className="relative">
          <div className="flex flex-col gap-4">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                index={i}
                question={q}
                onAnswer={handleAnswer}
                selectedAnswer={answers[i]}
              />
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="rounded px-4 py-2 border"
              onClick={() => alert("Simpan sebagai draft (mock)")}
            >
              Simpan
            </button>
            <button
              className="rounded px-4 py-2 bg-primary text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          {/* Overlay countdown while not started */}
          {!started && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            >
              <div className="p-6  rounded-md bg-white max-w-[600px] mx-4 text-center">
                <p className="text-sm text-gray-700 mb-3">
                  Ujian akan dimulai dalam
                </p>
                <div className="text-5xl font-bold">{countdown}</div>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    className="rounded px-4 py-2  bg-primary text-white"
                    onClick={handleSkipCountdown}
                  >
                    Mulai sekarang
                  </button>
                  <button
                    className="rounded px-4 py-2  bg-gray-600 text-gray-300"
                    onClick={handleCancelStart}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

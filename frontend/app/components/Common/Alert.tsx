import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface AlertProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "success",
  duration = 3000, // Disarankan 3000ms agar user sempat membaca
  onClose,
}) => {
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    // Menghitung interval update (100 kali update selama durasi)
    const intervalTime = duration / 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1; // Kurangi 1% setiap langkah
      });
    }, intervalTime);

    const autoClose = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(autoClose);
    };
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-5 right-5 z-[1000] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden w-[400px]">
        <div className="p-5 flex items-start gap-4">
          <div className="mt-0.5">
            {isSuccess ? (
              <CheckCircle2
                className="text-black"
                size={24}
                strokeWidth={1.5}
              />
            ) : (
              <XCircle className="text-black" size={24} strokeWidth={1.5} />
            )}
          </div>

          <p className="flex-1 text-gray-800 text-sm font-medium leading-relaxed">
            {message}
          </p>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROGRESS BAR: Kita hilangkan 'transition-all' agar pergerakan murni dikontrol State */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-100">
          <div
            className={`h-full ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
            style={{
              width: `${progress}%`,
              transition: `width ${duration / 100}ms linear`, // Sinkronisasi transisi dengan interval
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Alert;

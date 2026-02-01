import { useRef } from "react";

export default function ProfilePhotoUploader({ currentImage, onFileChange, onDelete }) {
    const fileInputRef = useRef(null);
    const defaultImage = "/profile-default.png"; // Pastikan file ini ada di folder public

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="relative">
            {/* 1. Container Foto Utama */}
            <div className="relative group mx-auto">
                {/* Lingkaran Foto - Diberi Shadow halus dan Border Putih Tebal */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-[1px] border-white shadow-xl bg-white mx-auto relative z-10">
                    <img 
                        src={currentImage || defaultImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover aspect-square"
                        onError={(e) => e.target.src = defaultImage}
                    />
                </div>

                {/* 2. Tombol Edit (Icon Kamera) - Posisi di kanan bawah lingkaran */}
                <button 
                    type="button"
                    onClick={handleEditClick}
                    className="absolute bottom-1 right-1 bg-white text-gray-700 p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all z-10"
                    title="Ubah Foto"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>

                {/* 3. Tombol Hapus (Icon Sampah) - Posisi di kiri bawah (Hanya muncul jika ada foto) */}
                {currentImage && (
                    <button 
                        type="button"
                        onClick={onDelete}
                        className="absolute bottom-1 left-1 bg-white text-red-500 p-2 rounded-full shadow-md border border-gray-200 hover:bg-red-50 transition-all z-10"
                        title="Hapus Foto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Input File Hidden */}
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onFileChange}
            />
        </div>
    );
}
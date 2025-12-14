import { useState, useRef, useEffect } from "react";

export default function ImageUploadBox({ label, previewUrl, onChange, onRemove, placeholder = "Upload Gambar" }) {
    const fileInputRef = useRef(null);

    const handleTrigger = () => fileInputRef.current.click();

    return (
        <div className="mt-2">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1 font-noto-sans">{label}</label>}
            
            <div className="flex items-center gap-3">
                {/* Area Preview / Upload Button */}
                <div 
                    className={`relative w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden
                        ${previewUrl ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}
                    onClick={!previewUrl ? handleTrigger : undefined}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-2">
                            <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className="text-[10px] text-gray-500 block mt-1">{placeholder}</span>
                        </div>
                    )}
                </div>

                {/* Tombol Aksi (Ganti / Hapus) */}
                {previewUrl && (
                    <div className="flex flex-col gap-2">
                        <button 
                            type="button" 
                            onClick={handleTrigger} 
                            className="text-xs text-primary font-medium hover:underline"
                        >
                            Ganti
                        </button>
                        <button 
                            type="button" 
                            onClick={onRemove} 
                            className="text-xs text-red-500 font-medium hover:underline"
                        >
                            Hapus
                        </button>
                    </div>
                )}
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onChange} 
                accept="image/*" 
                className="hidden" 
            />
        </div>
    );
}
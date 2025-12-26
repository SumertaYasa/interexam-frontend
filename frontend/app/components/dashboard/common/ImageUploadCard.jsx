import React from "react";

const ImageUploadCard = ({ label, previewUrl, onChange, onRemove, required }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                    {/* Area Preview */}
                    <div className="shrink-0 w-16 h-16 bg-white rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    
                    {/* Area Tombol & Info */}
                    <div className="flex-1 overflow-hidden">
                        <div className="flex gap-2 items-center">
                            <label className="cursor-pointer inline-block bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-primary/90 transition-all font-noto-sans">
                                Pilih file
                                <input type="file" className="hidden" accept="image/*" onChange={onChange} />
                            </label>
                            {previewUrl && (
                                <button type="button" onClick={onRemove} className="text-red-500 text-sm font-medium hover:underline font-noto-sans">
                                    Hapus
                                </button>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 truncate">Format JPG, PNG. Maks 2MB.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadCard;
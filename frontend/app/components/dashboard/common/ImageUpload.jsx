export default function ImageUpload({ label, previewImage, onChange, fileName }) {
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                {label} <span className="text-gray-400 text-xs">(Opsional)</span>
            </label>
            
            {/* Preview Image Circle */}
            <div className="mb-2 flex justify-center">
                <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border border-gray-300" 
                />
            </div>

            <div className="flex items-center w-full">
                <label className="flex items-center w-full p-2 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors">
                    <span className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl transition-colors">
                        Pilih file
                    </span>
                    <span className="ml-4 text-sm text-gray-900 font-noto-sans truncate flex-1">
                        {fileName || "Default (Kosong)"}
                    </span>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={onChange} 
                    />
                </label>
            </div>
        </div>
    );
}
export default function AnswerOption({ 
    index, 
    data, 
    inputType = "radio", // 'radio' (PG) atau 'checkbox' (Multi)
    onTextChange, 
    onImageChange, 
    onRemoveImage, 
    onCheck 
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
                
                {/* Tombol Check/Radio */}
                <button
                    type="button"
                    onClick={() => onCheck(data.id)}
                    className={`mt-3 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors 
                        ${data.isCorrect ? 'border-primary bg-primary text-white' : 'border-gray-400 bg-white hover:border-primary'}
                        ${inputType !== 'radio' ? 'rounded-md' : ''} 
                    `}
                >
                    {data.isCorrect && (
                        inputType === 'radio' 
                        ? <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    )}
                </button>

                {/* Input Text & Image */}
                <div className="flex-1">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={data.text}
                            onChange={(e) => onTextChange(data.id, e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl block w-full p-3.5 pr-12 font-noto-sans placeholder-gray-400 ring-primary"
                            placeholder={`Masukan jawaban ${String.fromCharCode(65 + index)}`} // A, B, C...
                        />
                        
                        {/* Icon Upload Button di dalam Input */}
                        <button
                            type="button"
                            onClick={() => document.getElementById(`file-opsi-${data.id}`).click()}
                            className={`absolute inset-y-0 right-0 flex items-center pr-4 transition-colors ${data.preview ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <svg className="w-6 h-6 hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </button>
                        
                        <input 
                            type="file" 
                            id={`file-opsi-${data.id}`} 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => onImageChange(data.id, e.target.files[0])}
                        />
                    </div>

                    {/* Preview Gambar Jawaban */}
                    {data.preview && (
                        <div className="mt-2 relative w-fit group">
                            <img src={data.preview} alt="Opsi" className="h-24 w-auto rounded-lg border border-gray-200 object-cover" />
                            <button 
                                type="button"
                                onClick={() => onRemoveImage(data.id)}
                                className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-200 rounded-full p-0.5 shadow-sm hover:bg-red-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
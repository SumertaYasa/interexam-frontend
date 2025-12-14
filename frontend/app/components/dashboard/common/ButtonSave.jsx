export default function ButtonSave({ isLoading, onClick, text = "Simpan", loadingText = "Menyimpan..." }) {
    return (
        <button 
            type="button" 
            onClick={onClick} 
            disabled={isLoading} 
            className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-medium rounded-2xl shadow-sm text-white bg-primary hover:bg-primary-hover disabled:opacity-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? loadingText : text}
        </button>
    );
}
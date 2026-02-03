import { Link } from "react-router";

export default function ButtonCancel({ to, onClick, text = "Batal", disabled = false, type = "button", className = "" }) {
    const baseStyle = ` w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-primary text-sm font-medium rounded-2xl shadow-sm text-primary hover:bg-gray-50 disabled:opacity-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}${className}`;

    // Jika ada propsjadikan Link
    if (to) {
        return (
            <Link to={to} className={baseStyle}>
                {text}
            </Link>
        );
    }

    // Button biasa
    return (
        <button 
        // type={type} 
        type="button"
        onClick={onClick} 
        disabled={disabled} 
        className={baseStyle}
        >
        {text}
        </button>
    );
}
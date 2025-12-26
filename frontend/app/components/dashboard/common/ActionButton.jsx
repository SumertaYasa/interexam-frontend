import React from "react";

const ActionButton = ({ onClick, text, variant = "primary", disabled = false }) => {
    const baseClass = "rounded-xl px-5 py-2.5 text-sm font-medium transition font-noto-sans shadow-sm border whitespace-nowrap w-full sm:w-auto text-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "text-white bg-primary hover:bg-primary/90 border-transparent",
        outline: "text-primary bg-white border-primary hover:bg-gray-50 uppercase tracking-wide",
    };

    return (
        <button type="button" onClick={onClick} disabled={disabled} className={`${baseClass} ${variants[variant]}`}>
            {text}
        </button>
    );
};

export default ActionButton;
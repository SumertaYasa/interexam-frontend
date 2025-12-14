import { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, selectedText, options, onSelect, multiSelect = false, selectedValues = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative mt-4 first:mt-0" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                {label} <span className="text-red-500">*</span>
            </label>
            
            <button 
                type="button" 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full font-noto-sans inline-flex justify-between items-center ring-gray-300 text-gray-900  bg-white focus:ring-1 ring-1 focus:ring-primary shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none"
            >
                <span className="block truncate text-left flex-1 ">{selectedText}</span>
                <svg className={`w-5 h-5 ms-1.5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7"/>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-2 w-full ring-1 ring-primary rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto ">
                    <ul className="p-2 text-sm text-body font-medium">
                        {options.length > 0 ? options.map((opt) => (
                            <li key={opt.value}>
                                {multiSelect ? (
                                    // Tampilan Multi Select (Checkbox)
                                    <div 
                                        className="flex items-center w-full p-2 hover:bg-gray-100 rounded cursor-pointer " 
                                        onClick={() => onSelect(opt.value)}
                                    >
                                        <input 
                                            type="checkbox" 
                                            readOnly 
                                            checked={selectedValues.includes(opt.value)} 
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary pointer-events-none "
                                        />
                                        <span className="ms-2 text-gray-900">{opt.label}</span>
                                    </div>
                                ) : (
                                    // Tampilan Single Select (Biasa)
                                    <button 
                                        type="button" 
                                        onClick={() => { onSelect(opt.value); setIsOpen(false); }} 
                                        className={`w-full text-left p-2 hover:bg-gray-100 rounded-lg ${selectedValues === opt.value ? 'bg-gray-100 font-bold' : ''}`}
                                    >
                                        {opt.label}
                                    </button>
                                )}
                            </li>
                        )) : (
                            <li className="p-2 text-gray-500 text-center ">Tidak ada data</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
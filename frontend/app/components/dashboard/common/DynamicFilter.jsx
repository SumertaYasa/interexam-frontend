import { useState, useRef, useEffect } from "react";

/**
 * DynamicFilter Component
 * @param {Array} filters - Array konfigurasi filter.
 * Struktur object dalam array filters:
 * {
 * key: "status",        // Nama state yang akan diubah di parent
 * label: "Filter Status", // Judul Section
 * type: "radio" | "date" | "select", // Tipe input
 * options: [{label: "Aktif", value: "active"}] // Pilihan (jika type radio/select)
 * defaultValue: "all"   // Nilai default (opsional)
 * }
 * @param {Function} onFilterChange - Callback function (key, value) => void
 * @param {Object} currentValues - Object state dari parent untuk sinkronisasi UI
 */
export default function DynamicFilter({ filters = [], onFilterChange, currentValues = {} }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Menutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handler perubahan input
    const handleChange = (key, value) => {
        onFilterChange(key, value);
        // setIsOpen(false); // Uncomment jika ingin dropdown langsung tertutup setelah memilih
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* BUTTON TRIGGER */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center justify-center p-2 rounded-xl border transition-all duration-200 
                    ${isOpen ? 'bg-white border-primary text-primary' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                title="Filter Data"
            >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* DROPDOWN CONTENT */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div className="p-4 space-y-5 max-h-[80vh] overflow-y-auto">
                        
                        {filters.map((section, idx) => (
                            <div key={section.key || idx}>
                                {/* Judul Section */}
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-noto-sans">
                                    {section.label}
                                </h3>

                                {/* RADIO BUTTON (Pilihan Tunggal) */}
                                {section.type === 'radio' && (
                                    <div className="space-y-1">
                                        {section.options.map((opt) => (
                                            <label key={opt.value} className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                                                <input 
                                                    type="radio" 
                                                    name={section.key} // Grouping by key
                                                    className="text-primary focus:ring-primary h-4 w-4 border-gray-300"
                                                    checked={currentValues[section.key] === opt.value}
                                                    onChange={() => handleChange(section.key, opt.value)}
                                                />
                                                <span className="text-sm text-gray-700 font-noto-sans">{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* DATE PICKER */}
                                {section.type === 'date' && (
                                    <div>
                                        <input 
                                            type="date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                            value={currentValues[section.key] || ''}
                                            onChange={(e) => handleChange(section.key, e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* SELECT DROPDOWN  */}
                                {section.type === 'select' && (
                                    <select
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                        value={currentValues[section.key] || ''}
                                        onChange={(e) => handleChange(section.key, e.target.value)}
                                    >
                                        <option value="">Semua</option>
                                        {section.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                )}

                                {/* Garis Pemisah antar section */}
                                {idx < filters.length - 1 && <div className="border-t border-gray-100 mt-2"></div>}
                            </div>
                        ))}

                        {/* TOMBOL RESET (Opsional) */}
                        <div className="pt-2 border-t border-gray-100">
                            <button 
                                onClick={() => {
                                    filters.forEach(f => onFilterChange(f.key, f.defaultValue || ""));
                                }}
                                className="w-full text-center text-xs text-red-500 hover:text-red-700 font-medium py-1"
                            >
                                Reset Filter
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
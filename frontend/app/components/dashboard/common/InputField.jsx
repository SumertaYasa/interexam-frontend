export default function InputField({ label, type = "text", name, value, onChange, placeholder, required = false, rows }) {
    return (
        <div className="mt-4 first:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows || 3}
                    className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5 focus:ring-primary focus:border-primary"
                    placeholder={placeholder}
                    required={required}
                />
            ) : (
                <input 
                    type={type} 
                    name={name} 
                    value={value} 
                    onChange={onChange} 
                    className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5 focus:ring-primary focus:border-primary" 
                    placeholder={placeholder} 
                    required={required} 
                />
            )}
        </div>
    );
}
export default function InputField({ label, type = "text", name, value, onChange, placeholder, required = false, rows, ...rest }) {
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
                    className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5 focus:ring-primary focus:border-primary
                    read-only:bg-white read-only:text-gray-900 read-only:cursor-not-allowed read-only:focus:border-gray-300 read-only:focus:ring-0"
                    placeholder={placeholder}
                    required={required}
                    {...rest}
                />
            ) : (
                <input 
                    type={type} 
                    name={name} 
                    value={value} 
                    onChange={onChange} 
                    className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5 focus:ring-primary focus:border-primary 
                    read-only:bg-white read-only:text-gray-900 read-only:cursor-not-allowed read-only:focus:border-gray-300 read-only:focus:ring-0" 
                    placeholder={placeholder} 
                    required={required}
                    {...rest} 
                />
            )}
        </div>
    );
}
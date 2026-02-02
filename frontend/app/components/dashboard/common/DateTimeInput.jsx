export default function DateTimeInput({ label, name, value, onChange, required = true }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-noto-sans">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
                type="datetime-local" 
                name={name}
                value={value}
                onChange={onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl block w-full p-2.5 focus:ring-primary focus:border-primary outline-none transition-all"
                required={required}
            />
        </div>
    );
}
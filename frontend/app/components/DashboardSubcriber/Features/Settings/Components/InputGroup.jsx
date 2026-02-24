function InputGroup({
  label,
  placeholder,
  type = "text",
  value = "",
  onChange,
}) {
  return (
    <div className="w-full">
      <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2.5 ml-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputGroup;

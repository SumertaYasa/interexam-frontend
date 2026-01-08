import { Search } from "lucide-react";

function SearchBar({ placeholder, onChange, value }) {
  return (
    <div className="flex items-center justify-between w-full max-w-[900px] h-full px-3.5 py-1 rounded-full border border-[#8A8A8A]">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none focus:ring-0 border-none text-sm font-medium text-slate-700 tracking-tight leading-none placeholder:text-slate-400 placeholder:font-medium placeholder:tracking-tight mr-2"
      />
      <Search className="text-[#8A8A8A]" size={20} />
    </div>
  );
}

export default SearchBar;

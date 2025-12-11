import { Search } from "lucide-react";

function SearchBar({ placeholder, onChange, value }) {
  return (
    <div className="flex items-center justify-between w-full max-w-[900px] h-full px-3.5 py-1 rounded-full border border-[#8A8A8A]">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none focus:ring-0 border-none text-gray-700 placeholder:text-gray-400 mr-2"
      />
      <Search className="text-[#8A8A8A]" />
    </div>
  );
}

export default SearchBar;

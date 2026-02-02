// InfoCard.jsx
export default function InfoCard({ title, items }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4 font-noto-sans">{title}</h3>
      <div className="border-t border-gray-300 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-400 mb-1 font-noto-sans">{item.label}</p>
            {item.type === "badge" ? (
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${item.className}`}>
                {item.value}
              </span>
            ) : (
              <p className="font-noto-sans text-gray-800 break-all">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
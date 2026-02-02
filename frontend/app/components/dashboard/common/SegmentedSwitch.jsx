// components/common/SegmentedSwitch.jsx
export default function SegmentedSwitch({ status, onChange }) {
    const isAktif = status === 'Aktif';

    return (
        <div className="flex w-60 h-10 rounded-full bg-blue-50/50 overflow-hidden shadow-sm border border-blue-100">
            {/* Tombol Aktif */}
            <button
                type="button"
                onClick={() => onChange('Aktif')}
                className={`flex-1 text-sm font-noto-sans transition-all duration-200 ease-in-out ${
                    isAktif
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-blue-100'
                } rounded-full m-0.5`}
            >
                Aktif
            </button>

            {/* Tombol Non Aktif */}
            <button
                type="button"
                onClick={() => onChange('Non Aktif')}
                className={`flex-1 text-sm font-noto-sans transition-all duration-200 ease-in-out ${
                    !isAktif
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-blue-100'
                } rounded-full m-0.5`}
            >
                Non Aktif
            </button>
        </div>
    );
}
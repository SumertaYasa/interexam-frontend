import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const notifRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "Sistem",
      message: "Selamat datang di InterExam! Akun Anda berhasil dibuat.",
      time: "Baru saja",
      read: false,
    },
    {
      id: 2,
      title: "Info",
      message: "Jangan lupa lengkapi profil Anda untuk akses penuh.",
      time: "10 menit lalu",
      read: false,
    },
    {
      id: 3,
      title: "Maintenance",
      message: "Server akan maintenance nanti malam pukul 00:00 WIB.",
      time: "1 jam lalu",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  return (
    <div className="relative" ref={notifRef}>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 mr-1 rounded-full transition-colors duration-200 
          ${isOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
          border border-gray-300 hover:border-gray-200`}
      >
        <span className="sr-only">Lihat Notifikasi</span>
        
        {/* Icon Lonceng */}
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Badge Merah (Dot Only jika banyak, Angka jika sedikit) */}
        {unreadCount > 0 && (
          <div className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full">
            {unreadCount > 9 ? '' : unreadCount}
          </div>
        )}
      </button>

      {/* --- DROPDOWN CONTENT --- */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-3 list-none bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-500
          /* RESPONSIVE CLASSES */
          right-[-3.5rem]  /* Mobile: Geser kiri dikit agar center di layar kecil */
          w-[85vw]         /* Mobile: Lebar 85% dari viewport */
          max-w-[360px]    /* Mobile: Batas maksimal lebar agar tidak terlalu besar */
          sm:right-0       /* Tablet/Desktop: Rata kanan dengan icon */
          sm:w-80          /* Tablet/Desktop: Lebar fix 320px */
          origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header Notifikasi */}
          <div className="py-3 px-4 flex justify-between items-center bg-gray-50/80 rounded-t-xl border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900 font-noto-sans">Notifikasi</span>
            <button className="text-xs text-primary font-noto-sans font-medium hover:text-blue-700 hover:underline transition">
              Tandai semua dibaca
            </button>
          </div>

          {/* List Item */}
          <ul className="py-1 max-h-[60vh] overflow-y-auto scrollbar-hide">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li key={notif.id}>
                  <Link
                    to="#"
                    className={`block py-3 px-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-50 last:border-0 ${
                      !notif.read ? "bg-blue-50/40 border-l-4 border-l-primary pl-3" : "pl-4"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                        {notif.time}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${!notif.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notif.message}
                    </p>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-8 px-4 text-center flex flex-col items-center justify-center text-gray-400">
                <svg className="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="text-sm font-noto-sans">Tidak ada notifikasi baru</span>
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="py-2 bg-gray-50 rounded-b-xl text-center border-t border-gray-100">
            <Link
              to="/dashboard/notifications"
              className="block w-full py-1 font-noto-sans text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
            >
              Lihat Semua Notifikasi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
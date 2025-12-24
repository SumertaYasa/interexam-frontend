import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

export default function Sidebar({ isWide,isMobileOpen, userRole = "admin" }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === location.pathname) return true;
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    
    return false;
  };

  const baseClass = "flex items-center p-2 rounded-2xl group transition duration-75";
 
  const activeClass = "bg-primary/10 text-gray-900 h-12  gap-2";
  const inactiveClass = "text-gray-500  h-12 gap-2 hover:text-gray-900 hover:bg-primary/10";

  const textClass = isWide ? "opacity-100 ml-3" : "opacity-0 hidden w-0";

  const [isKategoriOpen, setIsKategoriOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isKontenOpen, setIsKontenOpen] = useState(false);

  useEffect(() => {
    if (!isWide) {
      setIsKategoriOpen(false);
      setIsSubscriptionOpen(false);
      setIsKontenOpen(false);
    }
  }, [isWide]);

  return (
    <aside
      id="default-sidebar"
      className={`fixed top-0 left-0 z-40 h-screen pt-10 transition-all duration-200 ease-in-out
        bg-white border-r border-gray-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0
        ${isWide ? "w-64" : "w-20"}`}
      aria-label="Sidebar">
        
      <div 
        className="h-full px-3 py-8 overflow-y-auto bg-white overflow-x-hidden scrollbar-hide"
        style={{
           scrollbarWidth: 'none', 
           msOverflowStyle: 'none', 
        }}>
      <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
          `}
      </style>
        <ul className="space-y-2 font-medium">
          
          <h1 className={`font-se text-gray-500 uppercase text-xs font-xl px-2 mt-2 mb-2 font-noto-sans`}>
            Menu
          </h1>

          {/*Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className={`${baseClass} ${isActive("/dashboard") ? activeClass : inactiveClass}`}>
              <svg
                className="w-6 h-6 transition duration-75 min-w-[24px] ml-4"
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"/>
              </svg>
              <span className={`ms-3 sidebar-menu-text font-noto-sans text-base  whitespace-nowrap transition-all duration-300 ease-in-out${textClass}`}>Dashboard</span>
            </Link>
          </li>

          {/*Bank Soal */}
          {["admin", "validator"].includes(userRole) && (
          <li>
            <Link
              to="/dashboard/bank-soal"
              className={`${baseClass} ${isActive("/dashboard/bank-soal") ? activeClass : inactiveClass}`}>
              <svg className="w-6 h-6 transition duration-75 min-w-[24px] ml-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 5C21 6.65685 16.9706 8 12 8C7.02944 8 3 6.65685 3 5M21 5C21 3.34315 16.9706 2 12 2C7.02944 2 3 3.34315 3 5M21 5V19C21 20.66 17 22 12 22C7 22 3 20.66 3 19V5M21 12C21 13.66 17 15 12 15C7 15 3 13.66 3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`ms-3 sidebar-menu-text font-noto-sans text-base whitespace-nowrap transition-all duration-300 ease-in-out ${textClass}`}>Bank Soal</span>
            </Link>
          </li>
          )}

          {/* Tempat Soal Khusus Contributor */}
          {userRole === "contributor" && (
          <li>
            <Link
              to="/dashboard/soal"
              className={`${baseClass} ${isActive("/dashboard/soal") ? activeClass : inactiveClass}`}>
              <svg className="w-6 h-6 transition duration-75 min-w-[24px] ml-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20H5.2C4.07989 20 3.51984 20 3.09202 19.782C2.71569 19.5903 2.40973 19.2843 2.21799 18.908C2 18.4802 2 17.9201 2 16.8V7.2C2 6.07989 2 5.51984 2.21799 5.09202C2.40973 4.71569 2.71569 4.40973 3.09202 4.21799C3.51984 4 4.07989 4 5.2 4H5.6C7.84021 4 8.96031 4 9.81596 4.43597C10.5686 4.81947 11.1805 5.43139 11.564 6.18404C12 7.03968 12 8.15979 12 10.4M12 20V10.4M12 20H18.8C19.9201 20 20.4802 20 20.908 19.782C21.2843 19.5903 21.5903 19.2843 21.782 18.908C22 18.4802 22 17.9201 22 16.8V7.2C22 6.07989 22 5.51984 21.782 5.09202C21.5903 4.71569 21.2843 4.40973 20.908 4.21799C20.4802 4 19.9201 4 18.8 4H18.4C16.1598 4 15.0397 4 14.184 4.43597C13.4314 4.81947 12.8195 5.43139 12.436 6.18404C12 7.03968 12 8.15979 12 10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`ms-3 sidebar-menu-text font-noto-sans text-base whitespace-nowrap transition-all duration-300 ease-in-out ${textClass}`}>Tempat Soal</span>
            </Link>
          </li>
          )}


          {/*Kategori */}
          {["admin", "validator", "contributor"].includes(userRole) && (
          <li>
             <button type="button" 
              onClick={() => setIsKategoriOpen(!isKategoriOpen)}
              className={`flex items-center w-full justify-between px-6 py-1.5 gap-2 text-body rounded-2xl hover:bg-primary-10 hover:text-fg-brand group font-noto-sans text-base
                ${(isActive("/dashboard/mata-pelajaran") || isActive("/dashboard/topik") || isActive("/dashboard/tipe-soal")) ? activeClass : inactiveClass}`}>

                  <svg className="w-6 h-6 transition duration-75 min-w-[24px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12L9 12M21 6L9 6M21 18L9 18M5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12ZM5 6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5C4.55228 5 5 5.44772 5 6ZM5 18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17C4.55228 17 5 17.4477 5 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  <span className={`flex-1 ms-3 font-noto-sans text-base text-left rtl:text-right whitespace-nowrap transition-all duration-300 ease-in-out ${textClass}`}>Kategori</span>
                  <svg className={`w-5 h-5 transition-transform duration-200" ${isKategoriOpen ? "rotate-180" : ""} ${isWide ? "opacity-100" : "opacity-0 hidden"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
            </button>
            
            {/* Logic Dropdown menggunakan State React */}
            <ul className={`${(isKategoriOpen && isWide) ? "block" : "hidden"} py-2 space-y-2`}>

              {userRole === "admin" && (
              <li>
                <Link 
                  to="mata-pelajaran" 
                  className={`flex whitespace-nowrap transition-all duration-300 ease-in-out  h-12 items-center w-full p-2  pl-11 rounded-2xl group font-noto-sans text-base
                    ${isActive("/dashboard/mata-pelajaran") 
                      ? "text-gray-900 bg-primary/10 font-medium" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-primary/10"}`}>
                  <svg 
                    className={`w-5 h-5 mr-2 ml-4 transition-transform flex-shrink-0  ${isActive("#") ? "text-gray-900" : "text-gray-400"}`}
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                  </svg>
                  Mata Pelajaran
                </Link>
              </li>
              )}

              <li>
                <Link 
                  to="topik" 
                  className={`flex  h-12 items-center w-full p-2 transition duration-75 pl-11 rounded-2xl group font-noto-sans text-base
                  ${isActive("/dashboard/topik") 
                      ? "text-gray-900 bg-primary/10 font-medium" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-primary/10"}`}>
                  <svg 
                    className={`w-5 h-5 mr-2 ml-4 transition-transform flex-shrink-0 ${isActive("topik") ? "text-gray-900" : "text-gray-400"}`}
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                  </svg>
                  Topik
                </Link>
              </li>

              <li>
                <Link 
                  to="sub-topik" 
                  className={`flex  h-12 items-center w-full p-2 transition duration-75 pl-11 rounded-2xl group font-noto-sans text-base
                  ${isActive("/dashboard/sub-topik") 
                      ? "text-gray-900 bg-primary/10 font-medium" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-primary/10"}`}>
                  <svg 
                    className={`w-5 h-5 mr-2 ml-4 transition-transform flex-shrink-0 ${isActive("sub-topik") ? "text-gray-900" : "text-gray-400"}`}
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                  </svg>
                  Sub Topik
                </Link>
              </li>
            </ul>
          </li>
          )}

          
           {/*Paket Soal */}
          {["admin", "validator"].includes(userRole) && (
          <li>
            <Link
              to="/dashboard/paket-soal"
              className={`${baseClass} ${isActive("/dashboard/paket-soal") ? activeClass : inactiveClass}`}>
              <svg className="w-7 h-7 transition duration-75 min-w-[24px] ml-3 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.1429 11v9m0-9c-2.50543-.7107-3.19099-1.39543-6.13657-1.34968-.48057.00746-.86348.38718-.86348.84968v7.2884c0 .4824.41455.8682.91584.8617 2.77491-.0362 3.45995.6561 6.08421 1.3499m0-9c2.5053-.7107 3.1067-1.39542 6.0523-1.34968.4806.00746.9477.38718.9477.84968v7.2884c0 .4824-.4988.8682-1 .8617-2.775-.0362-3.3758.6561-6 1.3499m2-14c0 1.10457-.8955 2-2 2-1.1046 0-2-.89543-2-2s.8954-2 2-2c1.1045 0 2 .89543 2 2Z"/>
              </svg>
              <span className={`ms-3 sidebar-menu-text font-noto-sans text-base whitespace-nowrap transition-all duration-300 ease-in-out ${textClass}`}>Paket Soal</span>
            </Link>
          </li>
          )}


           {/*User */}
          {userRole === "admin" && (
          <li>
            <Link
              to="/dashboard/users"
              className={`${baseClass} ${isActive("/dashboard/users") ? activeClass : inactiveClass}`}>
              <svg className="w-6 h-6 transition duration-75 min-w-[24px] ml-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`ms-3 sidebar-menu-text font-noto-sans text-base ${textClass}`}>User</span>
            </Link>
          </li>
          )}


          {/*Subscription */}
          {userRole === "admin" && (
          <li>
             <button type="button" 
              onClick={() => setIsSubscriptionOpen(!isSubscriptionOpen)}
              className={`flex items-center w-full justify-between px-6 py-1.5 gap-2 text-body rounded-2xl hover:bg-primary-10 hover:text-fg-brand group font-noto-sans text-base
                ${(isActive("/dashboard/paket-subscription") || isActive("/dashboard/daftar-subscription")) ? activeClass : inactiveClass}`} >

                  <svg className="w-6 h-6 transition duration-75 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8H8.01M2 5.2L2 9.67451C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59135 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L5.2 2C4.0799 2 3.51984 2 3.09202 2.21799C2.7157 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  <span className={`flex-1 ms-3 font-noto-sans text-base text-left rtl:text-right whitespace-nowrap ${textClass}`}>Subscription</span>
                  <svg className={`w-5 h-5 transition-transform duration-200" ${isSubscriptionOpen ? "rotate-180" : ""} ${isWide ? "opacity-100" : "opacity-0 hidden"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
            </button>
            <ul className={`${(isSubscriptionOpen && isWide) ? "block" : "hidden"} py-2 space-y-2`}>

              <li>
                <Link 
                  to="paket-langganan" 
                  className={`flex  h-12 items-center w-full p-2 whitespace-nowrap transition-all duration-300 ease-in-out pl-11 rounded-2xl group font-noto-sans text-base
                    ${isActive("/dashboard/paket-langganan") 
                      ? "text-gray-900 bg-primary/10 font-medium" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-primary/10"}`}>
                  <svg 
                    className={`w-5 h-5 mr-2 ml-4 transition-transform flex-shrink-0 ${isActive("paket-langganan") ? "text-gray-900" : "text-gray-400"}`}
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                  </svg>
                  Paket Langganan
                </Link>
              </li>

              <li>
                <Link 
                  to="/dashboard/daftar-subscriber" 
                  className={`flex  h-12 items-center w-full p-2 whitespace-nowrap transition-all duration-300 ease-in-out pl-11 rounded-2xl group font-noto-sans text-base
                    ${isActive("/dashboard/daftar-subscriber") 
                      ? "text-gray-900 bg-primary/10 font-medium" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-primary/10"}`}>
                  <svg 
                    className={`w-5 h-5 mr-2 ml-4 transition-transform flex-shrink-0 ${isActive("/dashboard/daftar-subscriber") ? "text-gray-900" : "text-gray-400"}`}
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                  </svg>
                  Daftar Subscriber
                </Link>
              </li>
            </ul>
          </li>
          )}


          {/*Konten */}
          {userRole === "admin" && (
          <li>
             <button type="button" 
              onClick={() => setIsKontenOpen(!isKontenOpen)}
              className={`flex items-center w-full justify-between px-6 py-1.5 gap-2 text-body rounded-2xl hover:bg-primary-10 hover:text-fg-brand group font-noto-sans text-base
               ${(isActive("/dashboard/promo") || isActive("/dashboard/artikel")) ? activeClass : inactiveClass}`}>
                  <svg className="w-6 h-6 transition duration-75 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.5V14.6C22 16.8402 22 17.9603 21.564 18.816C21.1805 19.5686 20.5686 20.1805 19.816 20.564C18.9603 21 17.8402 21 15.6 21H8.4C6.15979 21 5.03969 21 4.18404 20.564C3.43139 20.1805 2.81947 19.5686 2.43597 18.816C2 17.9603 2 16.8402 2 14.6V9.4C2 7.15979 2 6.03969 2.43597 5.18404C2.81947 4.43139 3.43139 3.81947 4.18404 3.43597C5.03969 3 6.15979 3 8.4 3H12.5M19 8V2M16 5H22M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={`flex-1 ms-3 font-noto-sans text-base text-left rtl:text-right whitespace-nowrap ${textClass}`}>Konten</span>
                  <svg className={`w-5 h-5 transition-transform duration-200" ${isKontenOpen ? "rotate-180" : ""} ${isWide ? "opacity-100" : "opacity-0 hidden"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
            </button>
            <ul className={`${(isKontenOpen && isWide) ? "block" : "hidden"} py-2 space-y-2`}>

              <li>
                <Link 
                  to="#" 
                  className={`flex  h-12 items-center w-full p-2 whitespace-nowrap transition-all duration-300 ease-in-out pl-11 rounded-2xl group font-noto-sans text-base
                    ${isActive("/dashboard/promo") 
                      ? "text-gray-900 bg-primary/10 font-medium" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-primary/10"}`}>
                  <svg 
                    className={`w-5 h-5 mr-2 ml-4 transition-transform ${isActive("#") ? "text-gray-900" : "text-gray-400"}`}
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                  </svg>
                  Konten Promo
                </Link>
              </li>

              <li>
                <Link 
                  to="artikel" 
                  className={`flex  h-12 items-center w-full p-2 whitespace-nowrap transition-all duration-300 ease-in-out pl-11 rounded-2xl group font-noto-sans text-base
                   ${isActive("/dashboard/artikel") 
                      ? "text-gray-900 bg-primary/10 font-medium" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-primary/10"}`}>
                  <svg 
                    className={`w-5 h-5 mr-2 ml-4 transition-transform ${isActive("#") ? "text-gray-900" : "text-gray-400"}`}
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                  </svg>
                  Konten Artikel
                </Link>
              </li>
            </ul>
          </li>
          )}

          {/*Laporan */}
          {userRole === "admin" && (
          <li>
            <Link
              to="#"
              className={`${baseClass} ${isActive("#") ? activeClass : inactiveClass}`}>
              <svg className="w-6 h-6 transition duration-75 min-w-[24px] ml-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.2 14C17.477 14 17.6155 14 17.7278 14.0615C17.8204 14.1122 17.9065 14.2075 17.9478 14.3047C17.9978 14.4225 17.9852 14.5479 17.96 14.7987C17.8296 16.0987 17.3822 17.3514 16.6518 18.4445C15.7727 19.7601 14.5233 20.7855 13.0615 21.391C11.5997 21.9965 9.99113 22.155 8.43928 21.8463C6.88743 21.5376 5.46197 20.7757 4.34315 19.6568C3.22433 18.538 2.4624 17.1126 2.15372 15.5607C1.84504 14.0089 2.00347 12.4003 2.60897 10.9385C3.21447 9.47671 4.23985 8.22728 5.55544 7.34823C6.64856 6.61783 7.90125 6.17039 9.20131 6.03995C9.45207 6.01479 9.57745 6.00221 9.69528 6.0522C9.79249 6.09344 9.88776 6.17964 9.9385 6.27224C10 6.38449 10 6.52299 10 6.79999V13.2C10 13.48 10 13.62 10.0545 13.727C10.1024 13.8211 10.1789 13.8976 10.273 13.9455C10.38 14 10.52 14 10.8 14H17.2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2.79999C14 2.52298 14 2.38448 14.0615 2.27223C14.1122 2.17963 14.2075 2.09344 14.3047 2.0522C14.4225 2.0022 14.5479 2.01478 14.7987 2.03993C16.6271 2.22333 18.346 3.03229 19.6569 4.34313C20.9677 5.65398 21.7767 7.37289 21.9601 9.20129C21.9852 9.45206 21.9978 9.57744 21.9478 9.69527C21.9066 9.79248 21.8204 9.88774 21.7278 9.93848C21.6155 9.99998 21.477 9.99999 21.2 9.99999L14.8 9.99999C14.52 9.99999 14.38 9.99999 14.273 9.94549C14.1789 9.89755 14.1024 9.82106 14.0545 9.72698C14 9.62003 14 9.48001 14 9.19999V2.79999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`ms-3 sidebar-menu-text font-noto-sans text-base ${textClass}`}>Laporan</span>
            </Link>
          </li>
          )}

        </ul>
      </div>
    </aside>
  );
}
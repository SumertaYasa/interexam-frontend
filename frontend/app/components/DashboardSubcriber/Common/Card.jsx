import React from "react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-[#8A8A8A] rounded-[10px] font-sans antialiased tracking-tight ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;

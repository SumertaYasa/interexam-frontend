function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-[#8A8A8A] rounded-[10px] ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;

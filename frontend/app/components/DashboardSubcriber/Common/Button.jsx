function Button({ children, onClick, background, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-[10px] text-white ${background} font-noto-sans`}
    >
      {children}
    </button>
  );
}

export default Button;

function Button({ children, onClick, background, rounded, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-[${rounded}]  ${background} font-noto-sans`}
    >
      {children}
    </button>
  );
}

export default Button;

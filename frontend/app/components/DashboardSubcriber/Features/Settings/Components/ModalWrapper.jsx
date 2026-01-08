function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/20 animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;
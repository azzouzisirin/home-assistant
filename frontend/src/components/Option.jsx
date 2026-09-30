export default function Option({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`w-full cursor-pointer rounded-xl border px-4 py-3 text-start font-semibold transition ${
        selected
          ? 'border-brand bg-brand/10 text-brand-dark'
          : 'border-line bg-white text-ink hover:bg-sand'
      }`}
    >
      {children}
    </button>
  )
}
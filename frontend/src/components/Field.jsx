export default function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-muted">
      {label}
      <input
        className="rounded-xl border border-line bg-white px-3.5 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/25"
        {...props}
      />
    </label>
  )
}
const styles = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  outline: 'border border-line bg-white text-ink hover:bg-sand',
  danger: 'border border-danger bg-white text-danger hover:bg-danger-bg'
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`cursor-pointer rounded-xl px-3 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
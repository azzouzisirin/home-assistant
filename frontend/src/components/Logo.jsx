export default function Logo({ size = 44, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="16" fill="#4a7c59" />
      <path
        d="M13 33 L32 17 L51 33"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 30 V46 a3 3 0 0 0 3 3 H42 a3 3 0 0 0 3-3 V30"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="27" y="34" width="10" height="6" rx="2" fill="#fff" />
      <rect x="24" y="39" width="16" height="6" rx="2.5" fill="#fff" />
      <path
        d="M49 8 L51 14 L57 16 L51 18 L49 24 L47 18 L41 16 L47 14 Z"
        fill="#f3c98b"
      />
    </svg>
  )
}
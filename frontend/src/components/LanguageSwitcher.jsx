import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n/index.js'

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
}

function GlobeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg {...iconProps} width={14} height={14}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg {...iconProps}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  )
}

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current =
    LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) || LANGUAGES[0]

  useEffect(() => {
    if (!open) return

    function onPointerDown(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function choose(code) {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('common.language')}
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:bg-sand focus:outline-none focus:ring-4 focus:ring-brand/25"
      >
        <GlobeIcon />
        {current.label}
        <ChevronIcon />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute end-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-card py-1 shadow-lg shadow-black/10"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === current.code
            return (
              <li key={l.code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => choose(l.code)}
                  className={`flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm hover:bg-sand ${
                    active ? 'font-bold text-brand' : 'text-ink'
                  }`}
                >
                  {l.label}
                  {active && <CheckIcon />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
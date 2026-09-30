import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from '../components/Logo.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import Button from '../components/Button.jsx'

const svgProps = {
  width: 44,
  height: 44,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
}

const SLIDES = [
  {
    key: 's1',
    icon: (
      <svg {...svgProps}>
        <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    )
  },
  {
    key: 's2',
    icon: (
      <svg {...svgProps}>
        <path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M3 7l12-3v3" />
        <circle cx="16.5" cy="13.5" r="1" />
      </svg>
    )
  },
  {
    key: 's3',
    icon: (
      <svg {...svgProps}>
        <path d="m4 7 2 2 3-3" />
        <path d="m4 15 2 2 3-3" />
        <path d="M13 8h7" />
        <path d="M13 16h7" />
      </svg>
    )
  }
]

export default function OnboardingPage({ onDone }) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]
  const isLast = index === SLIDES.length - 1

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Logo size={46} title={t('app.name')} />
          <LanguageSwitcher />
        </div>

        <div className="rounded-2xl border border-line bg-card p-8 text-center shadow-lg shadow-black/5">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand/10 text-brand">
            {slide.icon}
          </div>

          <h1 className="text-2xl font-bold">{t(`onboarding.${slide.key}_title`)}</h1>
          <p className="mt-2 min-h-16 text-muted">{t(`onboarding.${slide.key}_text`)}</p>

          <div className="my-6 flex justify-center gap-2" aria-hidden="true">
            {SLIDES.map((s, i) => (
              <span
                key={s.key}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-brand' : 'w-2 bg-line'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => (isLast ? onDone() : setIndex(index + 1))}>
              {isLast ? t('onboarding.start') : t('onboarding.next')}
            </Button>
            {!isLast && (
              <Button variant="outline" onClick={onDone}>
                {t('onboarding.skip')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
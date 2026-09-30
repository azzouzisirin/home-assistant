import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import Logo from './Logo.jsx'

export default function AuthLayout({ title, subtitle, children }) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Logo size={46} title={t('app.name')} />
          <LanguageSwitcher />
        </div>
        <div className="rounded-2xl border border-line bg-card p-6 shadow-lg shadow-black/5">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mb-5 text-muted">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
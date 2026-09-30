import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import Button from '../components/Button.jsx'

export default function HomePage() {
  const { t } = useTranslation()
  const { user, logout, deleteAccount } = useAuth()
  const isGuest = Boolean(user.is_guest)

  async function handleDelete() {
    if (!window.confirm(t('home.delete_confirm'))) return
    try {
      await deleteAccount()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <AuthLayout
      title={t('home.title')}
      subtitle={isGuest ? t('home.guest_subtitle') : t('home.signed_in', { email: user.email })}
    >
      {isGuest && (
        <p className="mb-4 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand-dark">
          {t('home.guest_note')}
        </p>
      )}
      <div className="flex flex-col gap-3">
        <Button variant="outline" onClick={logout}>{t('home.logout')}</Button>
        <Button variant="danger" onClick={handleDelete}>{t('home.delete')}</Button>
      </div>
    </AuthLayout>
  )
}
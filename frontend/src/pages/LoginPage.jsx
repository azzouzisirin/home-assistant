import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import Button from '../components/Button.jsx'

export default function LoginPage() {
  const { t } = useTranslation()
  const { login, guestLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
    } catch (err) {
      if (err.data?.needsVerification) {
        navigate('/verify-email', { state: { email } })
        return
      }
      setError(err.message)
    }
    setBusy(false)
  }

  async function handleGuest() {
    setError('')
    setBusy(true)
    try {
      await guestLogin()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title={t('login.title')} subtitle={t('login.subtitle')}>
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <Field
          label={t('common.email')}
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label={t('common.password')}
          type="password"
          autoComplete="current-password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <Button disabled={busy}>{busy ? t('common.wait') : t('login.submit')}</Button>
      </form>

      <div className="my-4 flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        {t('common.or')}
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="outline" className="w-full" disabled={busy} onClick={handleGuest}>
        {t('login.guest')}
      </Button>

      <p className="mt-4 text-center text-sm text-muted">
        <Link className="font-semibold text-brand hover:underline" to="/forgot-password">
          {t('login.forgot')}
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        {t('login.no_account')}{' '}
        <Link className="font-semibold text-brand hover:underline" to="/register">
          {t('login.create_one')}
        </Link>
      </p>
    </AuthLayout>
  )
}
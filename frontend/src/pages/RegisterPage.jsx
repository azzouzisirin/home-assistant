import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import Button from '../components/Button.jsx'

export default function RegisterPage() {
  const { t } = useTranslation()
  const { register } = useAuth()
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
      await register(email, password)
      navigate('/verify-email', { state: { email } })
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <AuthLayout title={t('register.title')} subtitle={t('register.subtitle')}>
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
          label={t('register.password_label')}
          type="password"
          autoComplete="new-password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <Button disabled={busy}>
          {busy ? t('register.creating') : t('register.submit')}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        {t('register.have_account')}{' '}
        <Link className="font-semibold text-brand hover:underline" to="/login">
          {t('register.sign_in')}
        </Link>
      </p>
    </AuthLayout>
  )
}
import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { resendVerification } from '../api/auth.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import Button from '../components/Button.jsx'

const COOLDOWN_SECONDS = 30

export default function VerifyEmailPage() {
  const { t } = useTranslation()
  const { verifyEmail } = useAuth()
  const location = useLocation()
  const email = location.state?.email

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  if (!email) return <Navigate to="/login" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      await verifyEmail(email, code)
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  async function handleResend() {
    setError('')
    setInfo('')
    try {
      await resendVerification(email)
      setInfo(t('verify.sent_new'))
      setCooldown(COOLDOWN_SECONDS)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AuthLayout title={t('verify.title')} subtitle={t('verify.subtitle', { email })}>
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <Field
          label={t('verify.code_label')}
          inputMode="numeric"
          maxLength={6}
          dir="ltr"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        {error && (
          <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
        )}
        {info && (
          <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand-dark">{info}</p>
        )}
        <Button disabled={busy}>{busy ? t('verify.checking') : t('verify.submit')}</Button>
        <Button
          type="button"
          variant="outline"
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          {cooldown > 0 ? t('verify.resend_in', { seconds: cooldown }) : t('verify.resend')}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link className="font-semibold text-brand hover:underline" to="/login">
          {t('common.back_to_signin')}
        </Link>
      </p>
    </AuthLayout>
  )
}
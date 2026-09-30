import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { forgotPassword, verifyResetCode, resetPassword } from '../api/auth.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import Button from '../components/Button.jsx'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(action, nextStep) {
    setError('')
    setBusy(true)
    try {
      await action()
      if (nextStep) setStep(nextStep)
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  function handleSendCode(e) {
    e.preventDefault()
    run(() => forgotPassword(email), 2)
  }

  function handleVerify(e) {
    e.preventDefault()
    run(() => verifyResetCode(email, code), 3)
  }

  function handleReset(e) {
    e.preventDefault()
    run(async () => {
      await resetPassword(email, code, password)
      navigate('/login')
    })
  }

  const errorBox = error && (
    <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
  )

  if (step === 1) {
    return (
      <AuthLayout title={t('forgot.title')} subtitle={t('forgot.subtitle')}>
        <form className="flex flex-col gap-3.5" onSubmit={handleSendCode}>
          <Field
            label={t('common.email')}
            type="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errorBox}
          <Button disabled={busy}>{busy ? t('forgot.sending') : t('forgot.send')}</Button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link className="font-semibold text-brand hover:underline" to="/login">
            {t('common.back_to_signin')}
          </Link>
        </p>
      </AuthLayout>
    )
  }

  if (step === 2) {
    return (
      <AuthLayout
        title={t('forgot.code_title')}
        subtitle={t('forgot.code_subtitle', { email })}
      >
        <form className="flex flex-col gap-3.5" onSubmit={handleVerify}>
          <Field
            label={t('verify.code_label')}
            inputMode="numeric"
            maxLength={6}
            dir="ltr"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {errorBox}
          <Button disabled={busy}>
            {busy ? t('verify.checking') : t('forgot.verify_code')}
          </Button>
          <Button type="button" variant="outline" onClick={() => setStep(1)}>
            {t('forgot.other_email')}
          </Button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t('forgot.new_title')} subtitle={t('forgot.new_subtitle')}>
      <form className="flex flex-col gap-3.5" onSubmit={handleReset}>
        <Field
          label={t('forgot.new_label')}
          type="password"
          autoComplete="new-password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorBox}
        <Button disabled={busy}>{busy ? t('forgot.saving') : t('forgot.change')}</Button>
      </form>
    </AuthLayout>
  )
}
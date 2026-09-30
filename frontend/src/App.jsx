import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from './context/AuthContext.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import VerifyEmailPage from './pages/VerifyEmailPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NewProjectPage from './pages/NewProjectPage.jsx'
const ONBOARDED_KEY = 'onboarded'

function App() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDED_KEY) === '1'
  )

  function finishOnboarding() {
    localStorage.setItem(ONBOARDED_KEY, '1')
    setOnboarded(true)
  }

  if (loading) return <p className="p-6 text-center text-muted">{t('common.loading')}</p>

  if (!user && !onboarded) return <OnboardingPage onDone={finishOnboarding} />

  const guestOnly = (page) => (user ? <Navigate to="/" /> : page)

  return (
    <Routes>
      <Route path="/login" element={guestOnly(<LoginPage />)} />
      <Route path="/register" element={guestOnly(<RegisterPage />)} />
      <Route path="/verify-email" element={guestOnly(<VerifyEmailPage />)} />
      <Route path="/forgot-password" element={guestOnly(<ForgotPasswordPage />)} />
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
            <Route path="/projects/new" element={user ? <NewProjectPage /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
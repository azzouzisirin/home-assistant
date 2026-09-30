import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createProject } from '../api/projects.js'
import { GOALS, ROOM_TYPES } from '../config/projectOptions.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Option from '../components/Option.jsx'
import Button from '../components/Button.jsx'

export default function NewProjectPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [goalText, setGoalText] = useState('')
  const [roomType, setRoomType] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleCreate() {
    setError('')
    setBusy(true)
    try {
      await createProject({ goal, goalText, roomType })
      navigate('/')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  if (step === 1) {
    return (
      <AuthLayout title={t('projects.goal_title')} subtitle={t('projects.goal_subtitle')}>
        <div className="flex flex-col gap-2.5">
          {GOALS.map((g) => (
            <Option key={g} selected={goal === g} onClick={() => setGoal(g)}>
              {t(`projects.goals.${g}`)}
            </Option>
          ))}
        </div>

        <label className="mt-4 flex flex-col gap-1.5 text-sm text-muted">
          {t('projects.free_text_label')}
          <textarea
            dir="auto"
            rows={3}
            maxLength={500}
            placeholder={t('projects.free_text_placeholder')}
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            className="rounded-xl border border-line bg-white px-3.5 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/25"
          />
        </label>

        <div className="mt-5 flex flex-col gap-3">
          <Button disabled={!goal} onClick={() => setStep(2)}>
            {t('projects.continue')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            {t('projects.back')}
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t('projects.room_title')} subtitle={t('projects.room_subtitle')}>
      <div className="flex flex-col gap-2.5">
        {ROOM_TYPES.map((r) => (
          <Option key={r} selected={roomType === r} onClick={() => setRoomType(r)}>
            {t(`projects.rooms.${r}`)}
          </Option>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <Button disabled={!roomType || busy} onClick={handleCreate}>
          {busy ? t('projects.creating') : t('projects.create')}
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => setStep(1)}>
          {t('projects.back')}
        </Button>
      </div>
    </AuthLayout>
  )
}
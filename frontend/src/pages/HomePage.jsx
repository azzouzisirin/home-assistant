import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { listProjects } from '../api/projects.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Button from '../components/Button.jsx'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout, deleteAccount } = useAuth()
  const isGuest = Boolean(user.is_guest)
  const [projects, setProjects] = useState(null)

  useEffect(() => {
    listProjects()
      .then((data) => setProjects(data.projects))
      .catch(() => setProjects([]))
  }, [])

  async function handleDelete() {
    if (!window.confirm(t('home.delete_confirm'))) return
    try {
      await deleteAccount()
    } catch (err) {
      alert(err.message)
    }
  }

  function formatDate(value) {
    return new Date(value.replace(' ', 'T') + 'Z').toLocaleDateString(i18n.language)
  }

  return (
    <AuthLayout
      title={t('projects.title')}
      subtitle={isGuest ? t('home.guest_subtitle') : t('home.signed_in', { email: user.email })}
    >
      {isGuest && (
        <p className="mb-4 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand-dark">
          {t('home.guest_note')}
        </p>
      )}

      <Button className="w-full" onClick={() => navigate('/projects/new')}>
        {t('projects.new')}
      </Button>

      <div className="my-5 flex flex-col gap-2.5">
        {projects === null && (
          <p className="text-center text-sm text-muted">{t('common.loading')}</p>
        )}
        {projects?.length === 0 && (
          <p className="text-center text-sm text-muted">{t('projects.empty')}</p>
        )}
        {projects?.map((p) => (
          <div key={p.id} className="rounded-xl border border-line bg-white px-4 py-3">
            <div className="font-semibold">
              {t(`projects.rooms.${p.room_type}`)} · {t(`projects.goals.${p.goal}`)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-muted">
              <span className="rounded-full bg-sand px-2 py-0.5">
                {t(`projects.status.${p.status}`)}
              </span>
              <span>{formatDate(p.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <Button variant="outline" onClick={logout}>{t('home.logout')}</Button>
        <Button variant="danger" onClick={handleDelete}>{t('home.delete')}</Button>
      </div>
    </AuthLayout>
  )
}
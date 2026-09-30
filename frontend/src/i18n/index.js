import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

export const LANGUAGES = [
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' }
]

const STORAGE_KEY = 'lang'

function detectLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (LANGUAGES.some((l) => l.code === saved)) return saved

  const browser = navigator.language?.slice(0, 2)
  if (LANGUAGES.some((l) => l.code === browser)) return browser

  return 'ar'
}

function applyToDocument(code) {
  const language = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]
  document.documentElement.lang = language.code
  document.documentElement.dir = language.dir
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar }
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

applyToDocument(i18n.language)

i18n.on('languageChanged', (code) => {
  localStorage.setItem(STORAGE_KEY, code)
  applyToDocument(code)
})

export default i18n
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en'
import trTranslations from './locales/tr'
import deTranslations from './locales/de'

const savedLanguage = localStorage.getItem('i18nextLng')

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      tr: {
        translation: trTranslations
      },
      de: {
        translation: deTranslations
      }
    },
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  })

// Eğer daha önce seçilmiş bir dil varsa onu kullan
if (savedLanguage) {
  i18n.changeLanguage(savedLanguage)
}

export default i18n 
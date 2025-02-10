import { Switch } from '@headlessui/react'
import { useTheme } from '../../../context/ThemeContext'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import type { Theme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'

interface GeneralSectionProps {
  onLogout: () => void
}

export default function GeneralSection({ onLogout }: GeneralSectionProps) {
  const { theme, setTheme } = useTheme()
  const [showCode, setShowCode] = useState(false)
  const [language, setLanguage] = useState('auto-detect')
  const { t } = useTranslation()

  const handleArchiveAll = () => {
    // Archive implementation
  }

  const handleDeleteAll = () => {
    // Delete implementation
  }

  return (
    <div className="space-y-6">
      {/* Theme Setting */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('settings.theme')}
        </label>
        <div className="relative">
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pr-8 text-sm"
          >
            <option value="system">{t('settings.themeOptions.system')}</option>
            <option value="light">{t('settings.themeOptions.light')}</option>
            <option value="dark">{t('settings.themeOptions.dark')}</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Code Display Setting */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('settings.codeDisplay')}
        </label>
        <Switch
          checked={showCode}
          onChange={setShowCode}
          className={`${
            showCode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span className={`${
            showCode ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </Switch>
      </div>

      {/* Language Setting */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('settings.language')}
        </label>
        <div className="relative">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pr-8 text-sm"
          >
            <option value="auto-detect">{t('settings.autoDetect')}</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Chat Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.archivedChats')}
          </span>
          <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            {t('settings.manage')}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.archiveAll')}
          </span>
          <button onClick={handleArchiveAll} className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            {t('settings.archiveAll')}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.deleteAll')}
          </span>
          <button onClick={handleDeleteAll} className="px-3 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">
            {t('settings.deleteAll')}
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={onLogout}
          className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {t('settings.logout.device')}
        </button>
      </div>
    </div>
  )
} 
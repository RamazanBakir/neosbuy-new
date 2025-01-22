import { Switch } from '@headlessui/react'
import { useTheme } from '../../../context/ThemeContext'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import type { Theme } from '../../../context/ThemeContext'

interface GeneralSectionProps {
  onLogout: () => void
}

export default function GeneralSection({ onLogout }: GeneralSectionProps) {
  const { theme, setTheme } = useTheme()
  const [showCode, setShowCode] = useState(false)
  const [language, setLanguage] = useState('auto-detect')

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
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
        <div className="relative">
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pr-8 text-sm"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Code Display Setting */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Always show code when using data analyst
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
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
        <div className="relative">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pr-8 text-sm"
          >
            <option value="auto-detect">Auto-detect</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Chat Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Archived chats</span>
          <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Manage
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Archive all chats</span>
          <button 
            onClick={handleArchiveAll}
            className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Archive all
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Delete all chats</span>
          <button 
            onClick={handleDeleteAll}
            className="px-3 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Delete all
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={onLogout}
          className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Log out on this device
        </button>
      </div>
    </div>
  )
} 
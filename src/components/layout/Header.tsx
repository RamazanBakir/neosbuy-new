import { Bars3Icon, SunIcon, MoonIcon, UserIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../../context/ThemeContext'

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            <UserIcon className="h-5 w-5" />
            Login
          </button>
        </div>
      </div>
    </header>
  )
} 
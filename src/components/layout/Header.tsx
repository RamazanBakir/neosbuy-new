import { Bars3Icon, SunIcon, MoonIcon, UserIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'
import ProfileDropdown from './ProfileDropdown'

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const handleAuthClick = () => {
    if (user) {
      signOut()
    } else {
      setIsAuthOpen(true)
    }
  }

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
          
          {user ? (
            <ProfileDropdown 
              email={user.email} 
              onSignOut={signOut}
            />
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <UserIcon className="h-5 w-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </header>
  )
} 
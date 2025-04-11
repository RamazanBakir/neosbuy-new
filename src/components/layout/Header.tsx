import { Bars3Icon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'
import ProfileDropdown from './ProfileDropdown'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { ThemeToggle } from '../common/ThemeToggle'
import { Dispatch, SetStateAction } from 'react'

interface HeaderProps {
  onMenuClick: () => void
  showLoginModal: boolean
  setShowLoginModal: Dispatch<SetStateAction<boolean>>
  showRegisterModal: boolean
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>
}

export default function Header({ 
  onMenuClick, 
  showLoginModal, 
  setShowLoginModal,
  showRegisterModal,
  setShowRegisterModal
}: HeaderProps) {
  const { user, signOut } = useAuth()

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
          <LanguageSwitcher />
          <ThemeToggle />
          
          {user ? (
            <ProfileDropdown 
              email={user.email} 
              onSignOut={signOut}
            />
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <UserIcon className="h-5 w-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialMode="login"
      />
      <AuthModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        initialMode="register"
      />
    </header>
  )
} 
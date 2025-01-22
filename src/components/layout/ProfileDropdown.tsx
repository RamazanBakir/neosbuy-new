import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import SettingsModal from '../settings/SettingsModal'

interface ProfileDropdownProps {
  email: string | undefined
  onSignOut: () => void
}

export default function ProfileDropdown({ email, onSignOut }: ProfileDropdownProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
        <UserIcon className="h-5 w-5" />
        <span>{email ? email.split('@')[0] : 'Profil'}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-2" />
                  Ayarlar
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onSignOut}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Çıkış Yap
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Menu>
  )
} 
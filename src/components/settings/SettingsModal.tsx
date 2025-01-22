import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { 
  Cog6ToothIcon, 
  BellIcon,
  UserIcon,
  SpeakerWaveIcon,
  CircleStackIcon,
  UserCircleIcon,
  Square2StackIcon,
  LockClosedIcon,
  CreditCardIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import GeneralSection from './sections/GeneralSection'
import NotificationSection from './sections/NotificationsSection'
import { useAuth } from '../../context/AuthContext'


const settingsSections = [
  { id: 'general', icon: Cog6ToothIcon, label: 'General' },
  { id: 'notifications', icon: BellIcon, label: 'Notifications' },
  { id: 'personalization', icon: UserIcon, label: 'Personalization' },
  { id: 'speech', icon: SpeakerWaveIcon, label: 'Speech' },
  { id: 'data-controls', icon: CircleStackIcon, label: 'Data Controls' },
  { id: 'builder-profile', icon: UserCircleIcon, label: 'Builder Profile' },
  { id: 'connected-apps', icon: Square2StackIcon, label: 'Connected Apps' },
  { id: 'security', icon: LockClosedIcon, label: 'Security' },
  { id: 'subscription', icon: CreditCardIcon, label: 'Subscription' }
]

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState('general')
  const { signOut } = useAuth()

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSection onLogout={signOut} />
      case 'notifications':
        return <NotificationSection />
      default:
        return null
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Settings
                </Dialog.Title>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-200 dark:border-gray-700">
                  <nav className="space-y-1">
                    {settingsSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
                          activeSection === section.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <section.icon className="h-5 w-5" />
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 px-4">
                  {renderSection()}
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 
import { Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { LanguageIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'de', name: 'Deutsch' }
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('preferred_language', langCode)
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language')
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
        <LanguageIcon className="h-5 w-5" />
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
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } ${
                      i18n.language === lang.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    {lang.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 
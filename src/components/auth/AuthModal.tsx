import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import GoogleIcon from '../icons/GoogleIcon'
import { useTranslation } from 'react-i18next'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signUp, signIn, signInWithGoogle } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await signInWithGoogle()
      if (response.error) {
        setError(response.error)
        return
      }
      onClose()
    } catch (err) {
      setError('Google ile giriş sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Lütfen email ve şifre girin')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      let response;
      if (isRegister) {
        response = await signUp(email, password)
      } else {
        response = await signIn(email, password)
      }

      if (response.error) {
        const errorMessage = translateError(response.error)
        setError(errorMessage)
        return
      }
      
      setEmail('')
      setPassword('')
      onClose()
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const translateError = (error: string) => {
    return t(`errors.${error}`) || error
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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                  {isRegister ? t('auth.signUp') : t('auth.signIn')}
                </Dialog.Title>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button> 
              </div>

              <div className="space-y-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                >
                  <GoogleIcon className="h-5 w-5 text-gray-700" />
                  Google ile Devam Et
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">ya da e-posta ile devam et</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {loading ? t('common.loading') : (isRegister ? t('auth.signUp') : t('auth.signIn'))}
                  </button>

                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isRegister 
                      ? t('auth.haveAccount')
                      : t('auth.noAccount')}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 
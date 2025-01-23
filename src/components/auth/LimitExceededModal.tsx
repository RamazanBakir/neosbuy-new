import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface LimitExceededModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export default function LimitExceededModal({ isOpen, onClose, onLogin }: LimitExceededModalProps) {
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
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                  Üzgünüz, Limitiniz Doldu
                </Dialog.Title>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-gray-600">
                  Ücretsiz deneme süreniz sona erdi. Sınırsız soru sormak ve daha fazla özelliğe erişmek için hesap oluşturabilir veya giriş yapabilirsiniz.
                </p>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={onLogin}
                    className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Giriş Yap veya Kayıt Ol
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Belki Daha Sonra
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
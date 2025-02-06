import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { BaseProduct } from '../../types/chat'
import { StarIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ProductDetailModalProps {
  product: BaseProduct | null
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
}

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious 
}: ProductDetailModalProps) {
  if (!product) return null

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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all z-10">
                {/* Navigation buttons - moved outside of panel content */}
                <div className="fixed inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <div className="w-20 flex justify-start pointer-events-auto">
                    {hasPrevious && (
                      <button
                        onClick={onPrevious}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ChevronLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      </button>
                    )}
                  </div>

                  {/* Modal content */}
                  <div className="w-20 flex justify-end pointer-events-auto">
                    {hasNext && (
                      <button
                        onClick={onNext}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ChevronRightIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Ürün Detayları
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                      {product.title}
                    </h3>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {typeof product.price === 'number' ? `${product.price} TL` : product.price}
                      </p>
                      {product.rating && (
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                            {product.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {product.store || product.store_name}
                    </p>

                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                    >
                      Ürüne Git
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

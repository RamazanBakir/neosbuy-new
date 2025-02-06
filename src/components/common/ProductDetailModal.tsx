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
  viewMode: string
  setViewMode: (mode: string) => void
}

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  viewMode,
  setViewMode
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
            <div className="relative w-full max-w-5xl">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full transform overflow-visible rounded-2xl bg-white dark:bg-gray-800 px-16 py-12 shadow-xl transition-all relative">
                  {/* Navigation buttons - inside panel but outside content */}
                  {hasPrevious && (
                    <button
                      onClick={onPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-50"
                    >
                      <ChevronLeftIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}
                  
                  {hasNext && (
                    <button
                      onClick={onNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-50"
                    >
                      <ChevronRightIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}

                  {/* Modal content */}
                  <div className="flex flex-col space-y-8">
                    <div className="flex justify-between items-start">
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
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {viewMode === 'grid' ? 'List View' : 'Grid View'}
                          </button>
                        </div>

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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

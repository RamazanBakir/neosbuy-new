import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { BaseProduct } from '../../types/chat'
import { StarIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

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
  photos?: string[]
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
  setViewMode,
  photos
}: ProductDetailModalProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const allPhotos = [
    product?.image,
    ...(product?.product_photos || [])
  ].filter(Boolean)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length)
  }

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
                      <div className="space-y-4">
                        <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={allPhotos[currentImageIndex]}
                            alt={product?.title}
                            className="w-full h-full object-contain"
                          />
                          
                          {allPhotos.length > 1 && (
                            <>
                              <button
                                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
                              >
                                <ChevronLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                              </button>
                              <button
                                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
                              >
                                <ChevronRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                              </button>
                            </>
                          )}
                        </div>

                        {allPhotos.length > 1 && (
                          <div className="grid grid-cols-6 gap-2 px-2">
                            {allPhotos.map((photo, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative aspect-square rounded-lg overflow-hidden ${
                                  index === currentImageIndex 
                                    ? 'ring-2 ring-blue-600 dark:ring-blue-400' 
                                    : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-400'
                                }`}
                              >
                                <img
                                  src={photo}
                                  alt={`${product?.title} - ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {index === currentImageIndex && (
                                  <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-400/10" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
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
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(product.rating)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                {product.rating}
                                {product.product_num_reviews && (
                                  <span className="ml-1 text-xs">
                                    ({product.product_num_reviews} değerlendirme)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {product.store || product.store_name}
                        </p>

                        {product.description && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                              Ürün Açıklaması
                            </h4>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
                                !isDescriptionExpanded ? 'line-clamp-4' : ''
                              }`}>
                                {product.description}
                              </p>
                              {product.description.length > 200 && (
                                <button
                                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                  className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                >
                                  {isDescriptionExpanded ? 'Daha az göster' : 'Devamını göster'}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {product.product_attributes && Object.keys(product.product_attributes).length > 0 && (
                          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                              Ürün Özellikleri
                            </h4>
                            <div className="space-y-3">
                              {Object.entries(product.product_attributes).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700/50 last:border-0">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {key}
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400 text-right">
                                    {String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors text-center font-semibold flex items-center justify-center space-x-2"
                        >
                          <span>Ürüne Git</span>
                          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
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

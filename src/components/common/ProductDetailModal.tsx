import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { BaseProduct } from '../../types/chat'
import { StarIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ProductDetailModalProps {
  product: BaseProduct | null
  isOpen: boolean
  onClose: () => void
  offer?: {
    offer_page_url?: string;
  };
  product_offers_page_url?: string;
  product_page_url?: string;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null
console.log("ramazan aasd",product)
  const productData = typeof product === 'object' && '0' in product ? product['0'] : product
  console.log('Product Structure:', {
    raw: product,
    processed: productData,
    urls: {
      offer_url: productData?.offer?.offer_page_url,
      product_offers_url: productData?.product_offers_page_url,
      product_url: productData?.product_page_url
    }
  })

  console.log('Product Details:', productData)
  const additionalDetails = Object.entries(productData).filter(([key, value]) => {
    const basicFields = ['image', 'title', 'price', 'rating', 'store', 'store_name', 'url', 'offer']
    return !basicFields.includes(key) && value !== null && value !== undefined && value !== ''
  })
  

  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatValue = (value: any, key: string): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Evet' : 'Hayır'

    // product_attributes için
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (key === 'product_attributes') {
        return Object.entries(value)
          .map(([attrKey, attrValue]) => `${attrKey}: ${attrValue}`)
          .join('\n')
      }
      // Offer bilgileri için
      if (key === 'offer') {
        const relevantInfo = {
          'Mağaza': value.store_name,
          'Fiyat': value.price,
          'Kargo': value.shipping,
          'Durum': value.product_condition === 'NEW' ? 'Yeni' : 'Kullanılmış'
        }
        return Object.entries(relevantInfo)
          .filter(([, val]) => val)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      }
      return JSON.stringify(value, null, 2)
    }
    
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    
    return String(value)
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
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
                  <div>
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={productData.image}
                        alt={productData.title}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    <div className="mt-4">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        {productData.title}
                      </h3>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {typeof productData.price === 'number' ? `${productData.price} TL` : productData.price}
                        </p>
                        {productData.rating && (
                          <div className="flex items-center">
                            <StarIcon className="h-5 w-5 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                              {productData.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {productData.store || productData.store_name}
                      </p>

                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          // Store'a göre URL oluştur
                          let url
                          if (productData.store === 'LC Waikiki') {
                            url = `https://www.lcwaikiki.com/tr-TR/TR/arama?q=${encodeURIComponent(productData.title)}`
                          } else if (productData.store === 'Trendyol') {
                            url = `https://www.trendyol.com/sr?q=${encodeURIComponent(productData.title)}`
                          } else if (productData.store === 'Hepsiburada') {
                            url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(productData.title)}`
                          } else {
                            url = `https://www.google.com/search?q=${encodeURIComponent(productData.title + ' ' + productData.store)}`
                          }
                          
                          console.log('Generated URL:', url)
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer')
                          }
                        }}
                        className="mt-4 w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium inline-block cursor-pointer"
                      >
                        Ürüne Git
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                    {additionalDetails.map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {formatKey(key)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {formatValue(value, key)}
                        </p>
                      </div>
                    ))}
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

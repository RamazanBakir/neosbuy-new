import { ChatMessage, BaseProduct } from '../../types/chat'
import { useLoadingMessages } from '../../hooks/useLoadingMessages'
import { StarIcon } from '@heroicons/react/24/solid'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import ImageViewer from '../common/ImageViewer'

type ViewMode = 'grid' | 'list'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const displayedMessage = useLoadingMessages()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedImage, setSelectedImage] = useState<{url: string; alt: string} | null>(null)

  const handleImageClick = (imageUrl: string, alt: string) => {
    setSelectedImage({ url: imageUrl, alt })
  }

  const renderProductList = (products: BaseProduct[]) => {
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 2))
    }

    const prevSlide = () => {
      setCurrentSlide((prev) => 
        prev === 0 ? Math.ceil(products.length / 2) - 1 : prev - 1
      )
    }

    const visibleProducts = products.slice(currentSlide * 2, currentSlide * 2 + 2)

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {currentSlide * 2 + 1}-{Math.min((currentSlide * 2) + 2, products.length)} / {products.length}
            </span>
          </div>

          <div className="relative min-h-[400px]">
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' 
                : 'flex flex-col space-y-4'
            }`}>
              {visibleProducts.map((product, index) => (
                <div key={index} className={`${
                  viewMode === 'grid' 
                    ? 'flex flex-col' 
                    : 'flex flex-row space-x-4'
                }`}>
                  <div 
                    className={`relative overflow-hidden rounded-lg group cursor-pointer ${
                      viewMode === 'grid' ? 'w-full h-48' : 'w-32 h-32'
                    }`}
                    onClick={() => {
                      const imageUrl = product.image || product.photo || (product.photos?.[0]) || '';
                      const title = product.title;
                      handleImageClick(imageUrl, title);
                    }}
                  >
                    <img 
                      src={product.image || product.photo || (product.photos && product.photos[0])} 
                      alt={product.title}
                      className="w-full h-full object-contain bg-gray-50 dark:bg-gray-900"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <MagnifyingGlassIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className={`${viewMode === 'grid' ? 'mt-4' : ''} flex-1`}>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
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
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {product.store || product.store_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length > 2 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderMessage = (message: ChatMessage) => {
    if (message.type === 'user') {
      return (
        <div className="max-w-[80%] rounded-lg p-3 bg-blue-500 text-white">
          {typeof message.content === 'string' ? message.content : null}
        </div>     
      )
    }

    if (message.type === 'error') {
      return (
        <div className="max-w-[80%] rounded-lg p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100">
          {typeof message.content === 'string' ? message.content : null}
        </div>
      )
    }

    if (message.type === 'assistant' && Array.isArray(message.content)) {
      return renderProductList(message.content)
    }

    return (
      <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {typeof message.content === 'string' ? message.content : null}
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} w-full`}
          >
            {renderMessage(message)}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <p className="mb-2">
                {displayedMessage}
                <span className="animate-pulse ml-1">|</span>
              </p>
            </div>
          </div>
        )}
      </div>
      
      {selectedImage && (
        <ImageViewer 
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  )
} 
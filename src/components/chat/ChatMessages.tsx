import { ChatMessage, BaseProduct } from '../../types/chat'
import { useLoadingMessages } from '../../hooks/useLoadingMessages'
import { StarIcon } from '@heroicons/react/24/solid'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  ClipboardIcon,
  SpeakerWaveIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import ImageViewer from '../common/ImageViewer'
import Tooltip from '../common/Tooltip'
import { useSpeech } from '../../hooks/useSpeech'

const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
  </div>
)

type ViewMode = 'grid' | 'list'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const displayedMessage = useLoadingMessages()
  const [slideStates, setSlideStates] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('slide_states')
    return saved ? JSON.parse(saved) : {}
  })
  
  const [viewModes, setViewModes] = useState<Record<string, ViewMode>>(() => {
    const saved = localStorage.getItem('view_modes')
    return saved ? JSON.parse(saved) : {}
  })
  
  const [selectedImage, setSelectedImage] = useState<{url: string; alt: string} | null>(null)
  const { speak, stop, isSpeaking } = useSpeech()

  // slideStates değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('slide_states', JSON.stringify(slideStates))
  }, [slideStates])

  // viewModes değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('view_modes', JSON.stringify(viewModes))
  }, [viewModes])

  const handleImageClick = (imageUrl: string, alt: string) => {
    setSelectedImage({ url: imageUrl, alt })
  }

  const handleSpeakClick = (text: string) => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text)
    }
  }

  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // İsteğe bağlı: Kopyalama başarılı olduğunda bir bildirim gösterilebilir
    } catch (err) {
      console.error('Kopyalama hatası:', err)
    }
  }

  const renderProductList = (products: BaseProduct[], messageId: string) => {
    const currentSlide = slideStates[messageId] || 0
    const viewMode = viewModes[messageId] || 'grid'

    const setViewMode = (mode: ViewMode) => {
      setViewModes(prev => ({
        ...prev,
        [messageId]: mode
      }))
    }

    const nextSlide = () => {
      setSlideStates(prev => ({
        ...prev,
        [messageId]: (prev[messageId] + 1) % Math.ceil(products.length / (viewMode === 'grid' ? 2 : 3)) || 0
      }))
    }

    const prevSlide = () => {
      setSlideStates(prev => ({
        ...prev,
        [messageId]: prev[messageId] === 0 
          ? Math.ceil(products.length / (viewMode === 'grid' ? 2 : 3)) - 1 
          : prev[messageId] - 1
      }))
    }

    const visibleProducts = products.slice(
      currentSlide * (viewMode === 'grid' ? 2 : 3), 
      currentSlide * (viewMode === 'grid' ? 2 : 3) + (viewMode === 'grid' ? 2 : 3)
    )

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
              {currentSlide * (viewMode === 'grid' ? 2 : 3) + 1}-
              {Math.min((currentSlide * (viewMode === 'grid' ? 2 : 3)) + (viewMode === 'grid' ? 2 : 3), products.length)} / {products.length}
            </span>
          </div>

          <div className="relative min-h-[400px] w-full">
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' 
                : 'flex flex-col space-y-4'
            } w-full max-w-2xl mx-auto`}>
              {visibleProducts.map((product, index) => (
                <div key={index} className={`${
                  viewMode === 'grid' 
                    ? 'flex flex-col w-full max-w-xs mx-auto' 
                    : 'flex flex-row space-x-4 w-full'
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

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Başka bir ürün kategorisi aramak ister misiniz?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                Benzer Ürünler
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                İndirimli Ürünler
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                En Çok Satanlar
              </button> 
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'assistant' && message.messageType === 'products' && Array.isArray(message.content) ? (
                renderProductList(message.content, message.id)
              ) : (
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-lg px-4 py-2 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : message.type === 'error'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {typeof message.content === 'string' && <p className="text-sm">{message.content}</p>}
                    {message.type === 'assistant' && !message.messageType && (
                      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <Tooltip text="Metni Kopyala" position="bottom">
                          <button 
                            onClick={() => typeof message.content === 'string' && handleCopyClick(message.content)}
                            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full transition-all duration-200 active:scale-90 active:bg-gray-300 dark:active:bg-gray-600"
                          >
                            <ClipboardIcon className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip text={isSpeaking ? "Durdur" : "Sesli Dinle"} position="bottom">
                          <button 
                            onClick={() => typeof message.content === 'string' && handleSpeakClick(message.content)}
                            className={`hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full transition-all duration-200 active:scale-90 active:bg-gray-300 dark:active:bg-gray-600 ${
                              isSpeaking ? 'text-blue-500 dark:text-blue-400' : ''
                            }`}
                          >
                            <SpeakerWaveIcon className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip text="Çeviri" position="bottom">
                          <button 
                            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full transition-all duration-200 active:scale-90 active:bg-gray-300 dark:active:bg-gray-600"
                          >
                            <GlobeAltIcon className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <LoadingDots />
              <p className="text-sm">{displayedMessage}</p>
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
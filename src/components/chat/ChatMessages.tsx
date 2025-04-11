import { ChatMessage, BaseProduct } from '../../types/chat'
import { useLoadingMessages } from '../../hooks/useLoadingMessages'
import { StarIcon } from '@heroicons/react/24/solid'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  ClipboardIcon,
  SpeakerWaveIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'
import ImageViewer from '../common/ImageViewer'
import Tooltip from '../common/Tooltip'
import { useSpeech } from '../../hooks/useSpeech'
import LanguageMenu from '../common/LanguageMenu'
import { useTranslation } from 'react-i18next'
import ProductDetailModal from '../common/ProductDetailModal'
import { useTranslation as useCustomTranslation } from '../../hooks/useTranslation'

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
  const { t } = useTranslation()
  const { translate, isTranslating } = useCustomTranslation()
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
  const [languageMenu, setLanguageMenu] = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<BaseProduct | null>(null)
  const [isSliding, setIsSliding] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentProducts, setCurrentProducts] = useState<BaseProduct[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0)

  // slideStates değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('slide_states', JSON.stringify(slideStates))
  }, [slideStates])

  // viewModes değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('view_modes', JSON.stringify(viewModes))
  }, [viewModes])

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    const savedModes = localStorage.getItem('view_modes')
    if (savedModes) {
      setViewModes(JSON.parse(savedModes))
    }

    // Mobil görünümde varsayılan olarak list view'ı ayarla
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setViewMode('list')
      }
    }

    // İlk yüklemede kontrol et
    handleResize()

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const handleTranslateClick = (event: React.MouseEvent, content: string) => {
    event.preventDefault()
    setSelectedText(content)
    setTranslatedText(null) // Reset translated text when starting new translation
    const rect = event.currentTarget.getBoundingClientRect()
    setLanguageMenu({ x: rect.left, y: rect.bottom + 5 })
  }

  const handleSelectLanguage = async (langCode: string) => {
    if (typeof selectedText !== 'string') return
    
    try {
      const translatedText = await translate(selectedText, langCode)
      setTranslatedText(translatedText)
    } catch (error) {
      console.error('Çeviri hatası:', error)
    } finally {
      setLanguageMenu(null)
    }
  }

  const handleProductClick = (product: BaseProduct, products: BaseProduct[]) => {
    setSelectedProduct(product)
    setCurrentProducts(products)
    setCurrentProductIndex(products.findIndex(p => p.title === product.title))
  }

  const handleNextProduct = () => {
    if (currentProductIndex < currentProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1)
      setSelectedProduct(currentProducts[currentProductIndex + 1])
    }
  }

  const handlePreviousProduct = () => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1)
      setSelectedProduct(currentProducts[currentProductIndex - 1])
    }
  }

  const renderProductList = (products: BaseProduct[], messageId: string) => {
    const currentSlide = slideStates[messageId] || 0
    const viewMode = viewModes[messageId] || 'grid'
    const itemsPerPage = viewMode === 'grid' ? 3 : 3

    const setViewMode = (mode: ViewMode) => {
      setSlideStates(prev => ({ ...prev, [messageId]: 0 })) // Reset slide position when changing view mode
      setViewModes(prev => ({
        ...prev,
        [messageId]: mode
      }))
    }

    const nextSlide = () => {
      if (isSliding) return
      
      setIsSliding(true)
      const totalSlides = Math.ceil(products.length / itemsPerPage)
      setSlideStates(prev => ({
        ...prev,
        [messageId]: prev[messageId] === totalSlides - 1 ? 0 : (prev[messageId] || 0) + 1
      }))
      
      setTimeout(() => {
        setIsSliding(false)
      }, 300)
    }

    const prevSlide = () => {
      if (isSliding) return
      
      setIsSliding(true)
      const totalSlides = Math.ceil(products.length / itemsPerPage)
      setSlideStates(prev => ({
        ...prev,
        [messageId]: prev[messageId] === 0 ? totalSlides - 1 : (prev[messageId] || 0) - 1
      }))
      
      setTimeout(() => {
        setIsSliding(false)
      }, 300)
    }

    const visibleProducts = products.slice(
      currentSlide * itemsPerPage,
      currentSlide * itemsPerPage + itemsPerPage
    )

    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800/30 p-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {currentSlide * itemsPerPage + 1}-
              {Math.min((currentSlide * itemsPerPage) + itemsPerPage, products.length)} / {products.length}
            </span>
          </div>

          <div className="relative min-h-[400px] w-full">
            {products.length > itemsPerPage && viewMode === 'list' && (
              <button
                onClick={prevSlide}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-8 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors z-10"
              >
                <ChevronUpIcon className="h-6 w-6" />
              </button>
            )}

            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-3 gap-4' 
                : 'flex flex-col space-y-4'
            } w-full relative`}>
              {visibleProducts.map((product, index) => (
                <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}>
                  <div 
                    onClick={() => handleProductClick(product, products)}
                    className={`relative overflow-hidden cursor-pointer ${
                      viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                    }`}
                  >
                    <img 
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain bg-gray-50 dark:bg-gray-900 p-4"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <MagnifyingGlassIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <h3 
                      onClick={() => handleProductClick(product, products)}
                      className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {product.title}
                    </h3>

                    <div 
                      onClick={() => handleProductClick(product, products)}
                      className="mt-2 flex items-center cursor-pointer"
                    >
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                      {product.rating && (
                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                          ({product.product_num_reviews || '0'} değerlendirme)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p 
                        onClick={() => handleProductClick(product, products)}
                        className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                      >
                        {typeof product.price === 'number' ? `${product.price} TL` : product.price}
                      </p>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {product.store || product.store_name}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length > itemsPerPage && (
              <>
                {viewMode === 'grid' ? (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors z-10"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors z-10"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={nextSlide}
                    className="absolute left-1/2 -translate-x-1/2 translate-y-2 bottom-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors z-10"
                  >
                    <ChevronDownIcon className="h-6 w-6" />
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('chat.searchAnotherCategory')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-700 dark:text-gray-200">
                {t('chat.similarProducts')}
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-700 dark:text-gray-200">
                {t('chat.discountedProducts')}
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-700 dark:text-gray-200">
                {t('chat.bestSellers')}
              </button> 
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#343541]">
        <div className="max-w-4xl mx-auto space-y-4 p-4">
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
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-[#444654] text-gray-900 dark:text-gray-100'
                  }`}>
                    {typeof message.content === 'string' ? (
                      <>
                        <p className="text-sm">{message.content}</p>
                        {translatedText && selectedText === message.content && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{translatedText}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm">{JSON.stringify(message.content, null, 2)}</p>
                    )}
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
                        <Tooltip text={isTranslating ? t('chat.translating') : t('chat.translate')} position="bottom">
                          <button 
                            onClick={(e) => typeof message.content === 'string' && handleTranslateClick(e, message.content)}
                            className={`hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full transition-all duration-200 active:scale-90 active:bg-gray-300 dark:active:bg-gray-600 ${
                              isTranslating ? 'text-blue-500 dark:text-blue-400' : ''
                            }`}
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
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-[#444654] rounded-lg px-4 py-3 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
                <div className="flex items-center space-x-3">
                  <LoadingDots />
                  {displayedMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {displayedMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {selectedImage && (
        <ImageViewer 
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Language Menu */}
      {languageMenu && (
        <LanguageMenu
          x={languageMenu.x}
          y={languageMenu.y}
          onClose={() => setLanguageMenu(null)}
          onSelectLanguage={handleSelectLanguage}
        />
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null)
          setCurrentProducts([])
          setCurrentProductIndex(0)
        }}
        onNext={handleNextProduct}
        onPrevious={handlePreviousProduct}
        hasNext={currentProductIndex < currentProducts.length - 1}
        hasPrevious={currentProductIndex > 0}
        viewMode={viewMode}
        setViewMode={(mode: 'grid' | 'list') => setViewMode(mode)}
      />
    </>
  )
} 
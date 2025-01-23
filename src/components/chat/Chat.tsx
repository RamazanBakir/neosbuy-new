import { useState, useEffect } from 'react'
import { ChatMessage, BaseProduct, ChatSession } from '../../types/chat'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { searchProducts } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useQuestionLimit } from '../../hooks/useQuestionLimit'
import AuthModal from '../auth/AuthModal'
import LimitExceededModal from '../auth/LimitExceededModal'

interface ChatProps {
  activeSessionId: string | null
  sessions: ChatSession[]
  onUpdateSession: (sessionId: string, messages: ChatMessage | ChatMessage[]) => void
}

export default function Chat({ activeSessionId, sessions, onUpdateSession }: ChatProps) {
  const { user } = useAuth()
  const { hasReachedLimit, incrementCount, remainingQuestions } = useQuestionLimit()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLimitExceededOpen, setIsLimitExceededOpen] = useState(false)

  // Get current session's messages
  const currentSession = sessions.find(s => s.id === activeSessionId)
  const currentMessages = currentSession?.messages || []

  const mapProduct = (product: any): BaseProduct => ({
    title: product.product_title || product.title || product.name,
    price: product.offer?.price || product.price,
    description: product.product_description || product.description,
    image: product.product_photos?.[0] || product.image || product.photo,
    rating: product.product_rating || product.rating,
    store: product.offer?.store_name || product.store_name || product.store
  })

  const handleNewMessage = async (content: string) => {
    if (!activeSessionId) return
    if (hasReachedLimit) {
      setIsLimitExceededOpen(true)
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    // Update session
    onUpdateSession(activeSessionId, userMessage)
    setIsLoading(true)

    try {
      incrementCount()
      const response = await searchProducts(content)
      
      const aiSummaryMessage: ChatMessage = {
        id: (Date.now() + 1).toString(), 
        type: 'assistant',
        content: response.aiSummary,
        timestamp: new Date()
      }

      const productsMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        messageType: 'products',
        content: response.productSearch.data.products.map(mapProduct),
        timestamp: new Date()
      }

      // Update session with both messages
      onUpdateSession(activeSessionId, [aiSummaryMessage, productsMessage])
    } catch (error) {
      console.error('Search error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'Üzgünüm, arama sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }
      onUpdateSession(activeSessionId, errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {!user && !hasReachedLimit && (
        <div className="bg-blue-50 p-4 text-sm text-blue-700">
          Ücretsiz deneme: {remainingQuestions} soru hakkınız kaldı. 
          <button onClick={() => setIsAuthModalOpen(true)} className="font-medium underline hover:text-blue-800">
            giriş yapın.
          </button>
        </div>
      )}

      <div className="flex-1 mb-4">
        <ChatMessages messages={currentMessages} isLoading={isLoading} />
        <ChatInput onSubmit={handleNewMessage} />
      </div>

      <LimitExceededModal 
        isOpen={isLimitExceededOpen}
        onClose={() => setIsLimitExceededOpen(false)}
        onLogin={() => {
          setIsLimitExceededOpen(false)
          setIsAuthModalOpen(true)
        }}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
} 
import { useState } from 'react'
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
  onUpdateSessionTitle: (sessionId: string, title: string) => void
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>
  setActiveSessionId: (id: string | null) => void
}

export default function Chat({ 
  activeSessionId, 
  sessions, 
  onUpdateSession, 
  onUpdateSessionTitle,
  setSessions,
  setActiveSessionId 
}: ChatProps) {
  const { user, fetchSessionHistory } = useAuth()
  const { hasReachedLimit, incrementCount, remainingQuestions } = useQuestionLimit()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLimitExceededOpen, setIsLimitExceededOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

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
    // Token kontrolü
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      console.error('No access token found')
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'error',
        content: 'Oturum hatası. Lütfen tekrar giriş yapın.',
        timestamp: new Date()
      }
      if (currentSessionId) {
        onUpdateSession(currentSessionId, errorMessage)
      }
      return
    }

    if (hasReachedLimit) {
      setIsLimitExceededOpen(true)
      return
    }

    let currentSessionId = activeSessionId
    const isNewSession = !currentSessionId

    if (isNewSession) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'Yeni Sohbet',
        createdAt: new Date(),
        messages: [],
        sessionId: null
      }
      setSessions(prev => [newSession, ...prev])
      setActiveSessionId(newSession.id)
      setCurrentSessionId(null)
      currentSessionId = newSession.id
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    if (currentSessionId) {
      onUpdateSession(currentSessionId, userMessage)
    }
    setIsLoading(true)

    try {
      incrementCount()
      const response = await searchProducts(content, currentSessionId)
      console.log('Search response:', response)
      
      if (response.sessionId) {
        setCurrentSessionId(response.sessionId)
        console.log('Fetching history for new session:', response.sessionId)
        
        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            return { 
              ...session, 
              sessionId: response.sessionId,
              title: `Sohbet #${response.sessionId.slice(0, 8)}`,
              messages: session.messages
            }
          }
          return session
        }))
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.productSearch?.data?.products?.length > 0 
          ? response.aiSummary 
          : response.aiResponse,
        timestamp: new Date()
      }

      if (response.productSearch?.data?.products?.length > 0) {
        const productsMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          messageType: 'products',
          content: response.productSearch.data.products.map(mapProduct),
          timestamp: new Date()
        }

        if (currentSessionId) {
          onUpdateSession(currentSessionId, [aiMessage, productsMessage])
        }
      } else {
        if (currentSessionId) {
          onUpdateSession(currentSessionId, aiMessage)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'Üzgünüm, arama sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }
      if (currentSessionId) {
        onUpdateSession(currentSessionId, errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#343541]">
      <div className="flex-1 mb-4">
        <ChatMessages messages={currentMessages} isLoading={isLoading} />
      </div>

      <div className="relative max-w-4xl mx-auto w-full px-4 pb-4">
        {!user && !hasReachedLimit && (
          <div className="bg-blue-50 p-4 text-sm text-blue-700 mb-4 rounded-lg">
            Ücretsiz deneme: {remainingQuestions} soru hakkınız kaldı. 
            <button onClick={() => setIsAuthModalOpen(true)} className="font-medium underline hover:text-blue-800 ml-1">
              giriş yapın
            </button>
          </div>
        )}
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
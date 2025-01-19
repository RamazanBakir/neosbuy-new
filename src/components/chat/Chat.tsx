import { useState } from 'react'
import { ChatMessage } from '../../types/chat'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { searchProducts } from '../../services/api'

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleNewMessage = async (content: string) => {
    // Kullanıcı mesajını ekle
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await searchProducts(content)
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.aiSummary,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 mb-4">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      <div className="pb-8">
        <ChatInput onSubmit={handleNewMessage} />
      </div>
    </div>
  )
} 
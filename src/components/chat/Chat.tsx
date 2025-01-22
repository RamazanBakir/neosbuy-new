import { useState } from 'react'
import { ChatMessage, BaseProduct } from '../../types/chat'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { searchProducts } from '../../services/api'

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleNewMessage = async (content: string) => {
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
      const products = response.productSearch.data.products

      // Önce AI özeti mesajını ekleyelim
      const aiSummaryMessage: ChatMessage = {
        id: (Date.now() + 1).toString(), 
        type: 'assistant',
        content: response.aiSummary,
        timestamp: new Date()
      }

      const mapProduct = (product: any): BaseProduct => ({
        title: product.product_title || product.title || product.name,
        price: product.offer?.price || product.price,
        description: product.product_description || product.description,
        image: product.product_photos?.[0] || product.image || product.photo,
        rating: product.product_rating || product.rating,
        store: product.offer?.store_name || product.store_name || product.store
      })

      // Sonra ürünleri içeren bir mesaj oluşturalım
      const productsMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        messageType: 'products',
        content: products.map(mapProduct),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiSummaryMessage, productsMessage])
    } catch (error) {
      console.error('Search error:', error)
      // Hata mesajını ekle
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'Üzgünüm, arama sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
        <div className="flex flex-col">
          <div className="flex-1 mb-4">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput onSubmit={handleNewMessage} />
          </div>
        </div>
  )
} 
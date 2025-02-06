export type MessageType = 'user' | 'assistant' | 'error'
export type ContentType = 'text' | 'products'

export interface BaseProduct {
  title: string
  price: number | string
  description?: string
  image?: string
  photo?: string
  photos?: string[]
  rating?: number
  store?: string
  store_name?: string
  url?: string
  product_num_reviews?: number
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'error'
  messageType?: 'text' | 'products'
  content: string | BaseProduct[]
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  createdAt: Date
  messages: ChatMessage[]
} 
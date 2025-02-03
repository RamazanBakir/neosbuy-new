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
  product_page_url?: string
  offer?: {
    offer_page_url?: string
    store_name?: string
    price?: number | string
    shipping?: string
    product_condition?: string
  }
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
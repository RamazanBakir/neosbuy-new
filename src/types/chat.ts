export type MessageType = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  type: MessageType
  content: string
  timestamp: Date
} 
import { ChatMessage } from '../../types/chat'
import { useLoadingMessages } from '../../hooks/useLoadingMessages'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const displayedMessage = useLoadingMessages()

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
            <p className="mb-2">
              {displayedMessage}
              <span className="animate-pulse ml-1">|</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 
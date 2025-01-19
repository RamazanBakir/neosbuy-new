import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

interface ChatInputProps {
  onSubmit: (message: string) => void
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!message.trim()) return
    
    const currentMessage = message
    setMessage('') // Hemen inputu temizle
    setIsLoading(true)
    setError(null)

    try {
      await onSubmit(currentMessage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      setMessage(currentMessage) // Hata durumunda mesajı geri getir
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-3 pr-12 rounded-lg resize-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:bg-gray-800 dark:text-gray-200"
          placeholder={isLoading ? "Yanıt bekleniyor..." : "Ürün aramak için bir şeyler yazın..."}
          rows={1}
          disabled={isLoading}
        />
        <button 
          onClick={handleSubmit}
          disabled={isLoading || !message.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
} 
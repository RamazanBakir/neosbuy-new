import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next'

interface ChatInputProps {
  onSubmit: (message: string) => void
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const { t } = useTranslation()
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
      setError(err instanceof Error ? err.message : t('common.error'))
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
      <div className="relative bg-white dark:bg-[#2A2B32] rounded-lg border border-gray-200 dark:border-gray-700/50">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-3 pr-12 rounded-lg resize-none focus:outline-none focus:ring-0 
            bg-white dark:bg-[#2A2B32] text-gray-900 dark:text-gray-100 
            placeholder-gray-500 dark:placeholder-gray-400"
          placeholder={t('input.placeholder')}
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !message.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 
            dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}
    </div>
  )
} 
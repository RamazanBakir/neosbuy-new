import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function useLoadingMessages() {
  const { t } = useTranslation()
  const [currentMessage, setCurrentMessage] = useState('')
  const messages = t('loading.messages', { returnObjects: true }) as string[]

  useEffect(() => {
    if (!messages?.length) return
    
    // İlk mesajı hemen göster
    setCurrentMessage(messages[Math.floor(Math.random() * messages.length)])

    const interval = setInterval(() => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)])
    }, 3000)

    return () => clearInterval(interval)
  }, [messages])

  return currentMessage
} 
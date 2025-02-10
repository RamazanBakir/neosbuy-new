import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTypingAnimation } from './useTypingAnimation'

export const useLoadingMessages = () => {
  const { t } = useTranslation()
  const loadingMessages = t('loading.messages', { returnObjects: true }) as string[]
  
  const [currentMessage, setCurrentMessage] = useState(() => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  })
  
  const { displayedMessage, isComplete } = useTypingAnimation(currentMessage, 70)

  useEffect(() => {
    if (!isComplete) return

    const timeout = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length)
      setCurrentMessage(loadingMessages[randomIndex])
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isComplete, loadingMessages])

  return displayedMessage
} 
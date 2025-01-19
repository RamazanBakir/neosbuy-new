import { useState, useEffect } from 'react'

export const useTypingAnimation = (message: string, typingSpeed = 70) => {
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!message) return

    setDisplayedMessage('')
    setIsComplete(false)
    let currentIndex = 0

    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedMessage(message.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsComplete(true)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [message, typingSpeed])

  return { displayedMessage, isComplete }
} 
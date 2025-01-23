import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const QUESTION_LIMIT = 5
const STORAGE_KEY = 'question_count'

export function useQuestionLimit() {
  const { user } = useAuth()
  const [questionCount, setQuestionCount] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored) : 0
  })

  useEffect(() => {
    if (user) {
      // Kullanıcı giriş yapmışsa sayacı sıfırla
      setQuestionCount(0)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const incrementCount = () => {
    if (!user) {
      const newCount = questionCount + 1
      setQuestionCount(newCount)
      localStorage.setItem(STORAGE_KEY, newCount.toString())
    }
  }

  const hasReachedLimit = !user && questionCount >= QUESTION_LIMIT

  return {
    questionCount,
    incrementCount,
    hasReachedLimit,
    remainingQuestions: QUESTION_LIMIT - questionCount
  }
} 
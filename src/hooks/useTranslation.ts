import { useState } from 'react'

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false)

  const translate = async (text: string, targetLang: string) => {
    setIsTranslating(true)
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      const translatedText = data[0]
        .map((item: any[]) => item[0])
        .join('')
      
      return translatedText
    } catch (error) {
      console.error('Translation error:', error)
      throw new Error('Çeviri sırasında bir hata oluştu')
    } finally {
      setIsTranslating(false)
    }
  }

  return { translate, isTranslating }
} 
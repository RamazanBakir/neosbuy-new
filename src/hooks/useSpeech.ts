import { useState, useCallback } from 'react'

const detectLanguage = (text: string): string => {
  // Basit bir dil algılama - daha gelişmiş bir kütüphane de kullanılabilir
  const turkishChars = 'çğıöşüÇĞİÖŞÜ'
  const hasTurkishChars = [...text].some(char => turkishChars.includes(char))
  
  // Türkçe karakterler varsa veya metnin %60'ından fazlası Türkçe kelimeler içeriyorsa
  if (hasTurkishChars) {
    return 'tr-TR'
  }
  return 'en-US'
}

const getVoice = (lang: string) => {
  const voices = window.speechSynthesis.getVoices()
  
  if (lang === 'tr-TR') {
    return voices.find(voice => voice.lang === 'tr-TR') || voices[0]
  }
  
  // İngilizce için en iyi sesi seç
  return voices.find(voice => 
    voice.lang === 'en-US' && 
    (voice.name.includes('Google') || voice.name.includes('Daniel'))
  ) || voices.find(voice => voice.lang === 'en-US') || voices[0]
}

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported')
      return
    }

    // Önceki konuşmayı durdur
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Metne göre dili otomatik belirles
    const lang = detectLanguage(text)
    utterance.lang = lang
    
    // Sesi yükle
    window.speechSynthesis.onvoiceschanged = () => {
      utterance.voice = getVoice(lang)
    }
    
    // Ses ayarları
    utterance.pitch = 1
    utterance.rate = 1
    utterance.volume = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
} 
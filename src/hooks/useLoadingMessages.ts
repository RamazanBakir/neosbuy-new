import { useState, useEffect } from 'react'
import { useTypingAnimation } from './useTypingAnimation'

const loadingMessages = [
  // Kullanıcı Dostu Mesajlar
  "NeosBuy, senin için harika seçenekleri araştırıyor...",
  "Biraz bekle, sana en iyi ürünleri sunmak için çalışıyoruz!",
  "Aradığını bulmak için algoritmalarımız hummalı bir şekilde iş başında!",
  "NeosBuy, senin için en uygun fırsatları tarıyor...",
  "En iyi seçenekler bir tık uzakta, hemen geliyor!",
  "Senin için en doğru sonuçları hazırlıyoruz, lütfen bekle.",
  "NeosBuy sihirli bir şekilde en iyi teklifleri bir araya getiriyor...",
  "Sabırla beklediğin an geldi, az kaldı!",
  "En güzel fırsatlar yolda, birkaç saniye daha sabret.",
  "NeosBuy'un öneri motoru tam gaz çalışıyor!",

  // Eğlenceli ve Esprili Mesajlar
  "Sana özel ürünler için NeosBuy gece gündüz çalışıyor!",
  "NeosBuy radarları en iyi fırsatları tarıyor...",
  "Biraz sihirli bir dokunuşla, en iyi ürünler geliyor!",
  "Düşündüğünden hızlı! NeosBuy tam gaz ilerliyor.",
  "Bekle, sana en uygun ürünler için yıldızlara bile baktık!",
  "Yüzlerce seçenekten en iyisini süzüyoruz, sabırlı ol.",
  "NeosBuy önerileri sıralıyor, son dokunuşlar yapılıyor.",
  "Birkaç saniye içinde en iyi seçenekler önünde olacak!",
  "NeosBuy makinesi çalışıyor, en iyi sonuçlar yolda.",
  "Biraz daha sabır, en uygun ürünleri keşfetmek üzereyiz.",

  // Motive Edici ve Profesyonel Mesajlar
  "NeosBuy her zaman en iyi ürünleri sunmayı hedefliyor, az kaldı.",
  "Senin için özelleştirilmiş öneriler hazırlıyoruz, sabırlı ol.",
  "Güvenilir sonuçlar hazırlıyoruz, hemen dönüyoruz.",
  "Aradığın ürünlere ulaşmana çok az kaldı!",
  "Senin için en uygun teklifleri sıralamak için son dokunuşlar yapılıyor."
]

export const useLoadingMessages = () => {
  const [currentMessage, setCurrentMessage] = useState(() => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  })
  const { displayedMessage, isComplete } = useTypingAnimation(currentMessage, 70)

  useEffect(() => {
    if (!isComplete) return

    const timeout = setTimeout(() => {
      const currentIndex = loadingMessages.indexOf(currentMessage)
      const nextIndex = Math.floor(Math.random() * loadingMessages.length)
      setCurrentMessage(loadingMessages[nextIndex])
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isComplete, currentMessage])

  return displayedMessage
} 
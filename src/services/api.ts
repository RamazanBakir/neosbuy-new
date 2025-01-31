import { supabase } from "../lib/supabase"

{/*  
const API_ENDPOINTS = {
  SEARCH: 'api/search' // Gerçek endpoint'i gizliyoruz
}
// TODO proxy olan geçici kapalı reel prod. deployment sonrasında düzenlenecek
const API_BASE_URL = import.meta.env.PROD
    ? '/api/search'  // Production URL
    : '/api/search'  // Development URL (proxy through Vite)
*/}
// Doğrudan Supabase URL'sini kullanalım
const API_BASE_URL = 'https://ixyuablustlfypjnjhpw.supabase.co/functions/v1/gemini-chat'

const handleAuthError = async (error: any) => {
  if (error.status === 401) {
    // Token geçersiz veya expire olmuş
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  throw error
}

export const searchProducts = async (query: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      // Session yoksa önce localStorage'dan kontrol et
      const savedSession = localStorage.getItem('supabase_session')
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession)
        // Session'ı yenile
        const { data: { session: refreshedSession } } = 
          await supabase.auth.setSession({
            access_token: parsedSession.access_token,
            refresh_token: parsedSession.refresh_token
          })
        
        if (refreshedSession) {
          localStorage.setItem('supabase_session', JSON.stringify(refreshedSession))
          return makeApiCall(query, refreshedSession.access_token)
        }
      }
      throw new Error('No active session')
    }

    return makeApiCall(query, session.access_token)
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}

const makeApiCall = async (query: string, accessToken: string) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ q: query })
  })

  if (!response.ok) {
    if (response.status === 401) {
      return handleAuthError(response)
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
} 
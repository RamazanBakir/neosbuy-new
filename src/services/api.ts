import { supabase } from "../lib/supabase"

{/*  
const API_ENDPOINTS = {
  SEARCH: 'api/search' // Gerçek endpoint'i gizliyoruz
}
*/}
const API_BASE_URL = import.meta.env.PROD
  ? '/api/search'  // Production URL
  : '/api/search'  // Development URL (proxy through Vite)

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
    const accessToken = session?.access_token

    if (!accessToken) {
      throw new Error('Unauthorized')
    }

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
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
} 
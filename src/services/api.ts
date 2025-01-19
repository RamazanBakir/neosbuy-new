{/*  
const API_ENDPOINTS = {
  SEARCH: 'api/search' // Gerçek endpoint'i gizliyoruz
}
*/}
const API_BASE_URL = '/api/search' // Proxy URL'i kullanıyoruz
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eXVhYmx1c3RsZnlwam5qaHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNzE5MTUsImV4cCI6MjA1MTk0NzkxNX0.fGcTpTRp4A7ivAn8CZRxDKly3acG-ofYN50dOJVDZ9A'

export const searchProducts = async (query: string) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ q: query })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
} 
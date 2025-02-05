import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL parameters
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          
          if (data?.session) {
            localStorage.setItem('access_token', data.session.access_token)
            
            // Session'ın tam olarak oluşmasını bekleyelim
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Session'ı tekrar kontrol edelim
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            if (currentSession) {
              navigate('/')
            }
          }
        }

        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session) {
          navigate('/')
        }
      } catch (error) {
        console.error('Error during auth callback:', error)
        navigate('/')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Giriş yapılıyor...</h2>
        <p className="text-gray-600">Lütfen bekleyin, yönlendiriliyorsunuz.</p>
      </div>
    </div>
  )
} 
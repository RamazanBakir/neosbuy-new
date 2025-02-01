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
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
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
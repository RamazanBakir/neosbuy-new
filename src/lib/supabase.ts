import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key tanımlanmamış!')
}

// Dinamik olarak mevcut URL'i al
const getCurrentURL = () => {
  return window.location.origin
}

// Callback URL'ini oluştur
const getCallbackURL = () => {
  return `${getCurrentURL()}/auth/callback`
}

// Oturum bilgilerini localStorage'a kaydet
const saveSessionToStorage = (session: any) => {
  if (session) {
    localStorage.setItem('supabase.auth.token', JSON.stringify(session))
  }
}

// Oturum bilgilerini localStorage'dan al
const getSessionFromStorage = () => {
  try {
    const storedSession = localStorage.getItem('supabase.auth.token')
    if (storedSession) {
      return JSON.parse(storedSession)
    }
  } catch (err) {
    console.error('Error getting session from storage:', err)
  }
  return null
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Optional: Add error event listener for debugging in production
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event)
  if (event === 'SIGNED_OUT') {
    console.log('User signed out')
    localStorage.removeItem('supabase.auth.token')
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user)
    if (session) {
      saveSessionToStorage(session)
    }
  }
})

// Export the redirect URL and sign-in function for use in auth components
export const getRedirectURL = () => {
  const origin = window.location.origin
  return origin
}

export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in with redirect URL:', getCallbackURL())
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getCallbackURL(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) {
      console.error('Google SignIn error:', error)
      return { error: error.message }
    }
    
    console.log('Google sign-in initiated successfully')
    return { error: null }
  } catch (err) {
    console.error('Unexpected error during Google signin:', err)
    return { error: 'Beklenmeyen bir hata oluştu' }
  }
}
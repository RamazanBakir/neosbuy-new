import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getRedirectURL } from '../lib/supabase'
import { SHA256 } from 'crypto-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const hashPassword = (password: string) => {
    return SHA256(password).toString()
  }

  const signUp = async (email: string, password: string) => {
    try {
      const hashedPassword = hashPassword(password)
      const { error } = await supabase.auth.signUp({
        email,
        password: hashedPassword
      })
      if (error) {
        console.error('SignUp error:', error)
        return { error: error.message }
      }
      return { error: null }
    } catch (err) {
      console.error('Unexpected error during signup:', err)
      return { error: 'Beklenmeyen bir hata oluştu' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const hashedPassword = hashPassword(password)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: hashedPassword
      })

      if (error) {
        console.error('SignIn error:', error)
        return { error: error.message }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Unexpected error during signin:', err)
      return { error: 'Beklenmeyen bir hata oluştu' }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('chat_sessions')
    localStorage.removeItem('active_session_id')
    localStorage.removeItem('slide_states')
    localStorage.removeItem('view_modes')
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getRedirectURL()}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
          flowType: 'pkce'
        }
      })
      
      if (error) {
        console.error('Google SignIn error:', error)
        return { error: error.message }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Unexpected error during Google signin:', err)
      return { error: 'Beklenmeyen bir hata oluştu' }
    }
  }
  
  

  const value = useMemo(() => ({
    user,
    loading,
    signUp,
    signIn,
    signOut: logout,
    signInWithGoogle
  }), [user, loading]) // eslint-disable-line react-hooks/exhaustive-deps için bunların belirtilmesi gerekiyor

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
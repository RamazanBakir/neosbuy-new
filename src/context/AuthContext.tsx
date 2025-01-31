import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { SHA256 } from 'crypto-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(() => {
    // İlk yüklemede localStorage'dan session'ı al
    const savedSession = localStorage.getItem('supabase_session')
    return savedSession ? JSON.parse(savedSession) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // İlk yüklemede session kontrolü
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
        setUser(session.user)
        localStorage.setItem('supabase_session', JSON.stringify(session))
      }
      setLoading(false)
    })

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setSession(session)
        setUser(session.user)
        localStorage.setItem('supabase_session', JSON.stringify(session))
      } else {
        setSession(null)
        setUser(null)
        localStorage.removeItem('supabase_session')
      }
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
      const response = await fetch("https://ixyuablustlfypjnjhpw.supabase.co/functions/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Giriş yapılamadı");
      }
  
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
        
        setSession(data.session)
        setUser(data.user)
        localStorage.setItem('supabase_session', JSON.stringify(data.session))
      }
  
      return { error: null };
    } catch (error) {
      console.error("Login Failed:", error);
      return { error: error instanceof Error ? error.message : 'Unexpected Error ' };
    }
  };
  

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
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

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  }

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
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
  userSessions: string[]
  fetchSessionHistory: (sessionId: string) => Promise<any>
  sessionHistories: Record<string, any>
  fetchAllSessionHistories: () => Promise<Record<string, any> | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userSessions, setUserSessions] = useState<string[]>([])
  const [sessionHistories, setSessionHistories] = useState<Record<string, any>>({})

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Kullanıcı giriş yaptığında tüm session ve history'leri çek
        fetchUserSessions(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_IN' && session?.user) {
        // Auth state değiştiğinde de çek
        await fetchUserSessions(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserSessions = async (userId: string) => {
    try {
      // Tüm session'ları çek
      const { data: sessions, error } = await supabase
        .from('chats')
        .select('session_id, history')  // history'yi de birlikte çek
        .eq('user_id', userId)

      if (error) throw error

      // Session ID'leri ayarla
      setUserSessions(sessions.map(s => s.session_id))

      // History'leri ayarla
      const histories: Record<string, any> = {}
      sessions.forEach(session => {
        histories[session.session_id] = session.history
      })
      setSessionHistories(histories)

      return sessions
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      return []
    }
  }

  const fetchSessionHistory = async (sessionId: string) => {
    try {
      console.log('Fetching history for session:', sessionId)
      
      const { data, error } = await supabase
        .from('chats')
        .select('history')
        .eq('user_id', user?.id)
        .eq('session_id', sessionId)
        .single()

      console.log('History response:', { data, error })

      if (error) throw error
      setSessionHistories({ [sessionId]: data?.history })
      return data?.history
    } catch (error) {
      console.error('Error fetching session history:', error)
      return null
    }
  }

  const fetchAllSessionHistories = async () => {
    try {
      if (!user) return

      const { data: sessions, error: sessionsError } = await supabase
        .from('chats')
        .select('session_id')
        .eq('user_id', user.id)

      if (sessionsError) throw sessionsError

      const histories: Record<string, any> = {}
      
      for (const session of sessions) {
        const { data, error } = await supabase
          .from('chats')
          .select('history')
          .eq('user_id', user.id)
          .eq('session_id', session.session_id)
          .single()

        if (error) {
          console.error(`Error fetching history for session ${session.session_id}:`, error)
          continue
        }

        histories[session.session_id] = data?.history
      }

      setSessionHistories(histories)
      return histories
    } catch (error) {
      console.error('Error fetching all session histories:', error)
      return null
    }
  }

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

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getRedirectURL()}/auth/callback`
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
    signOut,
    signInWithGoogle,
    userSessions,
    fetchSessionHistory,
    sessionHistories,
    fetchAllSessionHistories
  }), [user, loading, userSessions, sessionHistories]) // eslint-disable-line react-hooks/exhaustive-deps için bunların belirtilmesi gerekiyor

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
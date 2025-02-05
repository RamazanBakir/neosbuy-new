import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// More detailed error message
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}
if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

const redirectURL = import.meta.env.MODE === 'production' 
  ? 'https://neosbuy.app/auth/callback'
  : 'http://localhost:5173/auth/callback'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  }
})

// Optional: Add error event listener for debugging in production
supabase.auth.onAuthStateChange((event, _session) => {
  console.log('Supabase auth event:', event)
  if (event === 'SIGNED_OUT') {
    console.log('User signed out')
  }
})

// Export the redirect URL and sign-in function for use in auth components
export const getRedirectURL = () => redirectURL

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectURL
    }
  })
  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}
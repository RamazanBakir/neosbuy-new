import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key tanımlanmamış!')
}

// URL formatını kontrol et
try {
  new URL(supabaseUrl)
} catch (e) {
  throw new Error('Geçersiz Supabase URL formatı! URL https:// ile başlamalı.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
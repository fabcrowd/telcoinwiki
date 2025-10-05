import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type EnvKey = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'

const getEnv = (key: EnvKey): string => {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

const createSupabaseClient = (): SupabaseClient => {
  const url = getEnv('VITE_SUPABASE_URL')
  const anonKey = getEnv('VITE_SUPABASE_ANON_KEY')

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  })
}

let client: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (!client) {
    client = createSupabaseClient()
  }

  return client
}

export const supabaseClient = getSupabaseClient()

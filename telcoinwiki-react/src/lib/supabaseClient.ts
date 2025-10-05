import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type EnvKey = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'

let client: SupabaseClient | null = null
let initializationError: Error | null = null

const getEnv = (key: EnvKey): string | null => {
  const value = import.meta.env[key]
  return value ? String(value) : null
}

const createSupabaseClient = (): SupabaseClient => {
  const url = getEnv('VITE_SUPABASE_URL')
  const anonKey = getEnv('VITE_SUPABASE_ANON_KEY')

  if (!url || !anonKey) {
    throw new Error('Supabase client is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  })
}

export const getSupabaseClient = (): SupabaseClient => {
  if (client) {
    return client
  }

  client = createSupabaseClient()
  initializationError = null
  return client
}

export const tryGetSupabaseClient = (): SupabaseClient | null => {
  try {
    return getSupabaseClient()
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error(String(error))
    client = null
    return null
  }
}

export const getSupabaseInitializationError = (): Error | null => initializationError

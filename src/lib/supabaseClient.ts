import { createClient } from '@supabase/supabase-js'

export const AUTH_ACCESS_TOKEN_COOKIE = 'auth-access-token'
export const AUTH_REFRESH_TOKEN_COOKIE = 'auth-refresh-token'

export const authCookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production'
}

export interface SupabaseClientConfig {
  url?: string
  serviceRoleKey?: string
}

export interface SupabaseTableQuery<TRecord = unknown> {
  select: (columns?: string) => Promise<TRecord[]>
  insert: (payload: Partial<TRecord> | Array<Partial<TRecord>>) => Promise<TRecord[]>
  update: (payload: Partial<TRecord>) => SupabaseTableQuery<TRecord>
  delete: () => Promise<{ deleted: boolean }>
  eq: (column: string, value: unknown) => SupabaseTableQuery<TRecord>
  single: () => Promise<TRecord | null>
}

export interface SupabaseClientContract {
  from: <TRecord = unknown>(table: string) => SupabaseTableQuery<TRecord>
}

const normalizeEnvValue = (value?: string): string => {
  if (!value) {
    return ''
  }

  const trimmed = value.trim()
  return trimmed.replace(/^['\"]|['\"]$/g, '')
}

const getBackendSupabaseEnv = () => {
  const url = normalizeEnvValue(process.env.SUPABASE_URL)
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (!url || !serviceRoleKey) {
    throw new Error('Faltan las variables de entorno de Supabase para el backend.')
  }

  return { url, serviceRoleKey }
}

const getServerAuthEnv = () => {
  const url = normalizeEnvValue(process.env.SUPABASE_URL)
  const serverAnonKey = normalizeEnvValue(process.env.SUPABASE_ANON_KEY)
  const publicAnonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const authKey = serverAnonKey || publicAnonKey

  if (!url || !authKey) {
    throw new Error('Faltan las variables de entorno de Supabase.')
  }

  return { url, authKey }
}

export const createBackendSupabaseClient = () => {
  const { url, serviceRoleKey } = getBackendSupabaseEnv()
  return createClient(url, serviceRoleKey)
}

export const createSupabaseServerAuthClient = () => {
  const { url, authKey } = getServerAuthEnv()
  return createClient(url, authKey)
}

export const verifyAccessToken = async (accessToken: string): Promise<boolean> => {
  const supabase = createSupabaseServerAuthClient()

  const { data, error } = await supabase.auth.getUser(accessToken)
  return Boolean(data.user && !error)
}

export const getSupabase = () => createBackendSupabaseClient()
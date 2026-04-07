import { createBackendSupabaseClient } from '@/src/lib/supabaseClient'
import type { Presupuesto, CreatePresupuestoInput, UpdatePresupuestoInput } from './presupuesto.schema'

const TABLE = 'presupuestos'

export async function findAll(userId: string): Promise<Presupuesto[]> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('fecha_inicio', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function findById(userId: string, id: string): Promise<Presupuesto | null> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(error.message)
  return data
}

export async function insert(
  userId: string,
  input: CreatePresupuestoInput
): Promise<Presupuesto> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...input, user_id: userId, fecha_fin: input.fecha_fin ?? null })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function update(
  userId: string,
  id: string,
  input: UpdatePresupuestoInput
): Promise<Presupuesto> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function remove(userId: string, id: string): Promise<void> {
  const supabase = createBackendSupabaseClient()
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
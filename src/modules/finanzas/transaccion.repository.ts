import { createBackendSupabaseClient } from '@/src/lib/supabaseClient'
import type { Transaccion, CreateTransaccionInput, UpdateTransaccionInput } from './transaccion.schema'

function toTransaccion(row: any): Transaccion {
  return {
    id: row.id,
    user_id: row.user_id,
    cartera_id: row.cartera_id ?? null,
    presupuesto_id: row.presupuesto_id ?? null,
    categoria_id: row.categoria_id ?? null,
    tipo: row.tipo,
    monto: row.monto,
    descripcion: row.descripcion,
    fecha: row.fecha,
    created_at: row.created_at
  }
}

export async function findAll(userId: string): Promise<Transaccion[]> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toTransaccion)
}

export async function findAllCategorias(): Promise<{ id: string; nombre: string }[]> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre')
    .order('nombre', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function findAllPresupuestos(userId: string): Promise<{ id: string; nombre: string }[]> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('presupuestos')
    .select('id, nombre')
    .eq('user_id', userId)
    .order('nombre', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function findById(id: string): Promise<Transaccion | null> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return toTransaccion(data)
}

export async function insert(userId: string, input: CreateTransaccionInput): Promise<Transaccion> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .insert({
      user_id: userId,
      descripcion: input.descripcion,
      monto: input.monto,
      fecha: input.fecha,
      tipo: input.tipo,
      cartera_id: input.cartera_id ?? null,
      presupuesto_id: input.presupuesto_id ?? null,
      categoria_id: input.categoria_id ?? null
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return toTransaccion(data)
}

export async function update(id: string, input: Partial<UpdateTransaccionInput>): Promise<Transaccion> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .update({
      ...(input.descripcion !== undefined && { descripcion: input.descripcion }),
      ...(input.monto !== undefined && { monto: input.monto }),
      ...(input.fecha !== undefined && { fecha: input.fecha }),
      ...(input.tipo !== undefined && { tipo: input.tipo }),
      ...(input.cartera_id !== undefined && { cartera_id: input.cartera_id }),
      ...(input.presupuesto_id !== undefined && { presupuesto_id: input.presupuesto_id }),
      ...(input.categoria_id !== undefined && { categoria_id: input.categoria_id })
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return toTransaccion(data)
}

export async function remove(id: string): Promise<void> {
  const supabase = createBackendSupabaseClient()
  const { error } = await supabase
    .from('transacciones')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
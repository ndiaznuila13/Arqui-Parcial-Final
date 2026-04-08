'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  AUTH_ACCESS_TOKEN_COOKIE,
  createSupabaseServerAuthClient
} from '../../lib/supabaseClient'
import type { ServiceResult } from '../../shared/types/common'
import type { Presupuesto, CreatePresupuestoInput, UpdatePresupuestoInput } from './presupuesto.schema'
import * as presupuestoService from './presupuesto.service'

async function getUserId(): Promise<string> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value
  if (!accessToken) throw new Error('No autenticado')

  const supabase = createSupabaseServerAuthClient()
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) throw new Error('Sesión inválida')

  return data.user.id
}

export async function listarPresupuestosAction(): Promise<ServiceResult<Presupuesto[]>> {
  try {
    const userId = await getUserId()
    return presupuestoService.listar(userId)
  } catch {
    return { ok: false, message: 'Sesión no válida.' }
  }
}

export async function crearPresupuestoAction(
  input: CreatePresupuestoInput
): Promise<ServiceResult<Presupuesto>> {
  try {
    const userId = await getUserId()
    const result = await presupuestoService.crear(userId, input)
    if (result.ok) revalidatePath('/presupuestos')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado.' }
  }
}

export async function actualizarPresupuestoAction(
  id: string,
  input: UpdatePresupuestoInput
): Promise<ServiceResult<Presupuesto>> {
  try {
    const userId = await getUserId()
    const result = await presupuestoService.actualizar(userId, id, input)
    if (result.ok) revalidatePath('/presupuestos')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado.' }
  }
}

export async function eliminarPresupuestoAction(
  id: string
): Promise<ServiceResult<void>> {
  try {
    const userId = await getUserId()
    const result = await presupuestoService.eliminar(userId, id)
    if (result.ok) revalidatePath('/presupuestos')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado.' }
  }
}
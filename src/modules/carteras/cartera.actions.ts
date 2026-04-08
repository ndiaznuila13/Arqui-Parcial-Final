'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  AUTH_ACCESS_TOKEN_COOKIE,
  createSupabaseServerAuthClient
} from '../../lib/supabaseClient'
import type { ServiceResult } from '../../shared/types/common'
import type { Cartera, CreateCarteraInput, UpdateCarteraInput } from './cartera.schema'
import * as carteraService from './cartera.service'

async function getUserId(): Promise<string> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value
  if (!accessToken) throw new Error('No autenticado')

  const supabase = createSupabaseServerAuthClient()
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) throw new Error('Sesión inválida')

  return data.user.id
}

export async function listarCarterasAction(): Promise<ServiceResult<Cartera[]>> {
  try {
    const userId = await getUserId()
    return carteraService.listar(userId)
  } catch {
    return { ok: false, message: 'Sesión no válida' }
  }
}

export async function crearCarteraAction(
  input: CreateCarteraInput
): Promise<ServiceResult<Cartera>> {
  try {
    const userId = await getUserId()
    const result = await carteraService.crear(userId, input)
    if (result.ok) revalidatePath('/carteras')
    return result
  } catch (e) {
    return { ok: false, message: 'Error inesperado' }
  }
}

export async function actualizarCarteraAction(
  id: string,
  input: Partial<UpdateCarteraInput>
): Promise<ServiceResult<Cartera>> {
  try {
    const userId = await getUserId()
    const result = await carteraService.actualizar(id, userId, input)
    if (result.ok) revalidatePath('/carteras')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado' }
  }
}

export async function eliminarCarteraAction(
  id: string
): Promise<ServiceResult<void>> {
  try {
    const result = await carteraService.eliminar(id)
    if (result.ok) revalidatePath('/carteras')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado' }
  }
}
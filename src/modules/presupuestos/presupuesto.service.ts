import type { ServiceResult } from '../../shared/types/common'
import type {
  Presupuesto,
  CreatePresupuestoInput,
  UpdatePresupuestoInput
} from './presupuesto.schema'
import {
  validateCreatePresupuesto,
  validateUpdatePresupuesto
} from './presupuesto.schema'
import * as presupuestoRepository from './presupuesto.repository'
import * as transaccionRepository from '../finanzas/transaccion.repository'

// Detecta si dos rangos de fechas se superponen.
// Un rango con fecha_fin null se extiende indefinidamente.
function datesOverlap(
  start1: string, end1: string | null,
  start2: string, end2: string | null
): boolean {
  const end1AfterStart2 = !end1 || end1 >= start2
  const end2AfterStart1 = !end2 || end2 >= start1
  return end1AfterStart2 && end2AfterStart1
}

async function findOverlapping(
  userId: string,
  fechaInicio: string,
  fechaFin: string | null,
  excludeId?: string
): Promise<Presupuesto[]> {
  const all = await presupuestoRepository.findAll(userId)
  return all.filter((p) => {
    if (excludeId && p.id === excludeId) return false
    return datesOverlap(fechaInicio, fechaFin, p.fecha_inicio, p.fecha_fin)
  })
}

export async function listar(userId: string): Promise<ServiceResult<Presupuesto[]>> {
  try {
    const [presupuestos, transacciones] = await Promise.all([
      presupuestoRepository.findAll(userId),
      transaccionRepository.findAll(userId)
    ])

    const consumidoPorPresupuesto = transacciones.reduce<Record<string, number>>((acc, tx) => {
      if (!tx.presupuesto_id || tx.tipo !== 'gasto') return acc
      const actual = acc[tx.presupuesto_id] ?? 0
      acc[tx.presupuesto_id] = actual + Math.abs(tx.monto)
      return acc
    }, {})

    const data = presupuestos.map((p) => ({
      ...p,
      monto_consumido: consumidoPorPresupuesto[p.id] ?? 0
    }))

    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudieron cargar los presupuestos.' }
  }
}

export async function obtenerPorId(
  userId: string,
  id: string
): Promise<ServiceResult<Presupuesto | null>> {
  try {
    const data = await presupuestoRepository.findById(userId, id)
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudo obtener el presupuesto.' }
  }
}

export async function crear(
  userId: string,
  payload: unknown
): Promise<ServiceResult<Presupuesto>> {
  const validation = validateCreatePresupuesto(payload)
  if (!validation.success)
    return { ok: false, message: validation.errors.join(' ') }

  const { nombre, monto_limite, fecha_inicio, fecha_fin } = validation.data

  try {
    const overlapping = await findOverlapping(userId, fecha_inicio, fecha_fin ?? null)
    if (overlapping.length > 0) {
      const o = overlapping[0]
      return {
        ok: false,
        message: `Ya existe un presupuesto que se superpone con estas fechas. Rango: ${o.fecha_inicio} a ${o.fecha_fin ?? 'indefinido'}`
      }
    }

    const data = await presupuestoRepository.insert(userId, {
      nombre, monto_limite, fecha_inicio, fecha_fin
    })
    return { ok: true, data, message: 'Presupuesto creado exitosamente.' }
  } catch {
    return { ok: false, message: 'No se pudo crear el presupuesto.' }
  }
}

export async function actualizar(
  userId: string,
  id: string,
  payload: unknown
): Promise<ServiceResult<Presupuesto>> {
  const validation = validateUpdatePresupuesto(payload)
  if (!validation.success)
    return { ok: false, message: validation.errors.join(' ') }

  try {
    const existing = await presupuestoRepository.findById(userId, id)
    if (!existing)
      return { ok: false, message: 'El presupuesto no existe o no tienes acceso.' }

    const newFechaInicio = validation.data.fecha_inicio ?? existing.fecha_inicio
    const newFechaFin = validation.data.fecha_fin !== undefined
      ? validation.data.fecha_fin
      : existing.fecha_fin

    const overlapping = await findOverlapping(userId, newFechaInicio, newFechaFin, id)
    if (overlapping.length > 0) {
      const o = overlapping[0]
      return {
        ok: false,
        message: `Ya existe otro presupuesto que se superpone con estas fechas. Rango: ${o.fecha_inicio} a ${o.fecha_fin ?? 'indefinido'}`
      }
    }

    const data = await presupuestoRepository.update(userId, id, validation.data)
    return { ok: true, data, message: 'Presupuesto actualizado exitosamente.' }
  } catch {
    return { ok: false, message: 'No se pudo actualizar el presupuesto.' }
  }
}

export async function eliminar(
  userId: string,
  id: string
): Promise<ServiceResult<void>> {
  try {
    await presupuestoRepository.remove(userId, id)
    return { ok: true, data: undefined, message: 'Presupuesto eliminado exitosamente.' }
  } catch {
    return { ok: false, message: 'No se pudo eliminar el presupuesto.' }
  }
}
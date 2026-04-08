import type { ServiceResult } from '../../shared/types/common'

// Tipos de dominio
export interface Presupuesto {
  id: string
  user_id: string
  nombre: string
  monto_limite: number
  fecha_inicio: string
  fecha_fin: string | null
  created_at?: string
}

export interface CreatePresupuestoInput {
  nombre: string
  monto_limite: number
  fecha_inicio: string
  fecha_fin?: string | null
}

export interface UpdatePresupuestoInput {
  nombre?: string
  monto_limite?: number
  fecha_inicio?: string
  fecha_fin?: string | null
}

// Tipos visuales
export interface PresupuestoVisuals {
  icon: string
  iconBg: string
}

export interface PresupuestoSummary extends PresupuestoVisuals {
  id: string
  nombre: string
  monto_limite: number
  monto_consumido: number
  fecha_inicio: string
  fecha_fin: string | null
}

// Helpers de fecha
export function formatPresupuestoDate(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function isValidDateFormat(date: string): boolean {
  if (!date || typeof date !== 'string') return false
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

export function isValidDate(dateStr: string): boolean {
  if (!isValidDateFormat(dateStr)) return false
  const date = new Date(`${dateStr}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

export function isValidDateRange(
  fechaInicio: string,
  fechaFin: string | null | undefined
): boolean {
  if (!fechaFin) return true
  if (!isValidDate(fechaFin)) return false
  return fechaFin >= fechaInicio
}

// Helpers visuales
export function getPresupuestoVisuals(nombre: string): PresupuestoVisuals {
  const n = nombre.toLowerCase()
  if (n.includes('aliment'))
    return { icon: 'restaurant', iconBg: 'bg-primary bg-opacity-10 text-primary' }
  if (n.includes('transport'))
    return { icon: 'directions_car', iconBg: 'bg-warning bg-opacity-25 text-warning-emphasis' }
  if (n.includes('entreten'))
    return { icon: 'movie', iconBg: 'bg-danger bg-opacity-10 text-danger' }
  if (n.includes('hogar') || n.includes('servicio'))
    return { icon: 'bolt', iconBg: 'bg-info bg-opacity-10 text-info' }
  return { icon: 'calendar_month', iconBg: 'bg-primary bg-opacity-10 text-primary' }
}

export function toPresupuestoSummary(
  p: Presupuesto & { monto_consumido?: number | null }
): PresupuestoSummary {
  return {
    id: p.id,
    nombre: p.nombre,
    monto_limite: p.monto_limite,
    monto_consumido: Number(p.monto_consumido ?? 0),
    fecha_inicio: p.fecha_inicio,
    fecha_fin: p.fecha_fin,
    ...getPresupuestoVisuals(p.nombre)
  }
}

// Validadores
export interface ValidationSuccess<T> {
  success: true
  data: T
}

export interface ValidationFailure {
  success: false
  errors: string[]
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

export function validateCreatePresupuesto(
  payload: unknown
): ValidationResult<CreatePresupuestoInput> {
  const errors: string[] = []
  if (!payload || typeof payload !== 'object')
    return { success: false, errors: ['El payload debe ser un objeto.'] }

  const p = payload as Record<string, unknown>

  const nombre = String(p.nombre ?? '').trim()
  if (!nombre) errors.push('El nombre del presupuesto es requerido.')

  const monto_limite = Number(p.monto_limite ?? 0)
  if (!Number.isFinite(monto_limite) || monto_limite <= 0)
    errors.push('El monto límite debe ser un número mayor a 0.')

  const fecha_inicio = String(p.fecha_inicio ?? '').trim()
  if (!fecha_inicio) errors.push('La fecha de inicio es requerida.')
  else if (!isValidDate(fecha_inicio))
    errors.push('La fecha de inicio debe estar en formato YYYY-MM-DD.')

  const fecha_fin = p.fecha_fin ? String(p.fecha_fin).trim() : null
  if (fecha_fin && !isValidDate(fecha_fin))
    errors.push('La fecha de fin debe estar en formato YYYY-MM-DD.')

  if (fecha_inicio && !isValidDateRange(fecha_inicio, fecha_fin))
    errors.push('La fecha de fin no puede ser anterior a la fecha de inicio.')

  if (errors.length > 0) return { success: false, errors }

  return { success: true, data: { nombre, monto_limite, fecha_inicio, fecha_fin } }
}

export function validateUpdatePresupuesto(
  payload: unknown
): ValidationResult<UpdatePresupuestoInput> {
  const errors: string[] = []
  if (!payload || typeof payload !== 'object')
    return { success: false, errors: ['El payload debe ser un objeto.'] }

  const p = payload as Record<string, unknown>
  const result: UpdatePresupuestoInput = {}

  if (p.nombre !== undefined) {
    const nombre = String(p.nombre ?? '').trim()
    if (!nombre) errors.push('El nombre no puede estar vacío.')
    else result.nombre = nombre
  }

  if (p.monto_limite !== undefined) {
    const monto_limite = Number(p.monto_limite ?? 0)
    if (!Number.isFinite(monto_limite) || monto_limite <= 0)
      errors.push('El monto límite debe ser un número mayor a 0.')
    else result.monto_limite = monto_limite
  }

  if (p.fecha_inicio !== undefined) {
    const fecha_inicio = String(p.fecha_inicio ?? '').trim()
    if (!fecha_inicio) errors.push('La fecha de inicio no puede estar vacía.')
    else if (!isValidDate(fecha_inicio))
      errors.push('La fecha de inicio debe estar en formato YYYY-MM-DD.')
    else result.fecha_inicio = fecha_inicio
  }

  if (p.fecha_fin !== undefined) {
    const fecha_fin = p.fecha_fin ? String(p.fecha_fin).trim() : null
    if (fecha_fin && !isValidDate(fecha_fin))
      errors.push('La fecha de fin debe estar en formato YYYY-MM-DD.')
    else result.fecha_fin = fecha_fin
  }

  const hasDateChange = p.fecha_inicio !== undefined || p.fecha_fin !== undefined
  if (hasDateChange) {
    const fi = result.fecha_inicio ?? (p.fecha_inicio as string)
    const ff = result.fecha_fin ?? (typeof p.fecha_fin === 'string' ? p.fecha_fin : null)
    if (fi && !isValidDateRange(fi, ff))
      errors.push('La fecha de fin no puede ser anterior a la fecha de inicio.')
  }

  if (errors.length > 0) return { success: false, errors }
  return { success: true, data: result }
}
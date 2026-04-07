// Tipos de dominio
export interface Transaccion {
  id: string
  user_id: string
  cartera_id: string 
  presupuesto_id: string | null
  categoria_id: string
  tipo: TransaccionType
  monto: number
  descripcion: string
  fecha: string
  created_at?: string
}

export interface Categoria {
  id: string
  nombre: string 
}

export type TransaccionType = 'ingreso' | 'gasto'
export type TransaccionTab = 'todos' | 'ingresos' | 'gastos'

export interface TransaccionFormState {
  tipo: TransaccionType
  descripcion: string
  monto: string
  fecha: string
  cartera_id: string
  presupuesto_id: string
  categoria_id: string
}

export interface CreateTransaccionInput {
  descripcion: string
  monto: number
  fecha: string
  tipo: TransaccionType
  cartera_id?: string 
  presupuesto_id?: string | null
  categoria_id?: string 
}

export interface UpdateTransaccionInput {
  id: string
  descripcion?: string
  monto?: number
  fecha?: string
  tipo?: TransaccionType
  cartera_id?: string | null
  presupuesto_id?: string | null
  categoria_id?: string | null
}

export interface TransaccionCategoryMeta {
  label: string
  badgeClass: string
  icon: string
}

// Helpers y mappers
const TODAY = (): string => new Date().toISOString().slice(0, 10)

export function toInputDate(value: string | null | undefined): string {
  if (!value) return TODAY()
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? TODAY() : parsed.toISOString().slice(0, 10)
}

export function formatTransaccionDate(value: string | null | undefined): string {
  if (!value) return 'Sin fecha'
  const dateOnly = value.slice(0, 10)
  const date = new Date(`${dateOnly}T00:00:00`)

  if (Number.isNaN(date.getTime())) return dateOnly
  return date.toLocaleDateString('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function getTransaccionCategoryMeta(tx: Transaccion): TransaccionCategoryMeta {
  if (tx.tipo === 'ingreso')
    return { label: 'Ingreso', badgeClass: 'text-bg-success', icon: 'trending_up' }
  return { label: 'Gasto', badgeClass: 'text-bg-warning text-dark', icon: 'receipt_long' }
}


export function getSignedAmount(monto: number, tipo: TransaccionType): number {
  return tipo === 'gasto' ? -Math.abs(monto) : Math.abs(monto)
}

export function getPeriodos(transacciones: Transaccion[]): string[] {
  const periodos = new Set<string>()
  transacciones.forEach((tx) => {
    const fecha = tx.fecha?.slice(0, 7)
    if (fecha) periodos.add(fecha)
  })
  return Array.from(periodos).sort((a, b) => b.localeCompare(a))
}

export function createEmptyForm(): TransaccionFormState {
  return {
    tipo: 'gasto',
    descripcion: '',
    monto: '',
    fecha: TODAY(),
    cartera_id: '',
    presupuesto_id: '',
    categoria_id: ''
  }
}

export function formFromTransaccion(tx: Transaccion | null | undefined): TransaccionFormState {
  const base = createEmptyForm()
  if (!tx) return base
  return {
    ...base,
    descripcion: tx.descripcion ?? '',
    monto: String(Math.abs(Number(tx.monto) || 0)),
    fecha: toInputDate(tx.fecha),
    tipo: tx.tipo,
    cartera_id: tx.cartera_id ?? '',
    presupuesto_id: tx.presupuesto_id ?? '',
    categoria_id: tx.categoria_id ?? ''
  }
}

export function formatPeriodo(periodo: string): string {
  const [year, month] = periodo.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('es-SV', { month: 'long', year: 'numeric' })
}
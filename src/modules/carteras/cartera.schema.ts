// Tipos de dominio
export interface Cartera {
  id: string
  user_id: string
  nombre: string
  balance_inicial: number
  objetivo_cantidad: number
  created_at?: string
}

export interface CarteraOption {
  id: string
  nombre: string
}

export interface CreateCarteraInput {
  nombre: string
  balance_inicial: number
  objetivo_cantidad?: number | null
}

export interface UpdateCarteraInput {
  id: string
  nombre?: string
  balance_inicial?: number
  objetivo_cantidad?: number | null
}

// Tipos visuales
export interface CarteraVisuals {
  icon: string
  iconBg: string
}

export interface CarteraSummary extends CarteraVisuals {
  id: string
  nombre: string
  balance_inicial: number
  objetivo_cantidad: number
}

// Mappers visuales
export function getCarteraVisuals(name: string): CarteraVisuals {
  const normalized = (name ?? '').toLowerCase()
  if (normalized.includes('banco'))
    return { icon: 'account_balance', iconBg: 'bg-secondary bg-opacity-10 text-secondary' }
  if (normalized.includes('efectivo'))
    return { icon: 'savings', iconBg: 'bg-primary bg-opacity-10 text-primary' }
  return { icon: 'account_balance_wallet', iconBg: 'bg-warning bg-opacity-25 text-warning-emphasis' }
}

export function toCarteraSummary(cartera: Cartera): CarteraSummary {
  const visuals = getCarteraVisuals(cartera.nombre)
  return {
    id: cartera.id,
    nombre: cartera.nombre,
    balance_inicial: cartera.balance_inicial,
    objetivo_cantidad: cartera.objetivo_cantidad,
    ...visuals
  }
}
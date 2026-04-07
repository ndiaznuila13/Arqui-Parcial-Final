export type ID = string
export type DomainIdentifier = string | number

// Resultado estándar que devuelven todos los services y actions
export interface ServiceSuccess<T> {
  ok: true
  data: T
  message?: string
}

export interface ServiceFailure {
  ok: false
  message: string
}

export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure

export function formatMoney(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
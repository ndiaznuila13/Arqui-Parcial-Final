'use client'

import type { PresupuestoSummary } from '../presupuesto.schema'
import PresupuestoCard from './PresupuestoCard'
import LoadingSpinner from '@/src/shared/components/LoadingSpinner'

interface PresupuestoListProps {
  presupuestos: PresupuestoSummary[]
  isLoading: boolean
  onEdit: (presupuesto: PresupuestoSummary) => void
  onDelete: (presupuesto: PresupuestoSummary) => void
}

export default function PresupuestoList({
  presupuestos,
  isLoading,
  onEdit,
  onDelete
}: PresupuestoListProps) {
  if (isLoading) {
    return <LoadingSpinner message="Cargando presupuestos..." />
  }

  if (presupuestos.length === 0) {
    return (
      <div className="alert alert-secondary mb-0">
        <p className="mb-2">No hay presupuestos creados.</p>
        <p className="mb-0 small">
          Crea tu primer presupuesto para comenzar a gestionar tus límites de gasto.
        </p>
      </div>
    )
  }

  return (
    <div className="list-group shadow-sm budgets-list">
      {presupuestos.map((p) => (
        <PresupuestoCard
          key={p.id}
          presupuesto={p}
          onEdit={() => onEdit(p)}
          onDelete={() => onDelete(p)}
        />
      ))}
    </div>
  )
}
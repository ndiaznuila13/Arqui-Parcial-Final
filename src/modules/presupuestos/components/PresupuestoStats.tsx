'use client'

import { formatPresupuestoDate } from '../presupuesto.schema'
import type { PresupuestoSummary } from '../presupuesto.schema'

interface PresupuestoStatsProps {
  presupuestos: PresupuestoSummary[]
}

export default function PresupuestoStats({ presupuestos }: PresupuestoStatsProps) {
  const total = presupuestos.reduce((sum, p) => sum + p.monto_limite, 0)

  const proximoVencimiento = presupuestos
    .filter((p) => p.fecha_fin)
    .sort((a, b) => (a.fecha_fin ?? '').localeCompare(b.fecha_fin ?? ''))[0]
    ?.fecha_fin ?? null

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body">
            <p className="small text-secondary mb-1">Total Presupuestado</p>
            <span className="h4 fw-bold mb-0">
              ${total.toLocaleString('es-SV', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body">
            <p className="small text-secondary mb-1">Presupuestos Activos</p>
            <span className="h4 fw-bold mb-0">{presupuestos.length}</span>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body">
            <p className="small text-secondary mb-1">Próximo Vencimiento</p>
            <p className="h6 fw-semibold mb-0">
              {proximoVencimiento
                ? formatPresupuestoDate(proximoVencimiento)
                : 'Sin vencimiento'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
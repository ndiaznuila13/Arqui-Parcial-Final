'use client'

import { useEffect, useRef } from 'react'
import { formatPresupuestoDate } from '../presupuesto.schema'
import type { PresupuestoSummary } from '../presupuesto.schema'
import { usePresupuestoStore } from '../hooks/usePresupuestoStore'

interface PresupuestoCardProps {
  presupuesto: PresupuestoSummary
  onEdit: () => void
  onDelete: () => void
}

export default function PresupuestoCard({
  presupuesto,
  onEdit,
  onDelete
}: PresupuestoCardProps) {
  const { openMenuId, toggleMenu, closeMenu } = usePresupuestoStore()
  const isMenuOpen = openMenuId === presupuesto.id
  const actionsRef = useRef<HTMLDivElement>(null)
  const consumido = Math.max(0, presupuesto.monto_consumido)
  const disponible = presupuesto.monto_limite - consumido
  const progreso = presupuesto.monto_limite > 0
    ? Math.min(100, Math.max(0, (consumido / presupuesto.monto_limite) * 100))
    : 0

  return (
    <div className="list-group-item py-3">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">

        {/* Ícono + nombre + fechas */}
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <div className={`rounded p-2 d-inline-flex align-items-center justify-content-center ${presupuesto.iconBg}`}>
            <span className="material-symbols-outlined">{presupuesto.icon}</span>
          </div>
          <div>
            <h4 className="h6 fw-bold mb-1">{presupuesto.nombre}</h4>
            <p className="mb-0 text-secondary small">
              {formatPresupuestoDate(presupuesto.fecha_inicio)}
              {presupuesto.fecha_fin
                ? ` a ${formatPresupuestoDate(presupuesto.fecha_fin)}`
                : ' (sin vencimiento)'}
            </p>
          </div>
        </div>

        {/* Resumen de consumo */}
        <div className="text-lg-end">
          <p className="small text-secondary mb-1">Límite</p>
          <p className="h5 fw-bold mb-0">
            ${presupuesto.monto_limite.toLocaleString('es-SV', { maximumFractionDigits: 2 })}
          </p>
          <p className="small text-secondary mb-0 mt-1">
            Consumido: ${consumido.toLocaleString('es-SV', { maximumFractionDigits: 2 })}
          </p>
          <p className={`small mb-0 ${disponible < 0 ? 'text-danger' : 'text-secondary'}`}>
            Disponible: ${disponible.toLocaleString('es-SV', { maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Menú acciones */}
        <div className="position-relative" ref={actionsRef}>
          <button
            className="btn btn-link text-secondary p-0"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={() => toggleMenu(presupuesto.id)}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu dropdown-menu-end show budget-actions-menu">
              <button
                className="dropdown-item"
                type="button"
                onClick={() => { closeMenu(); onEdit() }}
              >
                Editar
              </button>
              <button
                className="dropdown-item text-danger"
                type="button"
                onClick={() => { closeMenu(); onDelete() }}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="progress mt-3" role="progressbar" aria-valuenow={progreso} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`progress-bar ${progreso >= 100 ? 'bg-danger' : 'bg-primary'}`}
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  )
}
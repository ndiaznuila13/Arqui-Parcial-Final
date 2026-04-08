'use client'

import { useRef } from 'react'
import type { CarteraSummary } from '../cartera.schema'
import { formatMoney } from '../../../shared/types/common'

interface CarteraCardProps {
  cartera: CarteraSummary
  isMenuOpen: boolean
  onToggleMenu: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function CarteraCard({
  cartera,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete
}: CarteraCardProps) {

  const percent = Math.min(
    100,
    Math.max(0, Math.round((cartera.balance_inicial / cartera.objetivo_cantidad) * 100))
  )

  return (
    <div className="list-group-item py-3">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">

        {/* Ícono + nombre */}
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <div className={`rounded p-2 d-inline-flex align-items-center justify-content-center ${cartera.iconBg}`}>
            <span className="material-symbols-outlined">{cartera.icon}</span>
          </div>
          <div>
            <h4 className="h6 fw-bold mb-1">{cartera.nombre}</h4>
            <p className="mb-0 text-secondary small">Saldo disponible</p>
          </div>
        </div>

        {/* Barra de progreso */}
        {cartera.objetivo_cantidad ? (
          <div className="w-100 w-lg-50">
            <div className="d-flex justify-content-between small mb-2">
              <span className="fw-semibold">${formatMoney(cartera.balance_inicial)}</span>
              <span className="text-secondary">Meta: ${formatMoney(cartera.objetivo_cantidad)}</span>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar bg-primary" style={{ width: `${percent}%` }} />
            </div>
          </div>
        ) : (
          <div className="w-100 w-lg-50">
            <span className="fw-semibold">${formatMoney(cartera.balance_inicial)}</span>
          </div>
        )}

        {/* Menú acciones */}
        <div className="position-relative ms-lg-auto">
          <button
            className="btn btn-link text-secondary p-0"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={onToggleMenu}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu dropdown-menu-end show wallet-actions-menu">
              <button
                className="dropdown-item"
                type="button"
                onClick={onEdit}
              >
                Editar
              </button>
              <button
                className="dropdown-item text-danger"
                type="button"
                onClick={onDelete}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
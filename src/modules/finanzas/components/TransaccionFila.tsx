'use client'

import {useRef } from 'react'
import { formatTransaccionDate, getTransaccionCategoryMeta } from '../transaccion.schema'
import type { Transaccion } from '../transaccion.schema'

interface TransaccionFilaProps {
  transaccion: Transaccion
  carteras: { id: string; nombre: string }[]
  isMenuOpen: boolean
  onToggleMenu: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function TransaccionFila({
  transaccion,
  carteras,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete
}: TransaccionFilaProps) {
  const meta = getTransaccionCategoryMeta(transaccion)
  const isPositive = transaccion.monto >= 0

  // Busca el nombre de la cartera
  const carteraNombre = carteras.find(c => c.id === transaccion.cartera_id)?.nombre ?? 'Sin cartera'

  return (
    <tr>
      <td className="small text-secondary">{formatTransaccionDate(transaccion.fecha)}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div className="transaction-icon-box rounded bg-light d-flex align-items-center justify-content-center text-secondary">
            <span className="material-symbols-outlined fs-6">{meta.icon}</span>
          </div>
          <span className="fw-semibold">{transaccion.descripcion || 'Sin descripción'}</span>
        </div>
      </td>
      <td>
        <span className={`badge rounded-pill ${meta.badgeClass}`}>{meta.label}</span>
      </td>
      <td className="small text-secondary">{carteraNombre}</td>
      <td className={`fw-bold text-end ${isPositive ? 'text-success' : 'text-danger'}`}>
        {isPositive ? '+' : '-'}${Math.abs(transaccion.monto).toFixed(2)}
      </td>
      <td className="tx-actions-col">
        <div className="transaction-actions-wrapper" style={{ position: 'relative' }}>
          <button
            className="btn btn-link text-secondary p-0 d-inline-flex align-items-center justify-content-center tx-actions-trigger"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={onToggleMenu}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu show"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 1000
            }}>
              <button className="dropdown-item" type="button" onClick={onEdit}>
                Editar
              </button>
              <button className="dropdown-item text-danger" type="button" onClick={onDelete}>
                Eliminar
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
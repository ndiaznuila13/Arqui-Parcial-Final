'use client'

import type { MouseEvent } from 'react'
import type { PresupuestoSummary } from '../presupuesto.schema'

interface PresupuestoDeleteModalProps {
  presupuesto: PresupuestoSummary
  onConfirm: () => void
  onClose: () => void
}

export default function PresupuestoDeleteModal({
  presupuesto,
  onConfirm,
  onClose
}: PresupuestoDeleteModalProps) {
  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        style={{ zIndex: 1095 }}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p className="mb-0">
                ¿Seguro que deseas eliminar el presupuesto{' '}
                <span className="fw-semibold">{presupuesto.nombre}</span>?
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Eliminar presupuesto
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1090 }} />
    </>
  )
}
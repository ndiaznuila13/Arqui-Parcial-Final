'use client'

import type { CarteraSummary } from '../cartera.schema'

interface CarteraDeleteModalProps {
  cartera: CarteraSummary
  onConfirm: () => void
  onClose: () => void
}

export default function CarteraDeleteModal({
  cartera,
  onConfirm,
  onClose
}: CarteraDeleteModalProps) {
  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        style={{ zIndex: 1095 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p className="mb-0">
                ¿Seguro que deseas eliminar la cartera{' '}
                <span className="fw-semibold">{cartera.nombre}</span>?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Eliminar cartera
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1090 }} />
    </>
  )
}
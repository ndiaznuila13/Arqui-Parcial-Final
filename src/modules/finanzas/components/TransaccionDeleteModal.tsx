'use client'

import type { MouseEvent } from 'react'
import { formatTransaccionDate } from '../transaccion.schema'
import type { Transaccion } from '../transaccion.schema'

interface TransaccionDeleteModalProps {
  transaccion: Transaccion
  carteras: { id: string; nombre: string }[] 
  onConfirm: () => void
  onClose: () => void
}

export default function TransaccionDeleteModal({
  transaccion,
  carteras,
  onConfirm,
  onClose
}: TransaccionDeleteModalProps) {
  const carteraNombre = carteras.find(c => c.id === transaccion.cartera_id)?.nombre ?? 'Sin cartera'

  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        style={{ zIndex: 1085 }}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Eliminar transacción</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p className="text-secondary mb-3">
                Esta acción eliminará la transacción del historial y no se puede deshacer.
              </p>
              <div className="rounded border bg-light p-3">
                <p className="mb-1 fw-semibold">{transaccion.descripcion || 'Sin descripción'}</p>
                <p className="mb-0 small text-secondary">
                  {formatTransaccionDate(transaccion.fecha)} |{' '}
                  {carteraNombre || 'Sin carteras'} |{' '}
                  <span className={transaccion.monto >= 0 ? 'text-success' : 'text-danger'}>
                    {transaccion.monto >= 0 ? '+' : '-'}${Math.abs(transaccion.monto).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Eliminar transacción
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1080 }} />
    </>
  )
}
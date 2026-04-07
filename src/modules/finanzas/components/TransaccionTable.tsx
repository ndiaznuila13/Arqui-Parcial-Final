'use client'

import { useTransaccionStore } from '../hooks/useTransaccionStore'
import TransaccionFila from './TransaccionFila'
import type { Transaccion } from '../transaccion.schema'
import LoadingSpinner from '@/src/shared/components/LoadingSpinner'

interface TransaccionTableProps {
  transacciones: Transaccion[]
  total: number
  isLoading: boolean
  carteras: { id: string; nombre: string }[]
  onEdit: (transaccion: Transaccion) => void
  onDelete: (transaccion: Transaccion) => void
}

export default function TransaccionTable({
  transacciones,
  total,
  carteras,
  isLoading,
  onEdit,
  onDelete
}: TransaccionTableProps) {
  const { openMenuId, toggleMenu, closeMenu } = useTransaccionStore()

  if (isLoading) {
    return <LoadingSpinner message="Cargando transacciones..." />
  }
  
  return (
    <div className="card border-0 shadow-sm">
      <div className="table-responsive transactions-table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="text-uppercase small text-secondary fw-semibold">Fecha</th>
              <th className="text-uppercase small text-secondary fw-semibold">Descripción</th>
              <th className="text-uppercase small text-secondary fw-semibold">Categoría</th>
              <th className="text-uppercase small text-secondary fw-semibold">Cuenta</th>
              <th className="text-uppercase small text-secondary fw-semibold text-end">Monto</th>
              <th className="text-uppercase small text-secondary fw-semibold text-end tx-actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && transacciones.map((tx) => (
              <TransaccionFila
                key={tx.id}
                transaccion={tx}
                carteras={carteras}
                isMenuOpen={openMenuId === tx.id}
                onToggleMenu={() => toggleMenu(tx.id)}
                onEdit={() => { closeMenu(); onEdit(tx) }}
                onDelete={() => { closeMenu(); onDelete(tx) }}
              />
            ))}
            {!isLoading && transacciones.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  No hay transacciones para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card-footer bg-light d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
        <p className="small text-secondary mb-0">
          Mostrando {transacciones.length} de {total} transacciones
        </p>
        <ul className="pagination pagination-sm mb-0">
          <li className="page-item disabled">
            <button className="page-link" type="button">Anterior</button>
          </li>
          <li className="page-item">
            <button className="page-link" type="button">Siguiente</button>
          </li>
        </ul>
      </div>
    </div>
  )
}
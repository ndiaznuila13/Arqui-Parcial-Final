'use client'

import { useState } from 'react'
import AppLayout from '@/src/shared/components/AppLayout'
import { usePresupuestos } from '@/src/modules/presupuestos/hooks/usePresupuestos'
import { usePresupuestoStore } from '@/src/modules/presupuestos/hooks/usePresupuestoStore'
import PresupuestoStats from '@/src/modules/presupuestos/components/PresupuestoStats'
import PresupuestoList from '@/src/modules/presupuestos/components/PresupuestoList'
import PresupuestoForm from '@/src/modules/presupuestos/components/PresupuestoForm'
import PresupuestoDeleteModal from '@/src/modules/presupuestos/components/PresupuestoDeleteModal'
import type { PresupuestoSummary, CreatePresupuestoInput } from '@/src/modules/presupuestos/presupuesto.schema'

export default function PresupuestosPage() {
  const { presupuestos, isLoading, crear, actualizar, eliminar } = usePresupuestos()
  const { errorMessage, successMessage, setError, setSuccess } = usePresupuestoStore()

  const [presupuestoToEdit, setPresupuestoToEdit] = useState<PresupuestoSummary | null>(null)
  const [presupuestoToDelete, setPresupuestoToDelete] = useState<PresupuestoSummary | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openCreateForm = () => {
    setPresupuestoToEdit(null)
    setIsFormOpen(true)
  }

  const openEditForm = (presupuesto: PresupuestoSummary) => {
    setPresupuestoToEdit(presupuesto)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setPresupuestoToEdit(null)
  }

  const handleSave = (input: CreatePresupuestoInput) => {
    if (presupuestoToEdit) {
      actualizar(presupuestoToEdit.id, input)
    } else {
      crear(input)
    }
    closeForm()
  }

  const handleConfirmDelete = () => {
    if (!presupuestoToDelete) return
    eliminar(presupuestoToDelete.id)
    setPresupuestoToDelete(null)
  }

  return (
    <AppLayout title="Presupuestos - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">

        {/* Alertas */}
        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show mb-4">
            {errorMessage}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show mb-4">
            {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
          </div>
        )}

        {/* Header */}
        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">
                 Presupuestos ({presupuestos.length})
              </h2>
              <p className="text-secondary mb-0">
                Gestiona tus límites de gasto por período.
              </p>
            </div>
            <button
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              type="button"
              onClick={openCreateForm}
            >
              <span className="material-symbols-outlined fs-6">add</span>
              Nuevo Presupuesto
            </button>
          </div>
        </header>

        <PresupuestoStats presupuestos={presupuestos} />

        <PresupuestoList
          presupuestos={presupuestos}
          isLoading={isLoading}
          onEdit={openEditForm}
          onDelete={setPresupuestoToDelete}
        />

      </div>

      {isFormOpen && (
        <PresupuestoForm
          presupuestoToEdit={presupuestoToEdit}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {presupuestoToDelete && (
        <PresupuestoDeleteModal
          presupuesto={presupuestoToDelete}
          onConfirm={handleConfirmDelete}
          onClose={() => setPresupuestoToDelete(null)}
        />
      )}
    </AppLayout>
  )
}
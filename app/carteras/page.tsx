'use client'

import { useState } from 'react'
import AppLayout from '@/src/shared/components/AppLayout'
import { useCarteras } from '@/src/modules/carteras/hooks/useCarteras'
import CarteraList from '@/src/modules/carteras/components/CarteraList'
import CarteraForm from '@/src/modules/carteras/components/CarteraForm'
import CarteraDeleteModal from '@/src/modules/carteras/components/CarteraDeleteModal'
import type { CarteraSummary, CreateCarteraInput} from '@/src/modules/carteras/cartera.schema'
import { formatMoney } from '@/src/shared/types/common'

export default function CarterasPage() {
  const { carteras, isLoading, crear, actualizar, eliminar } = useCarteras() //Logica

  const [carteraToEdit, setCarteraToEdit] = useState<CarteraSummary | null>(null) //Guarda la cartera que se está editando.
  const [carteraToDelete, setCarteraToDelete] = useState<CarteraSummary | null>(null) //Guarda la cartera que se quiere eliminar.
  const [isFormOpen, setIsFormOpen] = useState(false) 
  const [formError, setFormError] = useState<string | null>(null)

  const totalBalance = carteras.reduce((sum, c) => sum + c.balance_inicial, 0)

  //Solo abrir formulario, no se llama a la logica de guardado ni nada
  const openCreateForm = () => {
    setCarteraToEdit(null)
    setIsFormOpen(true)
  }

  const openEditForm = (cartera: CarteraSummary) => {
    setCarteraToEdit(cartera)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setCarteraToEdit(null)
    setFormError(null)
  }

  //se llama a la logica de guardado
  const handleSave = async (input: CreateCarteraInput) => {
    setFormError(null)
    const result = await (carteraToEdit
      ? actualizar(carteraToEdit.id, input)
      : crear(input))
  
    if (result.ok) {
      closeForm()
    } else {
      setFormError(result.message ?? 'Error al guardar')
    }
  }

  const handleConfirmDelete = () => {
    if (!carteraToDelete) return
    eliminar(carteraToDelete.id)
    setCarteraToDelete(null)
  }

  return (
    <AppLayout title="Carteras - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">

        {/* Header */}
        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">Carteras ({carteras.length})</h2>
              <p className="text-secondary mb-0">
                Gestiona tus saldos y metas de ahorro.
              </p>
            </div>
            <button
              className="btn btn-primary d-inline-flex align-items-center gap-2 px-4"
              type="button"
              onClick={openCreateForm}
            >
              <span className="material-symbols-outlined fs-6">add</span>
              <span>Crear Cartera</span>
            </button>
          </div>
        </header>

        {/* Balance total */}
        <div className="card text-bg-primary border-0 shadow-sm mb-4">
          <div className="card-body position-relative overflow-hidden p-4 p-lg-5">
            <div className="position-relative z-1">
              <p className="small fw-medium mb-1">Balance Total</p>
              <h3 className="display-6 fw-bold mb-0">
                ${formatMoney(totalBalance)}
              </h3>
            </div>
            <div className="wallet-hero-gradient position-absolute top-0 end-0 h-100" />
            <span className="material-symbols-outlined wallet-hero-icon">account_balance</span>
          </div>
        </div>

        {/* Lista */}
        <section>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="h5 fw-bold mb-0">Tus Carteras Activas</h3>
            <span className="small text-secondary">{carteras.length} carteras totales</span>
          </div>
          <CarteraList
            carteras={carteras}
            isLoading={isLoading}
            onEdit={openEditForm}
            onDelete={setCarteraToDelete}
          />
        </section>

      </div>

      {/* Modales */}
      {isFormOpen && (
        <CarteraForm
          carteraToEdit={carteraToEdit}
          onSave={handleSave}
          onClose={closeForm}
          error={formError}
        />
      )}

      {carteraToDelete && (
        <CarteraDeleteModal
          cartera={carteraToDelete}
          onConfirm={handleConfirmDelete}
          onClose={() => setCarteraToDelete(null)}
        />
      )}
    </AppLayout>
  )
}
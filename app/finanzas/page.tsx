'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import AppLayout from '@/src/shared/components/AppLayout'
import { useTransacciones } from '@/src/modules/finanzas/hooks/useTransacciones'
import { listarCarterasAction } from '@/src/modules/carteras/cartera.actions'
import TransaccionTabs from '@/src/modules/finanzas/components/TransaccionTabs'
import TransaccionTable from '@/src/modules/finanzas/components/TransaccionTable'
import TransaccionFormModal from '@/src/modules/finanzas/components/TransaccionFormModal'
import TransaccionDeleteModal from '@/src/modules/finanzas/components/TransaccionDeleteModal'
import {createEmptyForm, formFromTransaccion } from '@/src/modules/finanzas/transaccion.schema'
import type {Transaccion, TransaccionFormState} from '@/src/modules/finanzas/transaccion.schema'
import type { CarteraOption } from '@/src/modules/carteras/cartera.schema'
import { listarCategoriasAction, listarPresupuestosAction } from '@/src/modules/finanzas/transaccion.actions'

export default function FinanzasPage() {
  const { transacciones, filtradas, isLoading, crear, actualizar, eliminar } = useTransacciones()
  const [carteras, setCarteras] = useState<CarteraOption[]>([])
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([])
  const [presupuestos, setPresupuestos] = useState<{ id: string; nombre: string }[]>([])

  useEffect(() => {
    listarCarterasAction().then((result) => {
      if (result.ok) {
        setCarteras(result.data.map((c) => ({ id: c.id, nombre: c.nombre })))
      }
    })
  }, [])

  useEffect(() => {
    listarCategoriasAction().then((result) => {
      if (result.ok) setCategorias(result.data)
    })
  }, [])

  useEffect(() => {
    listarPresupuestosAction().then((result) => {
      if (result.ok) setPresupuestos(result.data)
    })
  }, [])

  const [transaccionToEdit, setTransaccionToEdit] = useState<Transaccion | null>(null)
  const [transaccionToDelete, setTransaccionToDelete] = useState<Transaccion | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<TransaccionFormState>(createEmptyForm())

  const openCreateForm = () => {
    setTransaccionToEdit(null)
    setForm(createEmptyForm())
    setIsFormOpen(true)
  }

  const openEditForm = (tx: Transaccion) => {
    setTransaccionToEdit(tx)
    setForm(formFromTransaccion(tx))
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setTransaccionToEdit(null)
    setForm(createEmptyForm())
  }

  const handleFieldChange = <K extends keyof TransaccionFormState>(
    field: K,
    value: TransaccionFormState[K]
  ) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const monto = form.tipo === 'gasto'
      ? -Math.abs(Number.parseFloat(form.monto))
      : Math.abs(Number.parseFloat(form.monto))

    if (transaccionToEdit) {
      actualizar(transaccionToEdit.id, {
        descripcion: form.descripcion,
        monto,
        fecha: form.fecha,
        tipo: form.tipo,
        cartera_id: form.cartera_id || null,
        presupuesto_id: form.tipo === 'gasto' ? (form.presupuesto_id || null) : null,
        categoria_id: form.categoria_id || null
      })
    } else {
      crear({
        descripcion: form.descripcion,
        monto,
        fecha: form.fecha,
        tipo: form.tipo,
        cartera_id: form.cartera_id,
        presupuesto_id: form.tipo === 'gasto' ? (form.presupuesto_id || null) : null,
        categoria_id: form.categoria_id
      })
    }
    closeForm()
  }

  const handleConfirmDelete = () => {
    if (!transaccionToDelete) return
    eliminar(transaccionToDelete.id)
    setTransaccionToDelete(null)
  }

  return (
    <AppLayout title="Transacciones - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">Transacciones</h2>
              <p className="text-secondary mb-0">Gestiona y analiza tus movimientos financieros</p>
            </div>
            <button
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              type="button"
              onClick={openCreateForm}
            >
              <span className="material-symbols-outlined fs-6">add</span>
              Nueva Transacción
            </button>
          </div>
        </header>

        <TransaccionTabs />

        <TransaccionTable
          transacciones={filtradas}
          carteras={carteras}
          total={transacciones.length}
          isLoading={isLoading}
          onEdit={openEditForm}
          onDelete={setTransaccionToDelete}
        />
      </div>

      {isFormOpen && (
        <TransaccionFormModal
          form={form}
          carteras={carteras}
          categorias={categorias} 
          presupuestos={presupuestos}
          mode={transaccionToEdit ? 'edit' : 'create'}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {transaccionToDelete && (
        <TransaccionDeleteModal
          transaccion={transaccionToDelete}
          carteras={carteras}
          onConfirm={handleConfirmDelete}
          onClose={() => setTransaccionToDelete(null)}
        />
      )}
    </AppLayout>
  )
}
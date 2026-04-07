'use client'

import type { ChangeEvent, FormEvent, MouseEvent } from 'react'
import type { CarteraOption } from '@/src/modules/carteras/cartera.schema'
import type { TransaccionFormState } from '../transaccion.schema'

interface TransaccionFormModalProps {
  form: TransaccionFormState
  carteras: CarteraOption[]
  categorias: { id: string; nombre: string }[]
  presupuestos: { id: string; nombre: string }[]
  mode?: 'create' | 'edit'
  onFieldChange: <K extends keyof TransaccionFormState>(field: K, value: TransaccionFormState[K]) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function TransaccionFormModal({
  form,
  carteras,
  categorias,
  presupuestos,
  mode = 'create',
  onFieldChange,
  onSubmit,
  onClose
}: TransaccionFormModalProps) {
  const updateField = <K extends keyof TransaccionFormState>(field: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onFieldChange(field, e.target.value as TransaccionFormState[K])

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
              <h5 className="modal-title">
                {mode === 'edit' ? 'Editar transacción' : 'Nueva transacción'}
              </h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body d-grid gap-3">

                {/* Tipo */}
                <div>
                  <label className="form-label fw-semibold">Tipo</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      className="btn-check"
                      id={`${mode}-type-expense`}
                      name={`${mode}-type`}
                      type="radio"
                      value="expense"
                      checked={form.tipo === 'gasto'}
                      onChange={() => onFieldChange('tipo', 'gasto')}
                    />
                    <label className="btn btn-outline-danger" htmlFor={`${mode}-type-expense`}>
                      Gasto
                    </label>
                    <input
                      className="btn-check"
                      id={`${mode}-type-income`}
                      name={`${mode}-type`}
                      type="radio"
                      value="income"
                      checked={form.tipo === 'ingreso'}
                      onChange={() => onFieldChange('tipo', 'ingreso')}
                    />
                    <label className="btn btn-outline-success" htmlFor={`${mode}-type-income`}>
                      Ingreso
                    </label>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="form-label fw-semibold">Descripción</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Ej. Compra semanal"
                    value={form.descripcion}
                    onChange={updateField('descripcion')}
                    autoFocus
                  />
                </div>

                {/* Monto + Fecha */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Monto ($)</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        value={form.monto}
                        onChange={updateField('monto')}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      className="form-control"
                      type="date"
                      value={form.fecha}
                      onChange={updateField('fecha')}
                    />
                  </div>
                </div>

                {/* Cartera */}
                <div>
                  <label className="form-label fw-semibold">Cartera</label>
                  <select
                    className="form-select"
                    value={form.cartera_id}
                    onChange={(e) => {
                      onFieldChange('cartera_id', e.target.value)
                    }}
                    required
                  >
                    <option value="">Sin cartera</option>
                    {carteras.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Presupuesto — solo para gastos */}
                {form.tipo === 'gasto' && (
                  <div>
                    <label className="form-label fw-semibold">Presupuesto <span className="text-secondary fw-normal">(opcional)</span></label>
                    <select
                      className="form-select"
                      value={form.presupuesto_id}
                      onChange={(e) => onFieldChange('presupuesto_id', e.target.value)}
                    >
                      <option value="">Sin presupuesto</option>
                      {presupuestos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Categoria */}
                <div>
                  <label className="form-label fw-semibold">Categoría</label>
                  <select
                    className="form-select"
                    value={form.categoria_id}
                    onChange={updateField('categoria_id')}
                    required
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {mode === 'edit' ? 'Guardar cambios' : 'Crear transacción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1080 }} />
    </>
  )
}
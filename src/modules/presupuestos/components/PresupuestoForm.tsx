'use client'

import type { FormEvent, MouseEvent } from 'react'
import { useState, useEffect } from 'react'
import type { PresupuestoSummary, CreatePresupuestoInput } from '../presupuesto.schema'

interface PresupuestoFormProps {
  presupuestoToEdit?: PresupuestoSummary | null
  onSave: (input: CreatePresupuestoInput) => void
  onClose: () => void
}

export default function PresupuestoForm({
  presupuestoToEdit,
  onSave,
  onClose
}: PresupuestoFormProps) {
  const isEditing = Boolean(presupuestoToEdit)
  const [nombre, setNombre] = useState('')
  const [montoLimite, setMontoLimite] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    if (presupuestoToEdit) {
      setNombre(presupuestoToEdit.nombre)
      setMontoLimite(String(presupuestoToEdit.monto_limite))
      setFechaInicio(presupuestoToEdit.fecha_inicio)
      setFechaFin(presupuestoToEdit.fecha_fin ?? '')
    } else {
      setNombre('')
      setMontoLimite('')
      setFechaInicio('')
      setFechaFin('')
    }
  }, [presupuestoToEdit])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      nombre: nombre.trim(),
      monto_limite: Number.parseFloat(montoLimite),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin || null
    })
  }

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
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'}
              </h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Nombre del presupuesto *</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Ej: Presupuesto del mes"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha de inicio *</label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        required
                      />
                      <span className="input-group-text">
                        <span className="material-symbols-outlined fs-6">calendar_today</span>
                      </span>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha de fin (opcional)</label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                      />
                      <span className="input-group-text">
                        <span className="material-symbols-outlined fs-6">calendar_today</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Monto límite ($) *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      className="form-control"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Ej. 1000"
                      value={montoLimite}
                      onChange={(e) => setMontoLimite(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Guardar cambios' : 'Crear presupuesto'}
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
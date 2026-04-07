import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import '@testing-library/jest-dom/jest-globals'
import PresupuestoForm from '../../../modules/presupuestos/components/PresupuestoForm'

describe('Componente PresupuestoForm', () => {
  const mockOnSave = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería permitir ingresar datos y enviarlos correctamente', () => {
    const { container } = render(
      <PresupuestoForm 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    )

    const inputNombre = screen.getByPlaceholderText('Ej: Presupuesto del mes')
    const inputLimite = screen.getByPlaceholderText('Ej. 1000')
    const fechaInputs = container.querySelectorAll('input[type="date"]')
    const inputFechaInicio = fechaInputs[0] as HTMLInputElement
    const inputFechaFin = fechaInputs[1] as HTMLInputElement
    const btnGuardar = screen.getByRole('button', { name: /crear presupuesto/i })

    fireEvent.change(inputNombre, { target: { value: 'Comida' } })
    fireEvent.change(inputLimite, { target: { value: '300' } })
    fireEvent.change(inputFechaInicio, { target: { value: '2026-04-01' } })
    fireEvent.change(inputFechaFin, { target: { value: '2026-04-30' } })

    expect(inputNombre).toHaveValue('Comida')
    expect(inputLimite).toHaveValue(300)
    expect(inputFechaInicio).toHaveValue('2026-04-01')
    expect(inputFechaFin).toHaveValue('2026-04-30')

    fireEvent.click(btnGuardar)

    expect(mockOnSave).toHaveBeenCalledTimes(1)
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Comida',
      monto_limite: 300,
      fecha_inicio: '2026-04-01',
      fecha_fin: '2026-04-30'
    }))
  })

  it('debería ejecutar onClose al presionar cancelar', () => {
    render(
      <PresupuestoForm 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    )

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(btnCancelar)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
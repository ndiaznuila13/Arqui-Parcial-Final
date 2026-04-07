import { render, screen, fireEvent } from '@testing-library/react'
import CarteraForm from '../../../modules/carteras/components/CarteraForm'
import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import '@testing-library/jest-dom/jest-globals'

describe('Componente CarteraForm', () => {
  const mockOnSave = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería permitir ingresar el nombre y un monto inicial, y enviarlos', () => {
    render(
      <CarteraForm 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    )

    const inputNombre = screen.getByPlaceholderText('Ej. Ahorros Navidad')
    const inputMonto = screen.getByPlaceholderText('0.00')
    const inputMeta = screen.getByPlaceholderText('Ej. 5000')
    const btnGuardar = screen.getByRole('button', { name: /crear cartera/i })

    // Simulamos que el usuario escribe en los inputs
    fireEvent.change(inputNombre, { target: { value: 'Cuenta de Ahorros' } })
    fireEvent.change(inputMonto, { target: { value: '1500' } })
    fireEvent.change(inputMeta, { target: { value: '5000' } })

    // Verificamos que los montos se reflejen en los inputs
    expect(inputNombre).toHaveValue('Cuenta de Ahorros')
    expect(inputMonto).toHaveValue(1500)
    expect(inputMeta).toHaveValue(5000)

    // Simulamos el envío del formulario
    fireEvent.click(btnGuardar)

    // Verificamos que onSubmit se haya llamado con los datos correctos
    expect(mockOnSave).toHaveBeenCalledTimes(1)
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Cuenta de Ahorros',
      balance_inicial: 1500
    }))
  })

  it('debería cancelar el formulario cuando se presiona el botón cancelar', () => {
    render(
      <CarteraForm 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    )

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(btnCancelar)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
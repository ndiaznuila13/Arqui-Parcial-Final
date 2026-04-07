import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import '@testing-library/jest-dom/jest-globals'
import TransaccionFila from '../../../modules/finanzas/components/TransaccionFila'

const mockTransaccion = {
  id: 't-1',
  user_id: 'u-1',
  cartera_id: 'c-1',
  presupuesto_id: null,
  categoria_id: 'cat-1',
  descripcion: 'Compra de supermercado',
  monto: -150.50,
  tipo: 'gasto' as const,
  fecha: '2026-04-07'
}

describe('Componente TransaccionFila', () => {
  const mockCarteras = [{ id: 'c-1', nombre: 'Cuenta Principal' }]
  const mockOnToggleMenu = jest.fn()
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  // Limpiamos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function renderFila(isMenuOpen = false) {
    return render(
      <table>
        <tbody>
          <TransaccionFila
            transaccion={mockTransaccion as any}
            carteras={mockCarteras}
            isMenuOpen={isMenuOpen}
            onToggleMenu={mockOnToggleMenu}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
          />
        </tbody>
      </table>
    )
  }

  it('debería renderizar la información de la transacción correctamente', () => {
    renderFila(false)

    expect(screen.getByText('Compra de supermercado')).toBeInTheDocument()
    expect(screen.getByText('Gasto')).toBeInTheDocument()
    expect(screen.getByText('Cuenta Principal')).toBeInTheDocument()
    expect(screen.getByText('-$150.50')).toBeInTheDocument()
  })

  it('debería ejecutar la función onEdit al hacer clic en el botón de editar', () => {
    renderFila(true)

    const btnEditar = screen.getByText('Editar')
    fireEvent.click(btnEditar)

    expect(mockOnEdit).toHaveBeenCalledTimes(1)
  })

  it('debería ejecutar la función onDelete al hacer clic en el botón de eliminar', () => {
    renderFila(true)

    const btnEliminar = screen.getByText('Eliminar')
    fireEvent.click(btnEliminar)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  it('debería ejecutar onToggleMenu al hacer clic en el botón de acciones', () => {
    renderFila(false)

    const botones = screen.getAllByRole('button')
    fireEvent.click(botones[0])

    expect(mockOnToggleMenu).toHaveBeenCalledTimes(1)
  })
})
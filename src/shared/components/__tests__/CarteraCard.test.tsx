import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import CarteraCard from '../../../modules/carteras/components/CarteraCard' 


// Creamos un objeto falso (mock) basado en la estructura de tu CarteraSummary
const mockCartera = {
  id: '1',
  nombre: 'Ahorros Universidad',
  balance_inicial: 500,
  objetivo_cantidad: 1000,
  icon: 'savings',
  iconBg: 'bg-primary'
}

describe('Componente CarteraCard', () => {
  const mockOnToggleMenu = jest.fn()
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería renderizar los datos de la cartera y sus valores correctamente', () => {
    render(
      <CarteraCard
        cartera={mockCartera as any}
        isMenuOpen={false}
        onToggleMenu={mockOnToggleMenu}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Ahorros Universidad')).toBeInTheDocument()
    expect(screen.getByText('$500.00')).toBeInTheDocument()
    expect(screen.getByText(/Meta:\s*\$\s*1,000\s*\.00/)).toBeInTheDocument()
  })

  it('debería ocultar las opciones de Editar y Eliminar si el menú está cerrado', () => {
    render(
      <CarteraCard
        cartera={mockCartera as any}
        isMenuOpen={false}
        onToggleMenu={mockOnToggleMenu}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.queryByText('Editar')).not.toBeInTheDocument()
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument()
  })

  it('debería mostrar el menú y ejecutar las acciones correspondientes al hacer clic', () => {
    render(
      <CarteraCard
        cartera={mockCartera as any}
        isMenuOpen={true}
        onToggleMenu={mockOnToggleMenu}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const btnEditar = screen.getByText('Editar')
    const btnEliminar = screen.getByText('Eliminar')

    expect(btnEditar).toBeInTheDocument()
    expect(btnEliminar).toBeInTheDocument()

    // Simulamos un click del usuario en el botón de Editar
    fireEvent.click(btnEditar)
    expect(mockOnEdit).toHaveBeenCalledTimes(1)

    // Simulamos un click del usuario en el botón de Eliminar
    fireEvent.click(btnEliminar)
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })
})
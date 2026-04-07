import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, jest } from "@jest/globals"
import '@testing-library/jest-dom/jest-globals'
import PresupuestoCard from '../../../modules/presupuestos/components/PresupuestoCard'

const mockPresupuesto = {
  id: 'p-1',
  nombre: 'Entretenimiento',
  monto_limite: 200,
  monto_consumido: 50,
  fecha_inicio: '2026-04-01',
  fecha_fin: null,
  icon: 'movie',
  iconBg: 'bg-danger bg-opacity-10 text-danger'
}

describe('Componente PresupuestoCard', () => {
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  it('debería reflejar los montos de límite y gastado correctamente', () => {
    render(
      <PresupuestoCard 
        presupuesto={mockPresupuesto as any} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    )

    expect(screen.getByText('Entretenimiento')).toBeInTheDocument()
    // Verifica que el monto gastado y el límite se muestren
    expect(screen.getByText(/Consumido:\s*\$\s*50/)).toBeInTheDocument()
    expect(screen.getByText(/\$\s*200/)).toBeInTheDocument()
  })

  it('debería activar los callbacks de edición y eliminación', () => {
    render(
      <PresupuestoCard 
        presupuesto={mockPresupuesto as any} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    )

    const btnMenu = screen.getByRole('button', { name: /more_vert/i })
    fireEvent.click(btnMenu)

    const btnEditar = screen.getByText('Editar')
    fireEvent.click(btnEditar)
    expect(mockOnEdit).toHaveBeenCalledTimes(1)

    fireEvent.click(btnMenu)
    const btnEliminar = screen.getByText('Eliminar')
    fireEvent.click(btnEliminar)
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })
})
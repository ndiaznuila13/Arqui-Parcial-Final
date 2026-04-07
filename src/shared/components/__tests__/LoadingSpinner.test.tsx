import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'
import { describe, expect, it } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'


describe('Componente LoadingSpinner', () => {
  it('debería renderizar el mensaje por defecto "Cargando..."', () => {
    render(<LoadingSpinner />)
    expect(screen.getAllByText('Cargando...')).toHaveLength(2)
  })

  it('debería renderizar un mensaje personalizado', () => {
    const mensajePrueba = 'Guardando presupuesto...'
    render(<LoadingSpinner message={mensajePrueba} />)
    expect(screen.getByText(mensajePrueba)).toBeInTheDocument()
  })
})
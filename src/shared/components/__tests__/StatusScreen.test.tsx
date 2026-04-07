import { render, screen } from '@testing-library/react'
import { describe, expect, it } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import StatusScreen from '../StatusScreen'

describe('Componente StatusScreen', () => {
  it('debería renderizar el mensaje correctamente', () => {
    render(<StatusScreen message="Aún no has registrado ningún movimiento en esta cartera." />)

    expect(screen.getByText('Aún no has registrado ningún movimiento en esta cartera.')).toBeInTheDocument()
    expect(screen.getByText('Aún no has registrado ningún movimiento en esta cartera.')).toHaveClass(
      'text-secondary',
      'small',
      'fw-medium'
    )
  })
})
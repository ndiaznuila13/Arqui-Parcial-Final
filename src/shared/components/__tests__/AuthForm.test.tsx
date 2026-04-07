import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { AuthAlert, AuthFormField, AuthPasswordField } from '../../../auth/autenticacion/components/AuthForm'

describe('Componentes de AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería renderizar AuthFormField y llamar onChange al escribir', () => {
    const mockOnChange = jest.fn()

    render(
      <AuthFormField
        id="email"
        label="Correo electrónico"
        name="email"
        placeholder="correo@ejemplo.com"
        value=""
        onChange={mockOnChange}
      />
    )

    const input = screen.getByLabelText(/correo electrónico/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'correo@ejemplo.com')

    fireEvent.change(input, { target: { value: 'test@correo.com' } })
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith('test@correo.com')
  })

  it('debería alternar la visibilidad en AuthPasswordField', () => {
    const mockOnChange = jest.fn()

    render(
      <AuthPasswordField
        id="password"
        label="Contraseña"
        name="password"
        placeholder="********"
        value="12345678"
        onChange={mockOnChange}
      />
    )

    const input = screen.getByLabelText(/contraseña/i)
    expect(input).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute('type', 'text')
  })

  it('debería renderizar AuthAlert cuando recibe un mensaje', () => {
    render(<AuthAlert message="Correo o contraseña incorrectos." />)

    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })
})

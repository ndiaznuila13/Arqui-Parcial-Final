"use client"

import type { FormEvent, MouseEvent } from 'react'
import { useState } from 'react'
import { AuthAlert, AuthFormField } from './AuthForm'
import { requestPasswordResetAction } from '../auth.actions'

interface ResetPasswordSuccessPayload {
  email: string
  message: string
}

interface ResetPasswordModalProps {
  defaultEmail?: string
  onClose: () => void
  onSuccess: (payload: ResetPasswordSuccessPayload) => void
}

export default function ResetPasswordModal({
  defaultEmail = '',
  onClose,
  onSuccess
}: ResetPasswordModalProps) {
  const [email, setEmail] = useState<string>(defaultEmail)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError('')
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setError('Debes ingresar un correo electrónico.')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.set('email', normalizedEmail)
      const result = await requestPasswordResetAction(formData)

      if (!result.success) {
        setError(result.message || 'No se pudo procesar la solicitud.')
        return
      }

      onSuccess({
        email: normalizedEmail,
        message: result.message || 'Revisa tu correo para restablecer la contraseña.'
      })

      onClose()
    } catch (error) {
      setError('No se pudo procesar la solicitud.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        className="modal d-block auth-modal"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1085 }}
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Restablecer contraseña</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body d-grid gap-3">
                <AuthFormField
                  autoFocus
                  icon="mail"
                  id="reset-email"
                  label="Correo electrónico"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  required
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <p className="small text-secondary mb-0">
                  Te enviaremos un enlace seguro para restablecer tu contraseña.
                </p>
                <AuthAlert message={error} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
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

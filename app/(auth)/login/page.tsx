"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AuthAlert, AuthFormField, AuthPasswordField } from '@/src/auth/autenticacion/components/AuthForm'
import AuthShell from '@/src/auth/autenticacion/components/AuthShell'
import ResetPasswordModal from '@/src/auth/autenticacion/components/ResetPasswordModal'
import { loginAction } from '@/src/auth/autenticacion/auth.actions'

interface ResetPasswordSuccessPayload {
  email: string
  message: string
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Mis Finanzas - Iniciar sesión'
  }, [])

  const handleLogin = async (formData: FormData): Promise<void> => {
    setError('')
    setSuccess('')
    setIsLoading(true)
    try {
      const result = await loginAction(formData)
      if (!result.success) {
        setError(result.message || 'Correo o contraseña incorrectos.')
        return
      }
      window.location.href = '/finanzas'
    } catch {
      setError('No se pudo completar el inicio de sesión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSuccess = ({ email: nextEmail, message }: ResetPasswordSuccessPayload): void => {
    setEmail(nextEmail)
    setPassword('')
    setError('')
    setSuccess(message)
  }

  return (
    <>
      <AuthShell
        activeView="login"
        title="Inicia sesión"
        description="Accede a tus transacciones, carteras y presupuestos."
        footer={(
          <p className="small text-secondary mb-0 mt-4 text-center">
            ¿Aún no tienes una cuenta?{' '}
            <Link className="text-decoration-none fw-semibold" href="/register">
              Crea una cuenta
            </Link>
          </p>
        )}
      >
        <form className="d-grid gap-3" onSubmit={(e) => { e.preventDefault(); handleLogin(new FormData(e.currentTarget)) }}>
          <AuthFormField
            autoComplete="email"
            autoFocus
            icon="mail"
            id="login-email"
            label="Correo electrónico"
            name="email"
            placeholder="correo@ejemplo.com"
            required
            type="email"
            value={email}
            onChange={setEmail}
          />
          <AuthPasswordField
            autoComplete="current-password"
            id="login-password"
            label="Contraseña"
            name="password"
            placeholder="********"
            required
            value={password}
            onChange={setPassword}
          />
          <AuthAlert message={error} />
          <AuthAlert message={success} variant="success" />
          <div className="d-flex align-items-center justify-content-between">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="recordarme" />
              <label className="form-check-label small text-secondary" htmlFor="recordarme">
                Recordarme
              </label>
            </div>
            <button
              className="btn btn-link text-decoration-none small p-0"
              type="button"
              onClick={() => setIsResetModalOpen(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <button
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
      </AuthShell>
      {isResetModalOpen && (
        <ResetPasswordModal
          defaultEmail={email.trim()}
          onClose={() => setIsResetModalOpen(false)}
          onSuccess={handleResetSuccess}
        />
      )}
    </>
  )
}
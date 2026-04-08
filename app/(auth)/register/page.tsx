"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AuthAlert, AuthFormField, AuthPasswordField } from '../../../src/auth/autenticacion/components/AuthForm'
import AuthShell from '../../../src/auth/autenticacion/components/AuthShell'
import { registerAction } from '../../../src/auth/autenticacion/auth.actions'

export default function CrearCuenta() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Mis Finanzas - Registrarse'
  }, [])

  const handleSubmit = async (formData: FormData): Promise<void> => {
    setError('')
    setSuccess('')
    setIsLoading(true)
    try {
      const result = await registerAction(formData)
      if (!result.success) {
        setError(result.message || 'No se pudo crear la cuenta.')
        return
      }
      setSuccess(result.message || 'Cuenta creada correctamente. Ahora inicia sesión.')
    } catch {
      setError('No se pudo crear la cuenta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      activeView="register"
      title="Crea tu cuenta"
      description="Empieza a organizar tus finanzas con una cuenta personal."
      footer={(
        <p className="small text-secondary mb-0 mt-4 text-center">
          ¿Ya tienes una cuenta?{' '}
          <Link className="text-decoration-none fw-semibold" href="/login">
            Inicia sesión
          </Link>
        </p>
      )}
    >
      <form className="d-grid gap-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)) }}>
        <AuthFormField
          autoComplete="name"
          autoFocus
          icon="person"
          id="register-name"
          label="Nombre completo"
          name="name"
          placeholder="Tu nombre"
          required
          value={name}
          onChange={setName}
        />
        <AuthFormField
          autoComplete="email"
          icon="mail"
          id="register-email"
          label="Correo electrónico"
          name="email"
          placeholder="correo@ejemplo.com"
          required
          type="email"
          value={email}
          onChange={setEmail}
        />
        <AuthPasswordField
          autoComplete="new-password"
          id="register-password"
          label="Contraseña"
          name="password"
          placeholder="Mínimo 8 caracteres"
          required
          value={password}
          onChange={setPassword}
        />
        <AuthPasswordField
          autoComplete="new-password"
          id="register-confirm-password"
          label="Confirmar contraseña"
          name="confirmPassword"
          placeholder="Repite la contraseña"
          required
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <AuthAlert message={error} />
        <AuthAlert message={success} variant="success" />
        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          <span className="material-symbols-outlined">person_add</span>
        </button>
      </form>
    </AuthShell>
  )
}
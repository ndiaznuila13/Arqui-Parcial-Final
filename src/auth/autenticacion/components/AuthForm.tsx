"use client"

import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { useId, useState } from 'react'

type InputMode = InputHTMLAttributes<HTMLInputElement>['inputMode']

interface AuthAlertProps {
  message: string
  variant?: 'danger' | 'success'
}

interface AuthFormFieldProps {
  autoComplete?: HTMLInputAutoCompleteAttribute
  autoFocus?: boolean
  helpText?: string
  icon?: string
  id: string
  inputMode?: InputMode
  label: string
  name?: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: HTMLInputTypeAttribute
  value: string
}

interface AuthPasswordFieldProps {
  autoComplete?: HTMLInputAutoCompleteAttribute
  helpText?: string
  id?: string
  label: string
  name?: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  value: string
}

export function AuthAlert({ message, variant = 'danger' }: AuthAlertProps) {
  if (!message) {
    return null
  }

  return (
    <div className={`alert alert-${variant} py-2 mb-0`} role="alert">
      {message}
    </div>
  )
}

export function AuthFormField({
  autoComplete,
  autoFocus = false,
  helpText,
  icon,
  id,
  inputMode,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value
}: AuthFormFieldProps) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>{label}</label>
      <div className="input-group">
        {icon && (
          <span className="input-group-text">
            <span className="material-symbols-outlined fs-6">{icon}</span>
          </span>
        )}
        <input
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className="form-control"
          id={id}
          inputMode={inputMode}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {helpText && <p className="form-text text-secondary mb-0">{helpText}</p>}
    </div>
  )
}

export function AuthPasswordField({
  autoComplete,
  helpText,
  id,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  value
}: AuthPasswordFieldProps) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <div>
      <label className="form-label" htmlFor={fieldId}>{label}</label>
      <div className="input-group">
        <span className="input-group-text">
          <span className="material-symbols-outlined fs-6">lock</span>
        </span>
        <input
          autoComplete={autoComplete}
          className="form-control"
          id={fieldId}
          name={name}
          placeholder={placeholder}
          required={required}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => setIsVisible((current) => !current)}
        >
          <span className="material-symbols-outlined fs-6">
            {isVisible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      {helpText && <p className="form-text text-secondary mb-0">{helpText}</p>}
    </div>
  )
}

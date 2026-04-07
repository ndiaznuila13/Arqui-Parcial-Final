"use client"

import type { ReactNode } from 'react'
import Link from 'next/link'

type AuthView = 'login' | 'register'

const FEATURE_ITEMS = [
  {
    icon: 'query_stats',
    title: 'Seguimiento claro',
    description: 'Visualiza tus ingresos y gastos en un solo lugar.'
  },
  {
    icon: 'shield',
    title: 'Acceso seguro',
    description: 'Tu sesión se gestiona de forma segura para proteger tu acceso.'
  }
] as const

interface AuthShellProps {
  activeView: AuthView
  children: ReactNode
  description: string
  footer?: ReactNode
  title: string
}

export default function AuthShell({
  activeView,
  children,
  description,
  footer,
  title
}: AuthShellProps) {
  return (
    <div className="container-fluid min-vh-100 bg-body-tertiary">
      <div className="row g-0 min-vh-100">
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center p-5 bg-light border-end">
          <div className="text-primary d-flex align-items-center gap-2 mb-4">
            <span className="material-symbols-outlined fs-2">account_balance_wallet</span>
            <h2 className="h3 fw-bold mb-0">Mi Finanzas</h2>
          </div>

          <div className="mb-4">
            <h1 className="display-5 fw-bold text-dark mb-3">
              Controla tus <br />
              <span className="text-primary">finanzas personales</span>
            </h1>
            <p className="lead text-secondary mb-0">
              Registra movimientos, controla tus presupuestos y toma mejores decisiones cada mes.
            </p>
          </div>

          <div className="row g-3 pt-2">
            {FEATURE_ITEMS.map((item) => (
              <div key={item.title} className="col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <span className="material-symbols-outlined text-primary mb-2">{item.icon}</span>
                    <h4 className="h6 fw-bold mb-2">{item.title}</h4>
                    <p className="small text-secondary mb-0">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-3 p-lg-5">
          <div className="card border-0 shadow-sm w-100 auth-card">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-center justify-content-center gap-2 text-primary mb-4 d-lg-none">
                <span className="material-symbols-outlined fs-3">account_balance_wallet</span>
                <h2 className="h5 fw-bold mb-0">Mi Finanzas</h2>
              </div>

              <ul className="nav nav-tabs mb-4" role="tablist">
                <li className="nav-item flex-fill" role="presentation">
                  <Link
                    href="/login"
                    className={`nav-link w-100 text-center fw-semibold ${activeView === 'login' ? 'active' : ''}`}
                    aria-current={activeView === 'login' ? 'page' : undefined}
                  >
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item flex-fill" role="presentation">
                  <Link
                    href="/register"
                    className={`nav-link w-100 text-center fw-semibold ${activeView === 'register' ? 'active' : ''}`}
                    aria-current={activeView === 'register' ? 'page' : undefined}
                  >
                    Registrarse
                  </Link>
                </li>
              </ul>

              <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">{title}</h1>
                <p className="text-secondary mb-0">{description}</p>
              </div>

              {children}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

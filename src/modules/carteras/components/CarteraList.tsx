'use client'

import type { CarteraSummary } from '../cartera.schema'
import { useCarteraStore } from '../hooks/useCarteraStore'
import CarteraCard from './CarteraCard'
import LoadingSpinner from '@/src/shared/components/LoadingSpinner'

interface CarteraListProps {
  carteras: CarteraSummary[]
  isLoading: boolean
  onEdit: (cartera: CarteraSummary) => void
  onDelete: (cartera: CarteraSummary) => void
}

export default function CarteraList({
  carteras,
  isLoading,
  onEdit,
  onDelete
}: CarteraListProps) {
  const { openMenuId, toggleMenu, closeMenu } = useCarteraStore()

  if (isLoading) {
    return <LoadingSpinner message="Cargando carteras..." />
  }

  if (carteras.length === 0) {
    return (
      <div className="alert alert-secondary mb-0">
        Aún no has creado carteras.
      </div>
    )
  }

  return (
    <div className="list-group shadow-sm wallets-list">
      {carteras.map((cartera) => (
        <CarteraCard
          key={cartera.id}
          cartera={cartera}
          isMenuOpen={openMenuId === cartera.id}
          onToggleMenu={() => toggleMenu(cartera.id)}
          onEdit={() => { closeMenu(); onEdit(cartera) }}
          onDelete={() => { closeMenu(); onDelete(cartera) }}
        />
      ))}
    </div>
  )
}
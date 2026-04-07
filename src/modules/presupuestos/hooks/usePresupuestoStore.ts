'use client'

import { create } from 'zustand'
import type { PresupuestoSummary } from '../presupuesto.schema'

interface PresupuestoStoreState {
  presupuestos: PresupuestoSummary[]
  isLoading: boolean
  openMenuId: string | null
  errorMessage: string | null
  successMessage: string | null
  setPresupuestos: (presupuestos: PresupuestoSummary[]) => void
  setLoading: (loading: boolean) => void
  toggleMenu: (id: string) => void
  closeMenu: () => void
  setError: (msg: string | null) => void
  setSuccess: (msg: string | null) => void
}

export const usePresupuestoStore = create<PresupuestoStoreState>((set) => ({
  presupuestos: [],
  isLoading: false,
  openMenuId: null,
  errorMessage: null,
  successMessage: null,
  setPresupuestos: (presupuestos) => set({ presupuestos }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleMenu: (id) => set((s) => ({ openMenuId: s.openMenuId === id ? null : id })),
  closeMenu: () => set({ openMenuId: null }),
  setError: (errorMessage) => set({ errorMessage }),
  setSuccess: (successMessage) => set({ successMessage })
}))
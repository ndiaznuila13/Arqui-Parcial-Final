'use client'
import { create } from 'zustand'
import type { Transaccion, TransaccionTab } from '../transaccion.schema'

interface TransaccionStoreState {
  transacciones: Transaccion[]
  isLoading: boolean
  activeTab: TransaccionTab
  activePeriodo: string
  openMenuId: string | null
  setTransacciones: (transacciones: Transaccion[]) => void
  setLoading: (loading: boolean) => void
  setActiveTab: (tab: TransaccionTab) => void
  setActivePeriodo: (periodo: string) => void
  toggleMenu: (id: string) => void
  closeMenu: () => void
}

export const useTransaccionStore = create<TransaccionStoreState>((set) => ({
  transacciones: [],
  isLoading: false,
  activeTab: 'todos',
  activePeriodo: '',
  openMenuId: null,
  setTransacciones: (transacciones) => set({ transacciones }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setActivePeriodo: (activePeriodo) => set({ activePeriodo }),
  toggleMenu: (id) => set((s) => ({ openMenuId: s.openMenuId === id ? null : id })),
  closeMenu: () => set({ openMenuId: null })
}))
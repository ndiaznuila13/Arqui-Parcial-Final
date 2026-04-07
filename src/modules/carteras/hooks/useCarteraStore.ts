'use client'

import { create } from 'zustand'
import type { CarteraSummary } from '../cartera.schema'

interface CarteraStoreState {
  carteras: CarteraSummary[]
  isLoading: boolean
  openMenuId: string | null
  setCarteras: (carteras: CarteraSummary[]) => void
  setLoading: (loading: boolean) => void
  toggleMenu: (id: string) => void
  closeMenu: () => void
}

export const useCarteraStore = create<CarteraStoreState>((set) => ({
  carteras: [],
  isLoading: false,
  openMenuId: null,
  setCarteras: (carteras) => set({ carteras }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleMenu: (id) => set((s) => ({ openMenuId: s.openMenuId === id ? null : id })),
  closeMenu: () => set({ openMenuId: null })
}))
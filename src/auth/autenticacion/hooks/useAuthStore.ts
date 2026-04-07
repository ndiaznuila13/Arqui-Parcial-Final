'use client'

import { create } from 'zustand'
import type { AuthenticatedUser } from '@/src/shared/types/auth'

interface AuthStoreState {
  user: AuthenticatedUser | null
  setUser: (user: AuthenticatedUser | null) => void
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))
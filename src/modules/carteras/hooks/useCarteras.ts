'use client'
import { useEffect } from 'react'
import { toCarteraSummary } from '../cartera.schema'
import { useCarteraStore } from './useCarteraStore'
import {
  listarCarterasAction,
  crearCarteraAction,
  actualizarCarteraAction,
  eliminarCarteraAction
} from '../cartera.actions'
import type { CreateCarteraInput, UpdateCarteraInput } from '../cartera.schema'

export function useCarteras() {
  const { carteras, isLoading, setCarteras, setLoading } = useCarteraStore()

  useEffect(() => {
    setLoading(true)
    listarCarterasAction().then((result) => {
      if (result.ok) setCarteras(result.data.map(toCarteraSummary))
      setLoading(false)
    })
  }, [])

  const crear = async (input: CreateCarteraInput) => {
    const result = await crearCarteraAction(input)
    if (result.ok) {
      const current = useCarteraStore.getState().carteras
      setCarteras([toCarteraSummary(result.data), ...current])
    }
    return result
  }

  const actualizar = async (id: string, input: Partial<UpdateCarteraInput>) => {
    const result = await actualizarCarteraAction(id, input)
    if (result.ok) {
      const current = useCarteraStore.getState().carteras
      setCarteras(current.map((c) => c.id === id ? toCarteraSummary(result.data) : c))
    }
    return result
  }

  const eliminar = async (id: string) => {
    const result = await eliminarCarteraAction(id)
    if (result.ok) {
      const current = useCarteraStore.getState().carteras
      setCarteras(current.filter((c) => c.id !== id))
    }
    return result
  }

  return {
    carteras,
    isLoading,
    crear,
    actualizar,
    eliminar
  }
}
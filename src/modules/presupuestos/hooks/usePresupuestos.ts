'use client'

import { useEffect, useTransition } from 'react'
import { toPresupuestoSummary } from '../presupuesto.schema'
import { usePresupuestoStore } from './usePresupuestoStore'
import {
  listarPresupuestosAction,
  crearPresupuestoAction,
  actualizarPresupuestoAction,
  eliminarPresupuestoAction
} from '../presupuesto.actions'
import type { CreatePresupuestoInput, UpdatePresupuestoInput } from '../presupuesto.schema'

export function usePresupuestos() {
  const {
    presupuestos,
    isLoading,
    setPresupuestos,
    setLoading,
    setError,
    setSuccess
  } = usePresupuestoStore()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setLoading(true)
    listarPresupuestosAction().then((result) => {
      if (result.ok) setPresupuestos(result.data.map(toPresupuestoSummary))
      else setError(result.message)
      setLoading(false)
    })
  }, [])

  // Auto-limpiar mensajes después de 5 segundos
  useEffect(() => {
    const store = usePresupuestoStore.getState()
    if (!store.errorMessage && !store.successMessage) return
    const timer = setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [usePresupuestoStore.getState().errorMessage, usePresupuestoStore.getState().successMessage])

  const crear = (input: CreatePresupuestoInput) =>
    startTransition(async () => {
      const result = await crearPresupuestoAction(input)
      if (result.ok) {
        setPresupuestos([toPresupuestoSummary(result.data), ...presupuestos])
        setSuccess(result.message ?? 'Presupuesto creado exitosamente.')
      } else {
        setError(result.message)
      }
    })

  const actualizar = (id: string, input: UpdatePresupuestoInput) =>
    startTransition(async () => {
      const result = await actualizarPresupuestoAction(id, input)
      if (result.ok) {
        setPresupuestos(
          presupuestos.map((p) => p.id === id ? toPresupuestoSummary(result.data) : p)
        )
        setSuccess(result.message ?? 'Presupuesto actualizado exitosamente.')
      } else {
        setError(result.message)
      }
    })

  const eliminar = (id: string) =>
    startTransition(async () => {
      const result = await eliminarPresupuestoAction(id)
      if (result.ok) {
        setPresupuestos(presupuestos.filter((p) => p.id !== id))
        setSuccess(result.message ?? 'Presupuesto eliminado exitosamente.')
      } else {
        setError(result.message)
      }
    })

  return {
    presupuestos,
    isLoading: isLoading || isPending,
    crear,
    actualizar,
    eliminar
  }
}
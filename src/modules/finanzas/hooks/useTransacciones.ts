'use client'
import { useEffect, useMemo, useTransition } from 'react'
import { useTransaccionStore } from './useTransaccionStore'
import {
  listarTransaccionesAction,
  crearTransaccionAction,
  actualizarTransaccionAction,
  eliminarTransaccionAction
} from '../transaccion.actions'
import type { CreateTransaccionInput, UpdateTransaccionInput } from '../transaccion.schema'

export function useTransacciones() {
  const {
    transacciones,
    isLoading,
    activeTab,
    activePeriodo,
    setTransacciones,
    setLoading
  } = useTransaccionStore()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setLoading(true)
    listarTransaccionesAction().then((result) => {
      if (result.ok) setTransacciones(result.data)
      setLoading(false)
    })
  }, [])

  const filtradas = useMemo(() => {
    let result = transacciones

    if (activePeriodo) {
      result = result.filter((tx) => tx.fecha?.slice(0, 7) === activePeriodo)
    }

    if (activeTab === 'ingresos') return result.filter((tx) => tx.tipo === 'ingreso')
    if (activeTab === 'gastos') return result.filter((tx) => tx.tipo === 'gasto')
    return result
  }, [activeTab, activePeriodo, transacciones])

  const crear = (input: CreateTransaccionInput) =>
    startTransition(async () => {
      const result = await crearTransaccionAction(input)
      if (result.ok) setTransacciones([result.data, ...transacciones])
    })

  const actualizar = (id: string, input: Partial<UpdateTransaccionInput>) =>
    startTransition(async () => {
      const result = await actualizarTransaccionAction(id, input)
      if (result.ok)
        setTransacciones(transacciones.map((tx) => tx.id === id ? result.data : tx))
    })

  const eliminar = (id: string) =>
    startTransition(async () => {
      const result = await eliminarTransaccionAction(id)
      if (result.ok)
        setTransacciones(transacciones.filter((tx) => tx.id !== id))
    })

  return {
    transacciones,
    filtradas,
    isLoading: isLoading || isPending,
    crear,
    actualizar,
    eliminar
  }
}
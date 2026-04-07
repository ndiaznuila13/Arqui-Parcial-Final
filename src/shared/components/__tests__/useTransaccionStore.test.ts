import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { useTransaccionStore } from '../../../modules/finanzas/hooks/useTransaccionStore'

describe('Hook useTransaccionStore', () => {
  beforeEach(() => {
    act(() => {
      useTransaccionStore.setState({
        transacciones: [],
        isLoading: false,
        activeTab: 'todos',
        activePeriodo: '',
        openMenuId: null,
      })
    })
  })

  it('debería tener el estado inicial correcto', () => {
    const state = useTransaccionStore.getState()
    expect(state.transacciones).toEqual([])
    expect(state.activeTab).toBe('todos')
    expect(state.activePeriodo).toBe('')
  })

  it('debería cambiar la pestaña activa correctamente', () => {
    const { setActiveTab } = useTransaccionStore.getState()

    act(() => {
      setActiveTab('gastos')
    })
    
    expect(useTransaccionStore.getState().activeTab).toBe('gastos')

    act(() => {
      setActiveTab('ingresos')
    })
    
    expect(useTransaccionStore.getState().activeTab).toBe('ingresos')
  })
})
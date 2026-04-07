import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from '@jest/globals'
import { useCarteraStore } from '../../../modules/carteras/hooks/useCarteraStore'

describe('Hook useCarteraStore', () => {
  // Limpiamos el estado antes de cada prueba para evitar que interfieran entre sí
  beforeEach(() => {
    act(() => {
      useCarteraStore.setState({
        carteras: [],
        isLoading: false,
        openMenuId: null
      })
    })
  })

  it('debería tener el estado inicial correcto', () => {
    const state = useCarteraStore.getState()
    expect(state.carteras).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.openMenuId).toBeNull()
  })

  it('debería alternar el ID del menú correctamente al usar toggleMenu', () => {
    const { toggleMenu } = useCarteraStore.getState()

    // Abrimos el menú para la cartera con ID "123"
    act(() => {
      toggleMenu('123')
    })
    expect(useCarteraStore.getState().openMenuId).toBe('123')

    // Volvemos a alternar el mismo ID, debería cerrarse (null)
    act(() => {
      toggleMenu('123')
    })
    expect(useCarteraStore.getState().openMenuId).toBeNull()
  })
})
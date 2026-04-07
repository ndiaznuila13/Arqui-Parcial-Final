import type { ServiceResult } from '@/src/shared/types/common'
import type {
  Transaccion,
  CreateTransaccionInput,
  UpdateTransaccionInput
} from './transaccion.schema'
import * as transaccionRepository from './transaccion.repository'
import * as carteraRepository from '../carteras/cartera.repository'
import * as presupuestoRepository from '../presupuestos/presupuesto.repository'
import { sendBudgetAlert, sendHighAmountAlert } from '@/src/lib/brevo'
import { createBackendSupabaseClient } from '@/src/lib/supabaseClient'

export async function listar(userId: string): Promise<ServiceResult<Transaccion[]>> {
  try {
    const data = await transaccionRepository.findAll(userId)
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudieron cargar las transacciones' }
  }
}

export async function crear(
  userId: string,
  input: CreateTransaccionInput
): Promise<ServiceResult<Transaccion>> {
  try {
    if (!input.monto) return { ok: false, message: 'El monto es obligatorio' }
    if (!input.tipo) return { ok: false, message: 'El tipo es obligatorio' }
    if (!input.fecha) return { ok: false, message: 'La fecha es obligatoria' }
    if (!input.categoria_id) return { ok: false, message: 'La categoria es obligatoria' }
    if (!input.cartera_id) return { ok: false, message: 'La cartera es obligatoria' }

    const data = await transaccionRepository.insert(userId, input)

    // Actualizar balance de la cartera si se especificó una
    if (input.cartera_id) {
      const cartera = await carteraRepository.findById(input.cartera_id)
      if (cartera) {
        const nuevoBalance = input.tipo === 'ingreso'
          ? cartera.balance_inicial + Math.abs(input.monto)
          : cartera.balance_inicial - Math.abs(input.monto)
        await carteraRepository.update(input.cartera_id, { balance_inicial: nuevoBalance })
      }
    }

    let userEmail: string | undefined

    try {
      const supabase = createBackendSupabaseClient()
      const { data, error } = await supabase.auth.admin.getUserById(userId)
      if (error) throw error
      userEmail = data.user?.email
      if (!userEmail) {
        console.warn('Usuario sin email en Supabase Auth:', userId)
      }
    } catch (authError) {
      console.error('No se pudo obtener el correo del usuario:', authError)
    }

    // Solo disparamos la lógica asíncrona de alertas si tenemos el correo y es un gasto
    if (userEmail && input.tipo === 'gasto') {
      void (async () => {
        try {
          // Alerta de monto alto
          const montoAbsoluto = Math.abs(Number(input.monto) || 0)

          if (montoAbsoluto >= 500) {
            await sendHighAmountAlert(userEmail, montoAbsoluto, input.descripcion)
          }

          if (!input.presupuesto_id) return

          // Alertas de presupuesto
          const presupuesto = await presupuestoRepository.findById(userId, input.presupuesto_id)
          if (!presupuesto) return

          const montoLimite = Number(presupuesto.monto_limite)
          if (!Number.isFinite(montoLimite) || montoLimite <= 0) return

          const transacciones = await transaccionRepository.findAll(userId)
          const totalGastado = transacciones
            .filter(
              (tx) => tx.presupuesto_id === input.presupuesto_id && tx.tipo === 'gasto'
            )
            .reduce((acc, tx) => acc + Math.abs(Number(tx.monto) || 0), 0)

          const porcentaje = (totalGastado / montoLimite) * 100

          if (porcentaje >= 100) {
            await sendBudgetAlert(userEmail, presupuesto.nombre, porcentaje, true)
            return
          }

          if (porcentaje >= 80) {
            await sendBudgetAlert(userEmail, presupuesto.nombre, porcentaje, false)
          }
        } catch (error) {
          console.error('Error en notificaciones de fondo:', error)
        }
      })()
    } else if (input.tipo === 'gasto') {
      console.warn('No se enviaron alertas: email no disponible para userId', userId)
    }

    return { ok: true, data }
  } catch (e) {
    return { ok: false, message: 'No se pudo crear la transacción' }
  }
}

export async function actualizar(
  id: string,
  input: Partial<UpdateTransaccionInput>
): Promise<ServiceResult<Transaccion>> {
  try {
    const txAnterior = await transaccionRepository.findById(id)

    if (txAnterior?.cartera_id) {
      const cartera = await carteraRepository.findById(txAnterior.cartera_id)

      if (cartera) {
        const balanceRevertido = txAnterior.tipo === 'ingreso'
          ? cartera.balance_inicial - Math.abs(txAnterior.monto)
          : cartera.balance_inicial + Math.abs(txAnterior.monto)
        await carteraRepository.update(txAnterior.cartera_id, { balance_inicial: balanceRevertido })
      }
    }

    const data = await transaccionRepository.update(id, input)

    const cartera_id = input.cartera_id ?? txAnterior?.cartera_id
    const tipoFinal = input.tipo ?? txAnterior?.tipo
    const montoFinal = input.monto ?? txAnterior?.monto

    if (cartera_id && tipoFinal !== undefined && montoFinal !== undefined) {
      const cartera = await carteraRepository.findById(cartera_id)

      if (cartera) {
        const nuevoBalance = tipoFinal === 'ingreso'
          ? cartera.balance_inicial + Math.abs(montoFinal)
          : cartera.balance_inicial - Math.abs(montoFinal)
        await carteraRepository.update(cartera_id, { balance_inicial: nuevoBalance })
      }
    }

    return { ok: true, data }
  } catch (e) {
    return { ok: false, message: 'No se pudo actualizar la transacción' }
  }
}

export async function eliminar(id: string): Promise<ServiceResult<void>> {
  try {
    const tx = await transaccionRepository.findById(id)

    if (tx?.cartera_id) {
      const cartera = await carteraRepository.findById(tx.cartera_id)

      if (cartera) {
        const balanceRevertido = tx.tipo === 'ingreso'
          ? cartera.balance_inicial - Math.abs(tx.monto)
          : cartera.balance_inicial + Math.abs(tx.monto)

        await carteraRepository.update(tx.cartera_id, { balance_inicial: balanceRevertido })

        const carteraActualizada = await carteraRepository.findById(tx.cartera_id)
      }
    }

    await transaccionRepository.remove(id)
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, message: 'No se pudo eliminar la transacción' }
  }
}
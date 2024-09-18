import z from 'zod'
import { BadArgumentsError } from '../../Common/errors/errorClasses.js'
import zodErrorBuilder from '../../Common/utils/zodErrorBuilder.js'
const existencia = z.object({
  id: z.number().positive().optional(),
  productoId: z.number().positive(),
  stock: z.number().positive(),
  costo: z.number().positive(),
  precio: z.number().positive(),
  fechaEntrada: z.string().default(new Date().toLocaleDateString('es-MX'))
})
export const validarExistencia = (objeto) => {
  const result = existencia.safeParse(objeto)
  if (result.success) {
    return result.data
  }
  const error = zodErrorBuilder(result.error)
  throw new BadArgumentsError('Error en los campos para existencia: ' + error)
}
export const validarParcialExistencia = (objeto) => {
  const result = existencia.partial().safeParse(objeto)
  if (result.success) {
    return result.data
  }
  const error = zodErrorBuilder(result.error)
  throw new BadArgumentsError('Error en los campos para existencia parcial: ' + error)
}
export default existencia

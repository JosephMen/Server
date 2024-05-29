import z from 'zod'
import zodErrorBuilder, { arrayZodErrorBuilderMessage } from '../utils/zodErrorBuilder.js'
import { BadSchemaObjectError } from '../middlewares/error/errorClasses'

const ventaInSchema = z.object({
  descripcion: z.string().max(50).default(''),
  esCredito: z.boolean().default(false),
  dependienteId: z.number().optional(),
  clienteId: z.number().optional()
})

const productosInSchema = z.object({
  existenciaId: z.number(),
  cantidad: z.number().min(1)
})
export const listaProductoInSchema = productosInSchema.array()

export const validateArrayProdVInSchema = (object) => {
  const result = listaProductoInSchema.safeParse(object)
  if (!result.success) {
    console.log(result.error)
    const errorMessage = arrayZodErrorBuilderMessage(result.error)
    throw new BadSchemaObjectError(errorMessage)
  }
  return result.data
}

export const validateArrayVentaInSchema = (object) => {
  const result = ventaInSchema.array().safeParse(object)
  if (!result.success) {
    const errorMessage = arrayZodErrorBuilderMessage(result.error)
    throw new BadSchemaObjectError(errorMessage)
  }
  return result.data
}

export function validateVentaInSchema (data) {
  const parse = ventaInSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}
export default ventaInSchema

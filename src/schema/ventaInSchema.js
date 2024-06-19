import z from 'zod'
import zodErrorBuilder, { arrayZodErrorBuilderMessage } from '../utils/zodErrorBuilder.js'
import { BadSchemaObjectError } from '../middlewares/error/errorClasses.js'

const ventaInSchema = z.object({
  descripcion: z.string().max(50).default(''),
  esCredito: z.boolean().default(false),
  dependienteId: z.number().optional(),
  clienteId: z.number().optional()
})

const ventaForUpdateSchema = z.object({
  descripcion: z.string().max(50),
  esCredito: z.boolean(),
  dependienteId: z.number(),
  clienteId: z.number()
})

const productosInSchema = z.object({
  existenciaId: z.number(),
  cantidad: z.number().min(1)
})
export const listaProductoInSchema = productosInSchema.array()

export const validateListaProductosVentaSchema = (object) => {
  const result = listaProductoInSchema.safeParse(object)
  if (!result.success) {
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
export function validateVentaInPartialSchema (data) {
  const parse = ventaForUpdateSchema.partial().safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}
export default ventaInSchema

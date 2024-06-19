import z from 'zod'
import { BadSchemaObjectError } from '../middlewares/error/errorClasses.js'
import zodErrorBuilder from '../utils/zodErrorBuilder.js'
const usuarioSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ required_error: 'Nombre requerido' }),
  permiso: z.string().max(25),
  pasword: z.string().max(20)
})
export const usuarioSchemaObject = {
  usuarioId: '',
  nombre: '',
  imagenUrl: ''
}
export const usuarioAuthSchema = z.object({
  nombre: z.string().min(5).max(25),
  password: z.string().min(5).max(25)
})

export const usuarioEntitySchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(5).max(25),
  password: z.string().min(5).max(25),
  permiso: z.string().min(5).max(25),
  imagenUrl: z.string().optional()
})

export function validateUsuarioAuth (data) {
  const parse = usuarioAuthSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}

export function validateUsuarioEntity (data) {
  const parse = usuarioEntitySchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}
export function validatePartialUsuarioEntity (data) {
  const parse = usuarioEntitySchema.partial().safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}
export default usuarioSchema

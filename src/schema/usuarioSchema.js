import z from 'zod'
import { BadSchemaObjectError } from '../middlewares/error/errorClasses.js'
import zodErrorBuilder from '../utils/zodErrorBuilder.js'
const usuarioSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ required_error: 'Nombre requerido' }),
  permiso: z.string().min(5).max(25),
  pasword: z.string().max(20)
})
export const usuarioSchemaObject = {
  usuarioId: '',
  nombre: '',
  imagenUrl: ''
}
export const usuarioToAuthSchema = z.object({
  nombre: z.string().min(5).max(25),
  password: z.string().min(5).max(25)
})

export const usuarioToStoreSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(5).max(25),
  password: z.string().min(5),
  permiso: z.string().min(5).max(25),
  imagenUrl: z.string().optional()
})

export const usuarioToAddSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(5).max(25),
  password: z.string().min(5).max(25),
  permiso: z.string().min(5).max(25)
})

export function validateUsuarioToAuth (data) {
  const parse = usuarioToAuthSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}

export function validateUsuarioToAdd (data) {
  const parse = usuarioToAddSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}

export function validateUsuarioToStore (data) {
  const parse = usuarioToStoreSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}
export function validatePartialUsuarioToAdd (data) {
  const parse = usuarioToAddSchema.partial().safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}

export function validatePartialUsuarioToStore (data) {
  const parse = usuarioToStoreSchema.partial().safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}
export default usuarioSchema

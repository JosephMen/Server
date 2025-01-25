import z from 'zod'
import { BadSchemaObjectError } from '../../Common/errors/errorClasses.js'
import zodErrorBuilder from '../../Common/utils/zodErrorBuilder.js'
import PERMISOS from '../utils/permissions.js'
import validatePermission from '../utils/validatePermission.js'

const usuarioToAddSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(5).max(30).optional(),
  username: z.string().min(5).max(30),
  password: z.string().min(5).max(25),
  permiso: z.string().min(5).max(25).default(PERMISOS.USER)
})

export function validateUsuarioToAdd (data) {
  const parse = usuarioToAddSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  validatePermission(parse.data)
  return parse.data
}

export function validatePartialUsuarioToAdd (data) {
  const parse = usuarioToAddSchema.partial().safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  validatePermission(parse.data)
  return parse.data
}

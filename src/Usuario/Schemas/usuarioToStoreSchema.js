import z from 'zod'
import zodErrorBuilder from '../../Common/utils/zodErrorBuilder.js'
import { BadSchemaObjectError } from '../../Common/errors/errorClasses.js'
import PERMISOS from '../utils/permissions.js'
import validatePermission from '../utils/validatePermission.js'

const usuarioToStoreSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(5).max(30).optional(),
  username: z.string().min(5).max(30),
  password: z.string().min(5),
  permiso: z.string().min(5).max(25).default(PERMISOS.GUESS),
  imagenUrl: z.string().optional().nullish()
})

export function validateUsuarioToStore (data) {
  const parse = usuarioToStoreSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  validatePermission(parse.data)
  return parse.data
}

export function validatePartialUsuarioToStore (data) {
  const parse = usuarioToStoreSchema.partial().safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  validatePermission(parse.data)
  return parse.data
}

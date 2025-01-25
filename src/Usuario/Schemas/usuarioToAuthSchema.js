import z from 'zod'
import zodErrorBuilder from '../../Common/utils/zodErrorBuilder.js'
import { BadSchemaObjectError } from '../../Common/errors/errorClasses.js'

const usuarioToAuthSchema = z.object({
  username: z.string().min(5).max(25),
  password: z.string().min(5).max(25)
})

export function validateUsuarioToAuth (data) {
  const parse = usuarioToAuthSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}

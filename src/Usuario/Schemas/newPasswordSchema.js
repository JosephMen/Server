import z from 'zod'
import zodErrorBuilder from '../../Common/utils/zodErrorBuilder.js'
import { BadSchemaObjectError } from '../../Common/errors/errorClasses.js'
const newPasswordSchema = z.object({
  id: z.number().min(0),
  prevPassword: z.string().min(5).max(25),
  newPassword: z.string().min(5).max(25)
})

export function validateNewPasswordSchema (data) {
  const parse = newPasswordSchema.safeParse(data)
  if (!parse.success) {
    const message = zodErrorBuilder(parse.error)
    throw new BadSchemaObjectError(message)
  }
  return parse.data
}

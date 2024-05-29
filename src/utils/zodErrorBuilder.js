import { ZodError } from 'zod'
/**
 *
 * @description formatea los errores encontrados en una instancia de <ZodError>
 * @param {ZodError} zodError
 * @returns {string}
 */
export default function (zodError) {
  if (zodError instanceof ZodError === false) throw new Error('No es un error de tipos de zod')
  const errores = zodError.issues.map(
    err => `${err.path.join(',')}: ${err.message}, received: ${err.received}, expected: ${err.expected}`
  )
  return errores.join('\n')
}
/**
 *
 * @description formatea los errores encontrados en una instancia de Array<ZodError>
 * @param {ZodError} zodError
 * @returns {string}
 */
export const arrayZodErrorBuilderMessage = (zodError) => {
  if (zodError instanceof ZodError === false) throw new Error('No es un error de tipos de zod')
  const errores = zodError.errors.map((err, index) => {
    const template = `${++index}: Expected: ${err.expected}, received: ${err.received}
  position: ${err.path[0]}, object property: ${err.path[1]}\n`
    return template
  })
  return errores.join('\n')
}

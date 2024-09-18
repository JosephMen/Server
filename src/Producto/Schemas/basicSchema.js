import z from 'zod'
const basicSchema = z.object({
  nombre: z.string({
    required_error: 'Parametro requerido',
    invalid_type_error: 'Debe ser un string'
  }).max(25, {
    message: 'Maximo 25 caracteres'
  }),
  descripcion: z.string().max(50).optional()
})

export default basicSchema

export const validarBasicSchema = (objeto) => {
  const result = basicSchema.safeParse(objeto)
  if (result.success) return result.data
  return null
}

export const validarPartialBasicSchema = (objeto) => {
  const result = basicSchema.partial().safeParse(objeto)
  if (result.error) return null
  return result.data
}

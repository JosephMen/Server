import z from 'zod'

const productoSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ required_error: 'Nombre requerido', invalid_type_error: 'Debe ser un string' })
    .max(25, { message: 'Máximo 25 caracteres' }),
  codigo: z.string({ required_error: 'Codigo requerido', invalid_type_error: 'Debe ser un string' })
    .max(25, { message: 'Máximo 25 caracteres' }),
  descripcion: z.string({ required_error: 'Descripcion requerido', invalid_type_error: 'Debe ser un string' })
    .max(50, { message: 'Máximo 50 caracteres' }),
  etiquetasId: z.number().array().optional(),
  etiquetasNoRegistradas: z.string().array().optional()
})
export default productoSchema
export const productoSchemaObject = {
  id: '',
  nombre: '',
  codigo: '',
  descripcion: '',
  imagenUrl: ''
}

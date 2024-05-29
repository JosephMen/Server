import z from 'zod'
const usuarioSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ required_error: 'Nombre requerido' })
})
export const usuarioSchemaObject = {
  usuarioId: '',
  nombre: '',
  imagenUrl: ''
}
export default usuarioSchema

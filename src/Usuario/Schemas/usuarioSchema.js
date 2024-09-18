import z from 'zod'
import PERMISOS from '../utils/permissions.js'
const usuarioSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ required_error: 'Nombre requerido' }),
  permiso: z.string().min(5).max(25).default(PERMISOS.GUESS),
  password: z.string().max(20)
})
export const usuarioSchemaObject = {
  usuarioId: '',
  nombre: '',
  imagenUrl: ''
}
export default usuarioSchema

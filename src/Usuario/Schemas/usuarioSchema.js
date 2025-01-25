import z from 'zod'
import PERMISOS from '../utils/permissions.js'
const usuarioSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(5).max(50),
  username: z.string({ required_error: 'Nombre de usuario requerido' }).min(5).max(30),
  permiso: z.string().min(5).max(25).default(PERMISOS.GUESS),
  password: z.string().max(20)
})
export const usuarioSchemaObject = {
  usuarioId: '',
  nombre: '',
  imagenUrl: ''
}
export default usuarioSchema

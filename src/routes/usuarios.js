import { Router } from 'express'
import UsuarioController from '../controllers/usuarioController.js'
import { validateBodyForAddUsuario, validateBodyForUpdateUsuario } from '../middlewares/usuario/usuarioMW.js'
import { validateNumericId } from '../middlewares/common/commonValidate.js'
/**
 *
 * @param {{usuarioController: UsuarioController}} param0
 * @returns {Router}
 */
const createUsuariosRouter = ({ usuarioController }) => {
  const usuariosRouter = Router()
  usuariosRouter.get('/', usuarioController.getAll)
  usuariosRouter.get('/:id', validateNumericId, usuarioController.get)
  usuariosRouter.post('/', validateBodyForAddUsuario, usuarioController.add)
  usuariosRouter.delete('/:id', validateNumericId, usuarioController.delete)
  usuariosRouter.patch('/:id', validateNumericId, validateBodyForUpdateUsuario, usuarioController.update)
  return usuariosRouter
}
export default createUsuariosRouter

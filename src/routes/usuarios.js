import { Router } from 'express'
import UsuarioController from '../controllers/usuarioController.js'
import validateBodyForAuthUsuario, { validateBodyForAddUsuario } from '../middlewares/usuario/usuarioMW.js'
/**
 *
 * @param {{usuarioController: UsuarioController}} param0
 * @returns {Router}
 */
const createUsuariosRouter = ({ usuarioController }) => {
  const usuariosRouter = Router()
  usuariosRouter.get('/', usuarioController.getAll)
  usuariosRouter.get('/:id', usuarioController.get)
  usuariosRouter.post('/', validateBodyForAddUsuario, usuarioController.add)
  usuariosRouter.delete('/:id', usuarioController.delete)
  usuariosRouter.patch('/:id', usuarioController.update)
  return usuariosRouter
}
export default createUsuariosRouter

import { Router } from 'express'
import { MwValidateBodyForAddUsuario, MwValidateBodyForUpdateUsuario, MwValidateNewPassword } from '../Middlewares/usuarioMW.js'
import { MwValidateNumericId } from '../../Common/Middlewares/commonValidate.js'
import parseRequestForImageUpload from '../../Imagen/Middlewares/parseRequestForImageUpload.js'
import { MwValidateImageType } from '../../Imagen/Middlewares/validateMimeTypes.js'
/**
 *
 * @param {{usuarioController: import('../Controller/usuarioController.js').default}} param0
 * @returns {Router}
 */
const createUsuariosRouter = ({ usuarioController }) => {
  const router = Router()
  router.get('/', usuarioController.getAll)
  router.get('/:id', MwValidateNumericId, usuarioController.get)
  router.post('/',
    parseRequestForImageUpload,
    MwValidateImageType,
    MwValidateBodyForAddUsuario,
    usuarioController.add)
  router.delete('/:id', MwValidateNumericId, usuarioController.delete)
  router.patch('/:id',
    parseRequestForImageUpload,
    MwValidateImageType,
    MwValidateNumericId,
    MwValidateBodyForUpdateUsuario,
    usuarioController.update)
  router.patch('/password/:id',
    MwValidateNumericId,
    MwValidateNewPassword,
    usuarioController.changePassword)
  return router
}
export default createUsuariosRouter

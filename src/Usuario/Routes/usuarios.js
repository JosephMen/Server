import { Router } from 'express'
import { MwValidateBodyForAddUsuario, MwValidateBodyForUpdateUsuario, MwValidateNewPassword } from '../Middlewares/usuarioMW.js'
import { MwValidateNumericId } from '../../Common/Middlewares/commonValidate.js'
import parseRequestForImageUpload from '../../Imagen/Middlewares/parseRequestForImageUpload.js'
import { MwValidateImageType } from '../../Imagen/Middlewares/validateMimeTypes.js'
/**
 *
 * @param {Object} param0
 * @param {import('../Controller/usuarioController.js').default} param0.usuarioController
 * @param {import('../../Interfaces/Controllers/IAuthCtrl.js').default} param0.IAuthCtrl
 * @returns {Router}
 */
const createUsuariosRouter = ({ usuarioController, IAuthCtrl }) => {
  const router = Router()
  router.get('/', usuarioController.getAll)
  router.get('/:id', MwValidateNumericId, usuarioController.get)
  router.post('/',
    parseRequestForImageUpload,
    MwValidateImageType,
    MwValidateBodyForAddUsuario,
    IAuthCtrl.checkPermission,
    usuarioController.add)
  router.delete('/:id',
    MwValidateNumericId,
    IAuthCtrl.checkPermission,
    usuarioController.delete)
  router.patch('/:id',
    parseRequestForImageUpload,
    MwValidateImageType,
    MwValidateNumericId,
    MwValidateBodyForUpdateUsuario,
    IAuthCtrl.checkPermission,
    usuarioController.update)
  router.patch('/password/:id',
    MwValidateNumericId,
    MwValidateNewPassword,
    IAuthCtrl.checkPermission,
    usuarioController.changePassword)
  return router
}
export default createUsuariosRouter

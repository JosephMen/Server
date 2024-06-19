import { Router } from 'express'
import AuthenticationController from '../controllers/authController.js'
import validateBodyForAuthUsuario from '../middlewares/usuario/usuarioMW.js'
/**
 *
 * @param {{authenticationController : AuthenticationController}} param0
 */
const createAuthRouter = ({ authenticationController }) => {
  const router = Router()
  router.post('/login', validateBodyForAuthUsuario, authenticationController.login)

  return router
}
export default createAuthRouter

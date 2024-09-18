import { Router } from 'express'
import validateBodyForAuthUsuario from '../../Usuario/Middlewares/usuarioMW.js'
/**
 *
 * @param {{authenticationController : import('../Controller/authController.js').default}} param0
 */
const createAuthRouter = ({ authenticationController }) => {
  const router = Router()
  router.post('/login', validateBodyForAuthUsuario, authenticationController.login)

  return router
}
export default createAuthRouter

import createAuthRouter from './auth.js'
import IRoute from '../../Interfaces/IRoute.js'

export default class AuthRoute extends IRoute {
  #router

  /**
     *
     * @param {import('../Controller/authController.js').default} authenticationController
     */
  constructor (authenticationController) {
    super()
    this.#router = createAuthRouter({ authenticationController })
  }

  get = () => this.#router
  getPath = () => 'auth'
}

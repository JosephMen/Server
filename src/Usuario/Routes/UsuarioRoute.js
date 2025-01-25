import IRoute from '../../Interfaces/IRoute.js'
import createUsuariosRouter from './usuarios.js'

export default class UsuarioRoute extends IRoute {
  /**
   * @type {import('express').Router}
  */
  #route
  /**
   *
   * @param {import('../Controller/usuarioController.js').default} usuarioController
   * @param {import('../../Interfaces/Controllers/IAuthCtrl.js').default} IAuthCtrl
   */
  constructor (usuarioController, IAuthCtrl) {
    super()
    this.#route = createUsuariosRouter({ usuarioController, IAuthCtrl })
  }

  get = () => {
    return this.#route
  }

  getPath = () => 'usuarios'
}

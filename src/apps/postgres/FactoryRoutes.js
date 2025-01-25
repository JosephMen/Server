import ImagenRelacion from '../../Imagen/Model/imagen-relacion.js'
import ImagenModel from '../../Imagen/Model/imagen.js'
import ImagenService from '../../Imagen/Services/imagenService.js'
import IFactoryRoutes from '../../Interfaces/Factory/IFactoryRoutes.js'
import IControllersEnum from '../../Interfaces/IControllersEnum.js'
import IModelsEnum from '../../Interfaces/IModelsEnum.js'
import IServicesEnum from '../../Interfaces/IServicesEnum.js'
import UsuarioModel from '../../Usuario/Model/usuario.js'
import UsuarioService from '../../Usuario/Services/usuarioService.js'
import UsuarioController from '../../Usuario/Controller/usuarioController.js'

import AuthController from '../../Authorization/Controller/authController.js'
import UsuarioRoute from '../../Usuario/Routes/UsuarioRoute.js'
import AuthRoute from '../../Authorization/Routes/AuthRoute.js'
export default class FactoryRoutes extends IFactoryRoutes {
  #cliente
  #serviceMap
  #modelMap
  #controllerMap
  /**
  *
  * @param {import('pg').Pool} cliente
  */
  constructor (cliente) {
    super()
    this.#cliente = cliente
    this.#serviceMap = new Map()
    this.#modelMap = new Map()
    this.#controllerMap = new Map()
    this.#buildModels()
    this.#buildServices()
    this.#buildControllers()
  }

  /**
   * @return {Array<import('../../Interfaces/IRoute.js').default>}
   */
  getRoutes = () => {
    const usuarioController = this.#controllerMap.get(IControllersEnum.usuarios)
    const authenticationController = this.#controllerMap.get(IControllersEnum.autorizacion)

    const usuarioRoute = new UsuarioRoute(usuarioController, authenticationController)
    const authRoute = new AuthRoute(authenticationController)
    return [usuarioRoute, authRoute]
  }

  #buildModels = () => {
    const usuarioModel = new UsuarioModel({ cliente: this.#cliente })
    this.#modelMap.set(IModelsEnum.usuarios, usuarioModel)

    const imagenModel = new ImagenModel({ cliente: this.#cliente })
    this.#modelMap.set(IModelsEnum.imagen, imagenModel)

    const imagenRelacionModel = new ImagenRelacion({ cliente: this.#cliente })
    this.#modelMap.set(IModelsEnum.imagenRelacion, imagenRelacionModel)
  }

  #buildServices = () => {
    const usuarioModel = this.#modelMap.get(IModelsEnum.usuarios)
    const imagenModel = this.#modelMap.get(IControllersEnum.imagen)
    const imagenRelacionModel = this.#modelMap.get(IModelsEnum.imagenRelacion)

    const imagenService = new ImagenService(imagenModel, imagenRelacionModel)
    this.#serviceMap.set(IServicesEnum.imagen, imagenService)

    const usuarioService = new UsuarioService(usuarioModel, imagenService)
    this.#serviceMap.set(IServicesEnum.usuarios, usuarioService)
  }

  #buildControllers = () => {
    const usuarioService = this.#serviceMap.get(IServicesEnum.usuarios)

    const usuarioController = new UsuarioController({ usuarioService })
    this.#controllerMap.set(IControllersEnum.usuarios, usuarioController)

    const authController = new AuthController({ usuarioService })
    this.#controllerMap.set(IControllersEnum.autorizacion, authController)
  }
}

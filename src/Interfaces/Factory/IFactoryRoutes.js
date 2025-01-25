import { NotImplementedError } from '../../Common/errors/errorClasses.js'
import IRoutesEnum from '../IRoutesEnum.js'
export default class IFactoryRoutes {
  /**
   * @param {keyof IRoutesEnum} routeName
   * @return {Array<import('../IRoute.js'.default)>}
   */
  getRoutes = (routeName) => {
    this.#throw('getRoutes')
  }

  #throw = (message) => {
    throw new NotImplementedError(`Metodo ${message} en IFactoryRoutes no implementado`)
  }
}

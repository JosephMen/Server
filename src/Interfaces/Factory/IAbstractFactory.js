import { NotImplementedError } from '../../Common/errors/errorClasses.js'
import IFactoryEnum from '../IFactoryEnum.js'
export default class IAbstractFactory {
  /**
   * @param {keyof IFactoryEnum} factoryName
   * @return {import('./IFactoryRoutes.js').IFactoryRoutes}
   */
  getFactory = (factoryName) => {
    throw new NotImplementedError('No implementado metodo getFactory de IAbstractFactory')
  }
}

import { BadArgumentsError } from '../Common/errors/errorClasses.js'
import IAbstractFactory from '../Interfaces/Factory/IAbstractFactory.js'
import IFactoryEnum from '../Interfaces/IFactoryEnum.js'
import FactoryRoutesP from './postgres/FactoryRoutes.js'
export default class AFRoutes extends IAbstractFactory {
  #clientePostgres
  /**
   *
   * @param {object} param0
   * @param {import('pg').Pool} param0.clientePostgres
   */
  constructor ({ clientePostgres }) {
    super()
    this.#clientePostgres = clientePostgres
  }

  /**
     *
     * @param {keyof IFactoryEnum} factoryName
     * @returns {import('../Interfaces/Factory/IFactoryRoutes.js').default}
     */
  getFactory = (factoryName) => {
    if (!IFactoryEnum[factoryName]) throw new BadArgumentsError(`El nombre "${factoryName}" no es un nombre de fabrica valido`)

    if (factoryName === IFactoryEnum.postgres) {
      const factory = new FactoryRoutesP(this.#clientePostgres)
      return factory
    }
  }
}

import IGenericEntity from '../../Common/interfaces/models/IGenericEntity'

export default class Marca extends IGenericEntity {
  /**
   *
   * @param {import('pg').Pool} cliente cliente de conexion
   */
  constructor (cliente) {
    super({ tabla: 'marca', cliente })
  }
}

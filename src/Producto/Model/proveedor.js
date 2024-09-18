import IGenericEntity from '../../Common/interfaces/models/IGenericEntity.js'

export default class Proveedor extends IGenericEntity {
  /**
   *
   * @param {import('pg').Pool} cliente cliente de conexion
   */
  constructor (cliente) {
    super({ tabla: 'proveedor', cliente })
  }
}

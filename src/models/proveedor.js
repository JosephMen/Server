import IGenericEntity from '../interfaces/models/IGenericEntity.js'

import pkg from 'pg'
const { Pool } = pkg
export default class Proveedor extends IGenericEntity {
  /**
   *
   * @param {Pool} cliente cliente de conexion
   */
  constructor (cliente, logger = null) {
    super({ tabla: 'proveedor', cliente, logger })
  }
}

import IGenericEntity from '../interfaces/models/IGenericEntity.js'

import pkg from 'pg'
const { Pool } = pkg
export default class Marca extends IGenericEntity {
  /**
   *
   * @param {Pool} cliente cliente de conexion
   */
  constructor (cliente, logger = null) {
    super({ tabla: 'marca', cliente, logger })
  }
}

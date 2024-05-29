import IGenericEntity from '../interfaces/models/IGenericEntity.js'

export default class Categoria extends IGenericEntity {
  /**
   *
   * @param {import('pg').PoolClient} cliente cliente de conexion
   */
  constructor (cliente, logger = null) {
    super({ tabla: 'categoria', cliente, logger, values: ['nombre', 'imagenurl', 'descripcion'] })
  }
}

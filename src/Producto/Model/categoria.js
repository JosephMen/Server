import IGenericEntity from '../../Common/interfaces/models/IGenericEntity.js'

export default class Categoria extends IGenericEntity {
  /**
   *
   * @param {import('pg').PoolClient} cliente cliente de conexion
   */
  constructor (cliente) {
    super({ tabla: 'categoria', cliente, values: ['nombre', 'imagenurl', 'descripcion'] })
  }
}

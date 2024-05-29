import { CONSULTAS_PRODUCTOS } from '../consultas.js'
import IEntity from '../interfaces/models/IEntity.js'
import { BadArgumentsError, ConnectionError } from '../middlewares/error/errorClasses.js'
import { mapEntityToProducto } from '../utils/mapper.js'
import pkg from 'pg'
const { Pool } = pkg

export default class ProductoModel extends IEntity {
  /**
   *
   * @param {{cliente: Pool}} cliente
   */
  constructor ({ cliente, logger = null }) {
    super()
    this.logger = logger
    this.Cliente = cliente
  }

  getAll = async ({ offset = 0 }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_PRODUCTOS.OBTENER_TODOS, [offset])
      return result.rows.map(pr => mapEntityToProducto(pr))
    } catch (e) {
      throw new ConnectionError(e, 'Error obteniendo productos')
    }
  }

  getById = async (id) => {
    try {
      if (id === undefined) throw new BadArgumentsError('No se encuentra argumento id')
      const result = await this.Cliente.query(CONSULTAS_PRODUCTOS.OBTENER, [id])
      if (result.rowCount > 0) return mapEntityToProducto(result.rows[0])
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error obteniendo producto')
    }
  }

  add = async ({ nombre, codigo, descripcion }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_PRODUCTOS.AGREGAR, [nombre, codigo, descripcion])
      const { productoid } = result.rows[0]
      return productoid
    } catch (e) {
      throw new ConnectionError(e, 'Error agregando producto')
    }
  }

  update = async ({ id, nombre, codigo, descripcion, imagenUrl }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_PRODUCTOS.ACTUALIZAR, [id, nombre, codigo, descripcion, imagenUrl])
      return result
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar producto')
    }
  }

  delete = async (id) => {
    try {
      if (id === undefined) throw new BadArgumentsError('No se encuentra argumento id')
      const result = await this.Cliente.query(CONSULTAS_PRODUCTOS.ELIMINAR, [id])
      return result
    } catch (e) {
      throw new ConnectionError(e, 'Error al eliminar producto')
    }
  }
}

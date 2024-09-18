import { BadArgumentsError, ConnectionError } from '../../Common/errors/errorClasses.js'
import { CONSULTAS_PRODUCTOS } from '../queries.js'
import { mapEntityToProducto } from '../utils/mapper.js'

export default class ProductoModel {
  /**
   *
   * @param {{cliente: import('pg').Pool}} cliente
   */
  constructor ({ cliente }) {
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

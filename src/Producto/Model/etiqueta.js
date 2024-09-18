import { BadArgumentsError, ConnectionError, RelationalDataError } from '../../Common/errors/errorClasses.js'
import { CONSULTAS_ETIQUETA } from '../queries.js'
BadArgumentsError
export default class EtiquetaModel {
  /**
   *
   * @param {{cliente: import('pg').Pool}} param0
   */
  constructor ({ cliente }) {
    this.Cliente = cliente
  }

  /**
   *
   * @param {{nombre: string}} param0
   * @returns {Promise<Number>}
   */
  add = async ({ nombre }) => {
    if (typeof nombre !== 'string') throw BadArgumentsError('El argumento nombre debe ser string')
    try {
      const result = await this.Cliente.query(CONSULTAS_ETIQUETA.AGREGAR, [nombre])
      const { id } = result.rows[0]
      return id
    } catch (e) {
      throw new ConnectionError(e, 'Error al agregar etiqueta')
    }
  }

  /**
   *
   * @param {Number} id Id de la etiqueta
   * @returns {Promise<Boolean>}
   */
  delete = async (id) => {
    if (typeof id !== 'number') throw BadArgumentsError('El argumento id debe ser un numero entero')
    try {
      const result = await this.Cliente.query(CONSULTAS_ETIQUETA.ELIMINAR, [id])
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al eliminar etiqueta')
    }
  }

  update = async ({ nombre, id }) => {
    if (typeof id !== 'number') throw BadArgumentsError('El argumento id debe ser un numero entero')
    if (typeof nombre !== 'string') throw BadArgumentsError('El argumento nombre debe ser string')
    try {
      const result = await this.Cliente.query(CONSULTAS_ETIQUETA.ACTUALIZAR, [id, nombre])
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar etiqueta')
    }
  }

  getById = async (id) => {
    if (typeof id !== 'number') throw BadArgumentsError('El argumento id debe ser un numero entero')
    try {
      const result = await this.Cliente.query(CONSULTAS_ETIQUETA.OBTENER, [id])
      if (result.rowCount > 0) return result.rows[0]
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener una etiqueta')
    }
  }

  getAll = async () => {
    try {
      const result = await this.Cliente.query(CONSULTAS_ETIQUETA.OBTENER_TODOS)
      if (result.rowCount === 0) return []
      return result.rows
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener etiquetas')
    }
  }

  /**
   *
   * @param {Array<Number>} etiquetas Id de las etiquetas
   * @param {Number} productoId id del producto
   */
  attachEtiquetasToProducto = async (etiquetas, productoId) => {
    if (Array.isArray(etiquetas) === false || typeof productoId !== 'number') {
      throw new BadArgumentsError('Error en entradas')
    }
    if (etiquetas.every(value => typeof value === 'number') === false) {
      throw new BadArgumentsError('Todos los id de etiquetas deben ser numeros')
    }
    const cliente = await this.Cliente.connect()
    try {
      await cliente.query('BEGIN')
      for (const etiquetaId of etiquetas) {
        await cliente.query(CONSULTAS_ETIQUETA.ATTACH_X_PRODUCTO, [etiquetaId, productoId])
      }
      await cliente.query('COMMIT')
      return 1
    } catch (e) {
      await cliente.query('ROLLBACK')
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al agregar etiquetas a productos')
      throw new RelationalDataError(e, 'Error al relacionar etiquetas con producto')
    } finally {
      cliente.release()
    }
  }

  /**
   *
   * @param {Array<Number>} etiquetasId Id de las etiquetas
   * @param {Number} productoId id del producto
   */
  deleteEtiquetasFromProducto = async (etiquetasId, productoId) => {
    if (Array.isArray(etiquetasId) === false || typeof productoId !== 'number') {
      throw new BadArgumentsError('Error en entradas')
    }
    if (etiquetasId.every(value => typeof value === 'number') === false) {
      throw new BadArgumentsError('Todos los id de etiquetas deben ser numeros')
    }
    const cliente = await this.Cliente.connect()
    try {
      for (const etiquetaId of etiquetasId) {
        await cliente.query(CONSULTAS_ETIQUETA.DELETE_OF_PRODUCTO, [productoId, etiquetaId])
      }
      return true
    } catch (e) {
      throw new ConnectionError(e, 'Error al eliminar etiquetas del producto')
    } finally {
      cliente.release()
    }
  }

  /**
   *
   * @param {String} nombre El nombre de la etiqueta
   * @returns {Promise<Boolean>}
   */
  existe = async (nombre) => {
    if (typeof nombre !== 'string') throw BadArgumentsError('Error en argumento nombre')
    try {
      const result = await this.Cliente.query(CONSULTAS_ETIQUETA.CONTAR, [nombre])
      const { cantidad } = result.rows[0]
      return cantidad > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al verificar existencia de etiqueta')
    }
  }
}

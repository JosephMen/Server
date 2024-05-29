import { CONSULTA_EXISTENCIA } from '../consultas.js'
import { BadArgumentsError, ConnectionError, RelationalDataError } from '../middlewares/error/errorClasses.js'
import { validarExistencia, validarParcialExistencia } from '../schema/existenciaSchema.js'
import queryBuilder from '../utils/queryBuilder.js'
const { createInsertQuery, createUpdateQuery } = queryBuilder
/**
 * @typedef existencia
 * @property {Number | undefined} id El Identificador
 * @property {Number} productoId id asociado a la existencia
 * @property {Number} precio precio del producto
 * @property {Number} costo costo del producto
 * @property {Number} stock cantidad de producto disponible
 * @property {String} fechaEntrada fecha en la que se adquirio el producto
 * @property {String} fechaModifacion fecha de su ultima modificacion
 */
export default class Existencia {
  #cliente
  #table
  /**
   * @param {object} param0
   * @param {import("pg").PoolClient} param0.cliente
   */
  constructor ({ cliente }) {
    this.#cliente = cliente
    this.#table = 'existencia'
  }

  #parserEntity = (e) => {
    return {
      id: e.id,
      productoId: e.productoid,
      precio: e.precio,
      costo: e.costo,
      stock: e.stock,
      fechaEntrada: e?.fechaentrada.toLocaleDateString('es-MX'),
      fechaModificacion: e?.fechamodificacion.toLocaleDateString('es-MX')
    }
  }

  /**
   *
   * @param {Number} id id de la existencia
   * @returns {Promise<existencia | null>}
   */
  get = async (id) => {
    if (typeof id !== 'number') throw new BadArgumentsError('El id deber ser un entero')
    if (id <= 0) throw new BadArgumentsError('El id deber ser un numero positivo')
    try {
      const resultado = await this.#cliente.query(CONSULTA_EXISTENCIA.OBTENER, [id])
      if (resultado.rowCount === 0) return null
      return this.#parserEntity(resultado.rows[0])
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al traer existencia')
      throw new RelationalDataError(e, 'Error al traer existencia')
    }
  }

  /**
   *
   * @returns {Promise<Array<existencia>>}
   */
  getAll = async () => {
    try {
      const resultado = await this.#cliente.query(CONSULTA_EXISTENCIA.OBTENER_TODOS)
      if (resultado.rowCount === 0) return []
      return resultado.rows.map(e => this.#parserEntity(e))
    } catch (e) {
      throw new ConnectionError(e, 'Error al traer existencia')
    }
  }

  /**
   *
   * @param {Object} param
   * @param {existencia} param.datos datos a ser actualizados
   * @param {import('pg').PoolClient} param.cliente cliente para efectuar transaccion
   * @returns {Promise<Boolean>}
   */
  update = async ({ datos, cliente = null }) => {
    const data = validarParcialExistencia(datos)
    cliente = cliente ?? this.#cliente
    const { id } = data
    if (!id) throw new BadArgumentsError('Debe proporcionar un id para actualizar tabla')
    try {
      data.fechaModifacion = new Date().toLocaleDateString('es-MX')
      const [query, values] = createUpdateQuery({ table: this.#table, id, data })
      if (query === null) return true
      const result = await cliente.query(query, values)
      return result.rowCount > 0
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al actualizar existencia')
      throw new RelationalDataError(e, 'Error de relacion de datos al actualizar existencia')
    }
  }

  /**
   * @param {Object} param
   * @param {existencia} param.datos
   * @return {Promise<Number>}
   */
  add = async ({ datos }) => {
    const data = validarExistencia(datos)
    try {
      const [query, values] = createInsertQuery({ table: 'existencia', data })
      const result = await this.#cliente.query(query, values)
      return result.rows[0].id
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al registrar existencia')
      throw new RelationalDataError(e, 'Error de relacion de datos al registrar nueva existencia')
    }
  }

  delete = async (id) => {
    if (typeof id !== 'number') throw new BadArgumentsError('Argumento id no es entero')
    try {
      const result = await this.#cliente.query(CONSULTA_EXISTENCIA.ELIMINAR, [id])
      return result.rowCount === 1
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al eliminar existencia')
      throw new RelationalDataError(e, 'Error de relacion de datos al eliminar existencia')
    }
  }
}

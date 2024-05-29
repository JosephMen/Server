import ventaSchema, { validarPartialVentaSchema, validarVentaSchema } from '../schema/ventaSchema.js'
import { CONSULTA_VENTA } from '../consultas.js'
import { BadArgumentsError, ConnectionError, RelationalDataError } from '../middlewares/error/errorClasses.js'
import { ZodError } from 'zod'
import dateFormat from '../utils/dateFormat.js'
import queryBuilder from '../utils/queryBuilder.js'
const { createInsertQuery, createUpdateQuery } = queryBuilder

/**
 * @typedef venta
 * @param {number }id id de la entidad,
 * @param {number} fechaRealizada: fecha de la venta,
 * @param {string} descripcion: detalle de la venta
 * @param {number} clienteId: cliente registrado
 * @param {number} total: total de la venta para el cliente
 * @param {number} ganancia: la diferencia entre costo y precio cliente,
 * @param {boolean} esCredito: determinancia del credito,
 * @param {number} dependienteId: id del dependiente que atendio,
 * @param {number} costo lo que cuesta para el negocio la venta
 */
export default class Venta {
  #cliente
  #logger
  #table
  /**
   * @param {object} param0
   * @param {import('pg').PoolClient} param0.cliente cliente de base de datos
   * @param {Function} param0.logger el logger donde se enviaran los mensajes
   */
  constructor ({ cliente, logger = null }) {
    this.#cliente = cliente
    this.#logger = logger
    this.#table = 'venta'
  }

  /**
   *
   * @param {ZodError} error
   * @returns {string}
   */
  #buildErrorMessage = (error) => {
    const errores = error.issues.map((err) => {
      return `${err.path.join(',')}: ${err.message}, received: ${err.received}, expected: ${err.expected}`
    })
    return errores.join('\n')
  }

  #buildUpdateQuery = (datos) => {
    const entradas = Object.entries(datos)
    if (entradas.length === 0) return ['', []]
    const values = []
    const sets = entradas.map(([name, value], index) => {
      values.push(value)
      return `${name}=$${index + 2}`
    }).join(', ')
    const query = ['UPDATE VENTA SET', sets, 'WHERE ID=$1'].join(' ')
    return [query, values]
  }

  #parseEntity = (entidad) => {
    return {
      id: entidad.id,
      fechaRealizada: dateFormat(entidad.fecharealizada?.toLocaleDateString('es-MX')),
      descripcion: entidad.descripcion,
      clienteId: entidad.clienteid,
      total: entidad.total,
      ganancia: entidad.ganancia,
      esCredito: entidad.escredito,
      dependienteId: entidad.dependienteid,
      costo: entidad.costo
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {import('pg').PoolClient} param0.cliente cliente para efectuar transaccion
   * @param {venta} param0.datos objeto con los campos mapeados de la tabla venta
   * @returns {Promise<Number>}
   */
  add = async ({ datos, cliente }) => {
    const data = validarVentaSchema(datos)
    cliente = cliente ?? this.#cliente
    try {
      const [query, values] = createInsertQuery({ table: this.#table, data })
      if (this.#logger) {
        this.#logger('query: ', query)
        this.#logger('values: ', values)
      }
      const result = await cliente.query(query, values)
      return result.rows[0].id
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al guardar venta')
      throw new RelationalDataError(e, 'Error al agregar nueva venta')
    }
  }

  get = async (id) => {
    if (typeof id !== 'number' || id < 1) throw new BadArgumentsError('El id debe ser un numero positivo')
    try {
      if (this.#logger) {
        this.#logger('Query: ', CONSULTA_VENTA.OBTENER)
        this.#logger('Values: ', { id })
      }

      const result = await this.#cliente.query(CONSULTA_VENTA.OBTENER, [id])
      if (result.rowCount === 0) return null
      const entidad = result.rows[0]
      return this.#parseEntity(entidad)
    } catch (e) {
      throw new ConnectionError(e, 'Error de conexion al obtener venta por id')
    }
  }

  getAll = async () => {
    try {
      if (this.#logger) this.#logger('Query: ', CONSULTA_VENTA.OBTENER_TODOS)
      const result = await this.#cliente.query(CONSULTA_VENTA.OBTENER_TODOS)
      return result.rows.map(entidad => this.#parseEntity(entidad))
    } catch (e) {
      throw new ConnectionError(e, 'Error de conexion al obtener ventas')
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {Number} param0.id Id del registro a actualizar
   * @param {venta} param0.datos datos que se van a actualizar
   * @param {import('pg').PoolClient} param0.cliente cliente con el que se lleva acabo la transaccion
   * @returns {Promise<Boolean>}
   */
  update = async ({ id, datos, cliente }) => {
    if (typeof id !== 'number' || id < 1) throw new BadArgumentsError('Id debe ser un numero positivo')
    cliente = cliente ?? this.#cliente
    const data = validarPartialVentaSchema(datos)
    const [query, values] = createUpdateQuery({ table: this.#table, data, id })
    if (query === null) return true
    try {
      if (this.#logger) {
        this.#logger('query: ', query)
        this.#logger('values: ', values)
      }
      const result = await cliente.query(query, values)
      return result.rowCount === 1
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error de conexion al actualizar venta')
      throw new RelationalDataError(e, 'Error al agregar nueva venta')
    }
  }

  /**
   *
   * @param {Number} id identificador
   * @returns {Promise<Boolean>}
   */
  delete = async (id) => {
    if (typeof id !== 'number' || id < 1) throw new BadArgumentsError('Id debe ser un numero positivo')
    try {
      if (this.#logger) {
        this.#logger('query: ', CONSULTA_VENTA.ELIMINAR)
        this.#logger('values: ', { id })
      }
      const result = await this.#cliente.query(CONSULTA_VENTA.ELIMINAR, [id])
      return result.rowCount === 1
    } catch (e) {
      throw new ConnectionError(e, 'Error de conexion al tratar de borrar venta')
    }
  }

  /**
   *
   * @returns {Promise<import('pg').PoolClient>}
   */
  getClient = async () => { await this.#cliente.connect() }
}

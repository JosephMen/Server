import { CONSULTAS_GENERIC } from '../../../consultas.js'
import { BadArgumentsError, ConnectionError, RelationalDataError } from '../../errors/errorClasses.js'

export default class IGenericEntity {
  /**
   * @type {String}
   */
  #tabla
  /**
   * @type {String}
   */
  #consulta_getAll
  /**
   * @type {String}
   */
  #consulta_add
  /**
   * @type {String}
   */
  #consulta_update
  /**
   * @type {String}
   */
  #consulta_get
  /**
   * @type {String}
   */
  #consulta_delete
  /**
   * @type {Array<String>}
   */
  #valores

  /**
   *
   * @param {Object} param
   * @param {import('pg').Pool} param.cliente 'cliente de base de datos'
   * @param {String[]} [param.values] 'valores de la tabla'
   * @param {String} param.tabla 'la tabla de la entidad'
   */
  constructor ({ tabla, values = ['nombre', 'imagenurl'], cliente }) {
    this.Cliente = cliente
    this.#consulta_getAll = CONSULTAS_GENERIC.GET_ALL(tabla)
    this.#consulta_add = CONSULTAS_GENERIC.ADD(tabla, values)
    this.#consulta_update = CONSULTAS_GENERIC.UPDATE(tabla, values)
    this.#consulta_get = CONSULTAS_GENERIC.GET(tabla)
    this.#consulta_delete = CONSULTAS_GENERIC.DELETE(tabla)
    this.#valores = values
    this.#tabla = tabla
  }

  /**
   *
   * @returns {Promise<Array<Object>>}
   */
  getAll = async () => {
    try {
      const result = await this.Cliente.query(this.#consulta_getAll)
      const { rows } = result
      if (result.rowCount === 0) return []
      return rows
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(`Error al obtener informacion de ${this.#tabla}`)
      throw new RelationalDataError('Error con la tabla ' + this.#tabla)
    }
  }

  /**
   *
   * @param {Object} values valores
   * @returns {Promise<Number>}
   */
  add = async (values) => {
    try {
      const valores = this.#valores.map(valor => values[valor])
      const result = await this.Cliente.query(this.#consulta_add, valores)
      if (result.rowCount === 0) return []
      const { id } = result.rows[0]
      return id
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(`Error al obtener informacion de ${this.#tabla}`)
      throw new RelationalDataError('Error con la tabla ' + this.#tabla)
    }
  }

  update = async ({ id, ...rest }) => {
    if (typeof id !== 'number') {
      throw new BadArgumentsError('id debe ser entero para actualizar en la tabla ' + this.#tabla + ', encontrado: ' + (typeof id))
    }
    try {
      const valores = this.#valores.map(val => rest[val])
      valores.unshift(id)
      const result = await this.Cliente.query(this.#consulta_update, valores)
      return result.rowCount > 0
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(`Error al obtener informacion de ${this.#tabla}`)
      throw new RelationalDataError(e, 'Error con la tabla ' + this.#tabla)
    }
  }

  get = async (id) => {
    if (typeof id !== 'number') {
      throw new BadArgumentsError('id debe ser entero para obtener de la tabla ' + this.#tabla + ', encontrado: ' + (typeof id))
    }
    try {
      const result = await this.Cliente.query(this.#consulta_get, [id])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(`Error al obtener informacion de ${this.#tabla}`)
      throw new RelationalDataError('Error con la tabla ' + this.#tabla)
    }
  }

  delete = async (id) => {
    try {
      if (typeof id !== 'number') throw BadArgumentsError('Id debe ser entero para eliminar en la tabla ' + this.#tabla)
      const result = await this.Cliente.query(this.#consulta_delete, [id])
      return result.rowCount > 0
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(`Error al obtener informacion de ${this.#tabla}`)
      throw new RelationalDataError('Error con la tabla ' + this.#tabla)
    }
  }
}

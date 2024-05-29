import { listaProductosVentaSchema, validarParcialProductoVenta, validarProductoVenta } from '../schema/productoVentaSchema.js'
import zodErrorBuilder from '../utils/zodErrorBuilder.js'
import { BadArgumentsError, ConnectionError, RelationalDataError } from '../middlewares/error/errorClasses.js'
export default class ProductoVenta {
  #cliente
  #query_insert
  #logger
  /**
   *
   * @param {Object} param0
   * @param {Function} param0.logger logger donde se registran las consultas
   * @param {import("pg").PoolClient} param0.cliente cliente de conexion con base de datos
   */
  constructor ({ cliente, logger = null }) {
    this.#cliente = cliente
    this.#logger = logger
    this.#query_insert = `INSERT INTO 
    productoVenta(ventaId, existenciaId, cantidad, precioTotal, precioUnitario, costoUnitario, costoTotal, ganaciaTotal)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`
  }

  #createInsertQuery = (datos) => {
    const values = []
    const keys = []
    const indexes = []
    Object.entries(datos).forEach(([key, value], index) => {
      values.push(value)
      keys.push(key)
      indexes.push(`$${index + 1}`)
    })
    const query = `INSERT INTO productoVenta(${keys.join(',')}) VALUES (${indexes.join(',')})`
    return [query, values]
  }

  #parseEntity = (e) => {
    return {
      ventaId: e.ventaid,
      existenciaId: e.existenciaid,
      cantidad: e.cantidad,
      precioTotal: e.preciototal,
      precioUnitario: e.preciounitario,
      costoUnitario: e.costounitario,
      costoTotal: e.costototal,
      gananciaTotal: e.gananciaTotal
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {Object} param0.productoVenta datos a ser insertados en la tabla productoVenta
   * @param {import('pg').PoolClient} param0.cliente cliente para efectuar transaccion
   * @returns {Promise<Boolean>}
   */
  add = async ({ productoVenta, cliente = null }) => {
    const data = validarProductoVenta(productoVenta)
    cliente = cliente ?? this.#cliente
    try {
      const [query, values] = this.#createInsertQuery(data)
      if (this.#logger) {
        this.#logger('Query: ', query)
        this.#logger('values: ', values)
      }
      const result = await cliente.query(query, values)
      return result.rowCount === 1
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error de conexion al registrar producto de venta')
      throw new RelationalDataError(e, 'Error relacional al agregar registro de producto de venta')
    }
  }

  #createUpdateQuery = (datos) => {
    const { existenciaId, ventaId } = datos
    delete datos.existenciaId
    delete datos.ventaId

    if (existenciaId === undefined || ventaId === undefined) {
      throw new BadArgumentsError('existencia y ventaId deben estar incluidos para poder actualizar')
    }
    const values = []
    const sets = Object.entries(datos).map(([key, value], index) => {
      values.push(value)
      return `${key}=$${index + 3}`
    })
    if (sets.length === 0) return [null, null]
    values.unshift(ventaId, existenciaId)
    const query = `UPDATE productoVenta SET ${sets.join(', ')} WHERE ventaId=$1 AND existenciaId=$2`
    return [query, values]
  }

  /**
   *
   * @param {Object} param0
   * @param {Object} param0.productoVenta datos de la existencia
   * @param {import('pg').PoolClient} param0.cliente cliente con que se efectua la transaccion
   * @returns
   */
  update = async ({ productoVenta, cliente }) => {
    const data = validarParcialProductoVenta(productoVenta)
    try {
      const [query, values] = this.#createUpdateQuery(data)
      if (query === null) return true
      if (this.#logger) {
        this.#logger('Query: ', query)
        this.#logger('values: ', values)
      }
      const result = await cliente.query(query, values)
      return result.rowCount === 1
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error de conexion al actualizar producto de venta')
      throw new RelationalDataError(e, 'Error relacional al actualizar producto de venta')
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {Array<Object>} param0.productos productos que se van a registrar a venta
   * @param {import('pg').PoolClient} param0.cliente
   */
  addArray = async ({ productos, cliente }) => {
    if (cliente !== null) throw BadArgumentsError('El cliente de conexion que registra la venta no debe ser null')
    const parse = listaProductosVentaSchema.safeParse(productos)
    if (!parse.success) {
      const error = zodErrorBuilder(parse.error)
      throw new BadArgumentsError('Error en los productos de venta: ' + error)
    }
    try {
      const listaProductos = parse.data
      if (listaProductos.length === 0) return true
      listaProductos.forEach(async existencia => {
        const {
          ventaId, existenciaId, cantidad,
          precioTotal, precioUnitario, costoUnitario,
          costoTotal, totalGanancia
        } = existencia
        const values = [ventaId, existenciaId, cantidad,
          precioTotal, precioUnitario, costoUnitario,
          costoTotal, totalGanancia]

        await cliente.query(this.#query_insert, values)
      })
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError('Error al agregar productos a venta')
      throw e
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {Number | undefined} param0.ventaId el id de la venta a consultar
   * @param {Number | undefined} param0.existenciaId el id del existencia a consultar de la venta
   * @returns
   */
  getAll = async ({ ventaId, existenciaId }) => {
    let id = -1
    let property = ''
    if (ventaId) {
      if (typeof ventaId !== 'number') throw BadArgumentsError('ventaId debe ser un numero entero')
      id = ventaId
      property = 'ventaId'
    } else {
      if (typeof existenciaId !== 'number') throw BadArgumentsError('existenciaId debe ser un numero entero')
      id = existenciaId
      property = 'existenciaId'
    }
    try {
      const query = `SELECT * FROM productoVenta where ${property}=$1`
      if (this.#logger) {
        this.#logger('Query: ', query)
        this.#logger('Values: ', { id })
      }
      const result = await this.#cliente.query(query, [id])
      return result.rows.map(e => this.#parseEntity(e))
    } catch (e) {
      throw new ConnectionError(e, 'Error de conexion al consultar productos vendidos')
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {Number} param0.ventaId id de la venta especifica
   * @param {Object} param0.existenciaId id del existencia especifico
   * @returns
   */
  get = async ({ ventaId, existenciaId }) => {
    if (typeof ventaId !== 'number') throw BadArgumentsError('ventaId debe ser un numero entero')
    if (typeof existenciaId !== 'number') throw BadArgumentsError('existenciaId debe ser un numero entero')

    try {
      const query = 'SELECT * FROM productoVenta WHERE ventaId=$1 AND existenciaId=$2'
      if (this.#logger) {
        this.#logger('Query: ', query)
        this.#logger('values: ', { ventaId, existenciaId })
      }
      const result = await this.#cliente.query(query, [ventaId, existenciaId])
      if (result.rowCount === 0) return null
      return this.#parseEntity(result.rows[0])
    } catch (e) {
      throw new ConnectionError(e, 'Error de conexion al consultar existencia vendida')
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {Number} param0.existenciaId id del existencia especifico
   * @param {Number} param0.ventaId id de la venta especifica
   * @param {import('pg').PoolClient} param0.cliente cliente con el que se efectua la transaccion
   * @returns {Promise<Boolean>}
   */
  delete = async ({ ventaId, existenciaId, cliente }) => {
    if (typeof ventaId !== 'number') throw BadArgumentsError('ventaId debe ser un numero entero')
    if (typeof existenciaId !== 'number') throw BadArgumentsError('existenciaId debe ser un numero entero')

    try {
      const query = 'DELETE FROM ventaProducto WHERE ventaId=$1 AND existenciaId=$2'
      if (this.#logger) {
        this.#logger('Query: ', query)
        this.#logger('values: ', { ventaId, existenciaId })
      }
      const result = await cliente.query(query, [ventaId, existenciaId])
      return result.rowCount === 1
    } catch (e) {
      throw new ConnectionError(e, 'Error de conexion al eliminar existencia vendida')
    }
  }
}

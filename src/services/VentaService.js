import ProductoVenta from '../models/productoVenta.js'
import Venta from '../models/venta.js'
import Existencia from '../models/existencia.js'
import { BadArgumentsError } from '../middlewares/error/errorClasses.js'
import ProductoVentaService from './productoVentaService.js'
import ExistenciaService from './existenciaService.js'
import { ventaSchemaUtil } from '../schema/ventaSchema.js'
/**
 * @typedef productoVenta
 * @property {number} ventaId
 * @property {number} existenciaId
 * @property {number} cantidad
 * @property {number} precioTotal
 * @property {number} precioUnitario
 * @property {number} costoUnitario
 * @property {number} costoTotal
 * @property {number} gananciaTotal
 */

/**
 * @typedef productoVentaIn
 * @property {number} existenciaId
 * @property {number} cantidad
 */

/**
 * @typedef venta
 * @property {number} id
 * @property {string} fechaRealizada
 * @property {descripcion} descripcion
 * @property {number | null} clienteId
 * @property {number} total
 * @property {number} ganancia
 * @property {boolean} esCredito
 * @property {number | null} dependienteId
 * @property {number} costo
 */

/**
 * @typedef ventaIn
 * @property {string} descripcion
 * @property {boolean} esCredito
 * @property {number} dependienteId
 * @property {number} clienteId
 * @property {string | undefined} fechaRealizada
 *
 */

/**
 * @typedef ventaHecha
 * @property {venta} venta
 * @property {Array<productoVenta>} productosVenta
 */

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
export default class VentaService {
  #ventaModelo
  #existenciaService
  #productoVentaService

  /**
   * @param {Object} param0
   * @param {Venta} param0.ventaModelo
   * @param {ProductoVentaService} param0.productoVentaSer
   * @param {ExistenciaService} param0.existenciaSer
   */
  constructor ({ ventaModelo, productoVentaSer, existenciaSer }) {
    this.#ventaModelo = ventaModelo
    this.#productoVentaService = productoVentaSer
    this.#existenciaService = existenciaSer
  }

  /**
   *
   * @param {Promise<any>} func funcion a convertirse en transaccion
   */
  #doTransaction = async (func, params) => {
    const cliente = await this.#ventaModelo.getClient()
    try {
      await cliente.query('BEGIN')
      params.cliente = cliente
      const result = await func(params)
      await cliente.query('COMMIT')
      return result
    } catch (e) {
      await cliente.query('ROLLBACK')
      throw e
    } finally {
      cliente.release()
    }
  }

  /**
   *
   * @param {Object} param0
   * @param {Number} param0.id id del registro a actualizar
   * @param {Array<productoVentaIn>} param0.productosVenta datos a actualizar
   * @returns {Promise<venta>}
   */
  updateTransact = async ({ ventaIn, productosVenta }) => {
    return await this.#doTransaction(this.update, { ventaIn, productosVenta })
  }

  /**
   * @param {Object} param0
   * @param {ventaIn} param0.ventaIn los datos necesarios para crear un registro de venta
   * @param {Array<productoVentaIn>} param0.productosVenta productos que conforman una venta
   * @returns {Promise<ventaHecha>} Detalles de la venta
   */
  addTransact = async ({ productosVenta, ventaIn }) => {
    return await this.#doTransaction(this.add, { productosVenta, ventaIn })
  }

  /**
   *
   * @param {Object} param0
   * @param {Array<productoVentaIn>} param0.productosVenta productos que conforman una venta
   * @param {ventaIn} param0.ventaIn los datos necesarios para crear un registro de venta
   * @param {import('pg').PoolClient} param0.cliente cliente con el que se realizan los queries de escritura
   * @returns {Promise<ventaHecha>} Detalles de la venta
   */
  add = async ({ productosVenta, ventaIn, cliente }) => {
    const venta = { ...ventaSchemaUtil, ...ventaIn }
    venta.id = await this.#ventaModelo.add(venta)
    for (const producto of productosVenta) {
      const existencia = await this.#existenciaService.obtener(producto.existenciaId)

      if (existencia === null) throw new BadArgumentsError('No hay registro de existencia con ese id: ' + producto.existenciaId)
      if (existencia.stock < producto.cantidad) throw new BadArgumentsError('No hay suficiente existencia disponible')

      const productoVenta = await this.#productoVentaService.agregar({ productoVentaIn: producto, existencia, cliente })
      existencia.stock -= producto.cantidad
      await this.#existenciaService.actualizar({ existencia, cliente })
      venta.addProductoVenta(productoVenta)
    }
    await this.#ventaModelo.update({ id: venta.id, data: venta, cliente })
    return { venta, productosVenta }
  }

  /**
   *
   * @param {Object} param0
   * @param {ventaIn} param0.ventaIn datos de la venta
   * @param {Array<productoVentaIn>} param0.productosVenta datos a actualizar
   * @param {import('pg').PoolClient} cliente cliente con el que se realizan las queries de lectura
   * @returns {Promise<venta>}
   */
  update = async ({ ventaIn, productosVenta, cliente }) => {
    const productosVentaDB = await this.#productoVentaService.obtenerTodos({ ventaId: ventaIn.id })
    const ventaDB = await this.#ventaModelo.get(ventaIn.id)
    const ventaAct = { ...ventaSchemaUtil, ...ventaDB, ...ventaIn }

    for (const producto of productosVenta) {
      const productoDB = productosVentaDB.find(pvDB => pvDB.existenciaId === producto.existenciaId)
      const existencia = await this.#existenciaService.obtener(producto.existenciaId)
      if (existencia === null) throw new BadArgumentsError('No hay registro de existencia con ese id: ' + producto.existenciaId)

      if (!productoDB) {
        existencia.stock -= producto.cantidad
        if (existencia.stock < 0) throw new BadArgumentsError('No hay suficiente existencia para suplir demanda')
        producto.costoUnitario = existencia.costo
        producto.precioUnitario = existencia.precio
        const productoVenta = await this.#productoVentaService.actualizar({ prodVIn: producto, cliente })
        await this.#existenciaService.actualizar(existencia)
        ventaAct.addProductoVenta(productoVenta)
        continue
      }

      if (productoDB.cantidad === producto.cantidad) continue

      existencia.stock += (productoDB.cantidad - producto.cantidad)
      if (existencia.stock < 0) throw new BadArgumentsError('No hay suficiente existencia para suplir demanda')

      ventaAct.removeProdVenta(productoDB)
      const nuevoProductoVenta = await this.#productoVentaService.actualizar({ prodVIn: producto, prodVAct: productoDB, cliente })
      ventaAct.addProductoVenta(nuevoProductoVenta)
    }

    for (const prodDB of productosVentaDB) {
      const permanece = productosVenta.findIndex(pv => pv.existenciaId === prodDB.existenciaId) !== -1
      if (permanece) continue
      ventaAct.removeProdVenta(prodDB)
      await this.#productoVentaService.eliminar(prodDB)
    }
    await this.#ventaModelo.update({ id: ventaAct.id, datos: ventaAct, cliente })
    return ventaAct
  }

  /**
   * @param id identificador de la venta
   */
  get = async (id) => {
    return await this.#ventaModelo.get(id)
  }

  /**
   *
   * @param {Object} param0
   * @param {Number} param0.ventaId
   * @param {Number} param0.existenciaId
   * @returns
   */
  getAll = async () => {
    return await this.#ventaModelo.getAll()
  }

  delete = async (id) => {
    return await this.#ventaModelo.delete(id)
  }
}

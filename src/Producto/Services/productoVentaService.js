import ProductoVenta from '../Model/productoVenta.js'
import { productoVentaSchemaUtil } from '../Schemas/productoVentaSchema.js'

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
 * @property {number} cantidad
 */

/**
 * @typedef existencia
 * @property {Number} precio precio del producto
 * @property {Number} costo costo del producto
 */
export default class ProductoVentaService {
  #productoVentaModel
  #schema
  /**
   *
   * @param {Object} param0
   * @param {ProductoVenta} param0.productoVentaModelo
   */
  constructor ({ productoVentaModelo }) {
    this.#productoVentaModel = productoVentaModelo
    this.#schema = { ...productoVentaSchemaUtil }
  }

  /**
   *
   * @param {Object} param0
   * @param {productoVentaIn} param0.productoVentaIn
   * @param {existencia} param0.existencia
   * @param {import('pg').PoolClient} param0.cliente cliente cliente con el que se efectua la transaccion
   */
  agregar = async ({ productoVentaIn, existencia, cliente }) => {
    const productoVenta = {
      ...this.#schema,
      ...productoVentaIn,
      costoUnitario: existencia.costo,
      precioUnitario: existencia.precio
    }
    productoVenta.autoCalculo()
    await this.#productoVentaModel.add({ productoVenta, cliente })
    return productoVenta
  }

  /**
   * @param {Object} param
   * @param {Number} param.ventaId
   * @param {Number} param.existenciaId
   */
  obtener = async ({ ventaId, existenciaId }) => {
    return await this.#productoVentaModel.get({ ventaId, existenciaId })
  }

  /**
   *
   * @param {object} productoVenta
   * @param {number} productoVenta.existenciaId
   * @param {number} productoVenta.ventaId
   * @param {import('pg').PoolClient} cliente
   */
  eliminar = async ({ existenciaId, ventaId }, cliente) => {
    return await this.#productoVentaModel.delete({ existenciaId, ventaId, cliente })
  }

  /**
   * @param {Object} param
   * @param {productoVentaIn} param.prodVIn
   * @param {productoVenta} param.prodVAct
   * @param {import('pg').PoolClient} param.cliente
   */
  actualizar = async ({ prodVIn, prodVAct, cliente }) => {
    const productoVenta = {
      ...this.#schema,
      ...prodVAct,
      ...prodVIn
    }
    productoVenta.autoCalculo()
    await this.#productoVentaModel.update({ productoVenta, cliente })
    return productoVenta
  }

  /**
   *
   * @param {Object} param0
   * @param {Number} param0.ventaId
   * @param {Number} param0.existenciaId
   */
  obtenerTodos = async ({ ventaId, existenciaId }) => {
    return await this.#productoVentaModel.getAll({ ventaId, existenciaId })
  }
}

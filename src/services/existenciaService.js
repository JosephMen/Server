import Existencia from '../models/existencia.js'

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

export default class ExistenciaService {
  #existenciaModel
  /**
   * @param {Object} param0
   * @param {Existencia} param0.existenciaModel modelo de existencia
   */
  constructor ({ existenciaModel }) {
    this.#existenciaModel = existenciaModel
  }

  obtener = async (id) => {
    const data = await this.#existenciaModel.get(id)
    return data
  }

  obtenerTodos = async () => {
    return await this.#existenciaModel.getAll()
  }

  /**
   *
   * @param {Object} param0
   * @param {import('pg').PoolClient} param0.cliente
   * @param {existencia} param0.existencia
   * @returns
   */
  actualizar = async ({ existencia, cliente }) => {
    const result = await this.#existenciaModel.update({ datos: existencia, cliente })
    if (!result) return null
    return result
  }

  agregar = async (datos) => {
    datos.id = await this.#existenciaModel.add(datos)
    return datos
  }

  eliminar = async (id) => {
    return await this.#existenciaModel.delete(id)
  }
}

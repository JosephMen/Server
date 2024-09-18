import EtiquetaModel from '../Model/etiqueta.js'
import { BadArgumentsError } from '../../Common/errors/errorClasses.js'
/**
 * @typedef Etiqueta
 * @property {Number} id
 * @property {String} nombre
 */

export default class EtiquetaService {
  /**
  *
  * @param {EtiquetaModel} etiquetaModel
  */
  constructor (etiquetaModel) {
    this.etiquetaModel = etiquetaModel
  }

  /**
   *
   * @param {{nombre: String}} param0
   * @returns {Promise<Etiqueta>}
   */
  add = async ({ nombre }) => {
    const resultado = { nombre }
    resultado.id = await this.etiquetaModel.add(resultado)
    return resultado
  }

  /**
   *
   * @param {Number} id
   * @returns {Promise<Boolean>}
   */
  delete = async (id) => {
    return await this.etiquetaModel.delete(id)
  }

  /**
   *
   * @param {Etiqueta} param0
   * @returns {Promise<Boolean>}
   */
  update = async ({ nombre, id }) => {
    return await this.etiquetaModel.update({ nombre, id })
  }

  /**
   *
   * @param {Number} id
   * @returns {Promise<Etiqueta>}
   */
  get = async (id) => {
    return await this.etiquetaModel.getById(id)
  }

  /**
   *
   * @param {Number} id
   * @returns {Promise<Array<Etiqueta>>}
   */
  getAll = async () => {
    return await this.etiquetaModel.getAll()
  }

  /**
   *
   * @param {Array<Number>} etiquetasArray id de las etiquetas
   * @param {Number} productoId id del producto
   */
  etiquetarProducto = async (etiquetas, productoId) => {
    return await this.etiquetaModel.attachEtiquetasToProducto(etiquetas, productoId)
  }

  desetiquetarProducto = async (etiquetas, productoId) => {
    return await this.etiquetaModel.deleteEtiquetasFromProducto(etiquetas, productoId)
  }
}

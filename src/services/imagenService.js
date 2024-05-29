import IImagenService from '../interfaces/services/IImagenService.js'
import ImagenRelacion from '../models/imagen-relacion.js'
import ImagenModel from '../models/imagen.js'
import MimeTypes, { getExtension } from '../utils/mimeTypes.js'
export default class ImagenService extends IImagenService {
  #imagenRelacion
  /**
   *
   * @param {ImagenModel} imagenModel modelo de la base de datos
   * @param {ImagenRelacion} imagenRelacion modelo para la tabla imagen_relacion
   */
  constructor (imagenModel, imagenRelacion) {
    super()
    this.imagenModel = imagenModel
    this.#imagenRelacion = imagenRelacion
  }

  /**
   * @description retorna la url de la imagen asociada a la entidad
   * @param {string} entidad entidad relacionada a la imagen
   * @param {number} id id de la entidad
   * @returns {Promise<string>}
   */
  getResto = async (entidad, id) => {
    const imagenId = await this.#imagenRelacion.getImagenId({ entidad, id })
    if (imagenId < 0) return ''
    return `imagen/${imagenId}`
  }

  /**
   *@description Metodo tanto para agregar o como para actualizar la informacion de una imagen
   * a las entidades y actualizar la relacion
   * @param {String} entidad el nombre de la entidad a agregar imagen
   * @param {number} id el identificador
   * @param {BinaryData | null} imagen El archivo imagen
   * @returns {Promise<String>}
   */
  addResto = async (entidad, id, imagen) => {
    const { name: nombre, data: imagenData, mimetype: mimeType } = imagen
    const recordImagen = { imagenData, nombre, mimeType }
    let imagenId = null
    const cantidadImagenes = await this.#imagenRelacion.countImagenes({ entidad, id })
    if (cantidadImagenes === 0) {
      imagenId = await this.imagenModel.add(recordImagen)
      await this.#imagenRelacion.addImagen({ entidad, imagenId, entidadId: id })
    } else {
      imagenId = await this.#imagenRelacion.getImagenId({ entidad, id })
      recordImagen.imagenId = imagenId
      await this.imagenModel.update(recordImagen)
    }
    return `imagen/${imagenId}`
  }

  attachImageToProducto = async (imagen, productoId) => {
    const { name: nombre, data: imagenData, mimetype: mimeType } = imagen
    const cantidad = await this.imagenModel.countImagesByProducto(productoId)
    const recordImagen = { imagenData, productoId, nombre, mimeType }
    let idRetrieved = null
    cantidad === 0
      ? idRetrieved = await this.imagenModel.add(recordImagen)
      : await this.imagenModel.updateByProducto(recordImagen)
    const imagenId = idRetrieved ?? await this.imagenModel.getIdByProducto(productoId)
    return `imagen/${imagenId}`
  }

  attachImageToUsuario = async (imagen, usuarioId) => {
    const { name: nombre, data: imagenData, mimetype: mimeType } = imagen
    const recordImg = { imagenData, usuarioId, nombre, mimeType }
    const cantidad = await this.imagenModel.countImagesByUsuario(usuarioId)
    let idRetrieved = null
    cantidad === 0
      ? idRetrieved = await this.imagenModel.add(recordImg)
      : await this.imagenModel.updateByUsuario(recordImg)
    const imagenId = idRetrieved ?? await this.imagenModel.getIdByUsuario(usuarioId)
    return `imagen/${imagenId}`
  }
}

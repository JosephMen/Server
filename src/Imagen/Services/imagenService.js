import IImagenService from '../../Common/interfaces/services/IImagenService.js'
import ImageFieldNames from '../Utils/ImageFieldNames.js'
export default class ImagenService extends IImagenService {
  #imagenRelacion
  #imagenNameLength
  #imagenModel
  /**
   *
   * @param {import('../Model/imagen.js').default} imagenModel modelo de la base de datos
   * @param {import('../Model/imagen-relacion.js').default} imagenRelacion modelo para la tabla imagen_relacion
   */
  constructor (imagenModel, imagenRelacion) {
    super()
    this.#imagenModel = imagenModel
    this.#imagenRelacion = imagenRelacion
    this.#imagenNameLength = 50
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
    const { name, data: imagenData, mimetype: mimeType } = imagen
    const nombre = this.#formatImageName(name)
    const recordImagen = { imagenData, nombre, mimeType }
    let imagenId = null
    const cantidadImagenes = await this.#imagenRelacion.countImagenes({ entidad, id })
    if (cantidadImagenes === 0) {
      imagenId = await this.#imagenModel.add(recordImagen)
      await this.#imagenRelacion.addImagen({ entidad, imagenId, entidadId: id })
    } else {
      imagenId = await this.#imagenRelacion.getImagenId({ entidad, id })
      recordImagen.imagenId = imagenId
      await this.#imagenModel.update(recordImagen)
    }
    return `imagen/${imagenId}`
  }

  /**
   *
   * @param {object} imagen
   * @param {number} id
   * @param {import('pg').PoolClient} clientForTransact
   * @returns
   */
  attachImageToProducto = async ({ imagen, id, clientForTransact }) => {
    const field = ImageFieldNames.productoId
    return await this.#attachImageTo({ field, imagen, id, clientForTransact })
  }

  /**
   *
   * @param {object} imagen
   * @param {number} id
   * @param {import('pg').PoolClient} clientForTransact
   * @returns
   */
  attachImageToUsuario = async ({ imagen, id, clientForTransact }) => {
    const field = ImageFieldNames.usuarioId
    return await this.#attachImageTo({ field, imagen, id, clientForTransact })
  }

  /**
   *
   * @param {keyof ImageFieldNames} field
   * @param {object} imagen
   * @param {number} id
   * @param {import('pg').PoolClient} clientForTransact
   * @returns
   */
  #attachImageTo = async ({ field, imagen, id, clientForTransact }) => {
    const { name, data: imagenData, mimetype: mimeType } = imagen
    const nombre = this.#formatImageName(name)
    const recordImg = { imagenData, nombre, mimeType }
    recordImg[field] = id
    const cantidad = await this.#imagenModel.countImages(field, id, clientForTransact)
    let idRetrieved = null
    cantidad === 0
      ? idRetrieved = await this.#imagenModel.add(recordImg, clientForTransact)
      : await this.#imagenModel.update(field, id, recordImg, clientForTransact)
    const imagenId = idRetrieved ?? await this.#imagenModel.getIdGived(field, id, clientForTransact)
    return `imagen/${imagenId}`
  }

  /**
   *
   * @param {object} param
   * @param {number} param.id
   * @returns
   */
  getImagenFromUsuario = async ({ id }) => {
    return await this.#imagenModel.getByFieldId(id, ImageFieldNames.usuarioId)
  }

  /**
   * @param {object} param
   * @param {number} param.id
   * @param {import('pg').PoolClient} param.clientForTransact
   * @returns
   */
  deleteImageFromUsuario = async ({ id, clientForTransact }) => {
    const field = ImageFieldNames.usuarioId
    const hasImage = await this.#imagenModel.countImages(field, id) > 0
    if (hasImage) return await this.#imagenModel.delete({ field, id }, clientForTransact)
    return true
  }

  /**
   * @param {object} param
   * @param {number} param.id
   * @param {import('pg').PoolClient} param.clientForTransact
   * @returns
   */
  deleteImageFromProducto = async ({ id, clientForTransact }) => {
    const field = ImageFieldNames.productoId
    const hasImage = await this.#imagenModel.countImages(field, id) > 0
    if (hasImage) return await this.#imagenModel.delete({ field, id }, clientForTransact)
    return await this.#imagenModel.delete({ field, id }, clientForTransact)
  }

  /**
   * @param {object} param
   * @param {number} param.id
   * @param {import('pg').PoolClient} param.clientForTransact
   * @returns
   */
  deleteImagenFrom = async ({ id, clientForTransact }) => {
    const field = ImageFieldNames.usuarioId
    return await this.#imagenModel.delete({ field, id, clientForTransact })
  }

  deleteImagenRelacion = async ({ entidad, id }) => {
    return await this.#imagenRelacion.deleteImagen({ entidad, entidadId: id })
  }

  /**
   *
   * @param {string} name
   */
  #formatImageName = (name) => {
    if (name.length <= 50) return name
    return name.slice(name.length - 50)
  }
}

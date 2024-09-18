import { CONSULTAS_IMAGEN } from '../queries.js'
import { BadArgumentsError, ConnectionError, RelationalDataError } from '../../Common/errors/errorClasses.js'
import ImageFieldNames from '../Utils/ImageFieldNames.js'
import { isAllowedImageMimeType } from '../Utils/ImageMimeTypes.js'
export default class ImagenModel {
  #cliente
  #table
  /**
   *
   * @param {{cliente: import('pg').Pool}} param0
   */
  constructor ({ cliente }) {
    this.#cliente = cliente
    this.#table = 'imagenes'
  }

  /**
   * @description devuelve la data de la imagen y el mimetype
   * @param {number} id
   * @param {keyof ImageFieldNames} field
   * @returns {Promise<{mimetype: string, imagen: ArrayBuffer}> | null}
   */
  getByFieldId = async (id, field) => {
    this.#validateFieldAndId(field, id)
    try {
      const query = `SELECT imagen, mimetype FROM ${this.#table} WHERE ${field} = $1`
      const result = await this.#cliente.query(query, [id])
      if (result.rowCount > 0) return result.rows[0]
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener imagen')
    }
  }

  /**
   *
   * @param {object} param0
   * @param {import('pg').PoolClient} cliente
   * @returns {Promise<Number>}
   */
  add = async ({ imagenData, usuarioId = null, productoId = null, nombre, mimeType }, clientForTransact = null) => {
    this.#validateImageForAdd({ mimeType, nombre, imagenData })
    const cliente = clientForTransact ?? this.#cliente
    try {
      const result = await cliente.query(CONSULTAS_IMAGEN.AGREGAR, [imagenData, usuarioId, productoId, nombre, mimeType])
      return result.rows[0].id
    } catch (e) {
      throw new ConnectionError(e, 'Error al agregar imagen')
    }
  }

  #validateImageForAdd = ({ mimeType, nombre, imagenData }) => {
    if (!isAllowedImageMimeType(mimeType)) throw new BadArgumentsError('El mimetype de la imagen no es permitido')
    if (typeof nombre !== 'string') throw new BadArgumentsError('El nombre de la imagen debe ser un string')
    if (nombre.length > 50) throw new BadArgumentsError('El nombre no debe exceder 50 caracteres')
    if (!imagenData) throw new BadArgumentsError('No se encuentran datos de imagen a guardar')
  }

  /**
   *
   * @param {keyof ImageFieldNames} field
   * @param {Object} param0
   * @param {import('pg').PoolClient} clientForTransact
   * @returns
   */
  update = async (field, id, { imagenData, nombre, mimeType }, clientForTransact = null) => {
    this.#validateImageForUpload({ field, id, mimeType, nombre })
    const cliente = clientForTransact ?? this.#cliente
    try {
      const query = `UPDATE imagenes SET imagen=$2, nombre=$3, mimetype=$4 WHERE ${field}=$1`
      const result = await cliente.query(query, [id, imagenData, nombre, mimeType])
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar imagen')
    }
  }

  #validateImageForUpload = ({ field, id, mimeType, nombre }) => {
    if (!ImageFieldNames[field]) throw new BadArgumentsError(`El campo field:${field} no es parte de la tabla imagenes`)
    if (!id) throw new BadArgumentsError('El id debe ser un numero para poder actualizar imagen')
    if (!isAllowedImageMimeType(mimeType)) throw new BadArgumentsError('El mimetype de la imagen no es permitido')
    if (typeof nombre !== 'string') throw new BadArgumentsError('El nombre de la imagen debe ser un string')
    if (nombre.length > 50) throw new BadArgumentsError('El nombre no debe exceder 50 caracteres')
  }

  getAll = () => {
    // const result = await Cliente.query(CONSULTAS_IMAGEN.OBTENER)
    return []
  }

  /**
   *
   * @param {keyof ImageFieldNames} field
   * @param {number} id
   * @returns
   */
  countImages = async (field, id) => {
    this.#validateFieldAndId(field, id)
    try {
      const query = `SELECT COUNT(id) FROM imagenes WHERE ${field} = $1`
      const result = await this.#cliente.query(query, [id])
      const { count } = result.rows[0]
      return Number.parseInt(count)
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al contar imagenes por ' + field)
      throw new RelationalDataError(e, 'Error al contar imagenes por ' + field)
    }
  }

  /**
   * @description Para obtener el id de la imagen dado su campo productoId o UsuarioId
   * @param {keyof ImageFieldNames} field
   * @param {Number} id
   * @param {import('pg').PoolClient} clientForTransact
   * @returns {Promise<number>}
   */
  getIdGived = async (field, id, clientForTransact = null) => {
    this.#validateFieldAndId(field, id)
    const cliente = clientForTransact ?? this.#cliente
    try {
      const query = `SELECT id FROM imagenes WHERE ${field}=$1`
      const result = await cliente.query(query, [id])
      if (result.rowCount > 0) {
        return result.rows[0].id
      }
      return -1
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener imagen ')
    }
  }

  /**
   *
   * @param {object} param
   * @param {number } param.id
   * @param {keyof ImageFieldNames } param.field
   * @param {import('pg').PoolClient} param.clientForTransact
   */
  delete = async ({ field, id, clientForTransact } = {}) => {
    this.#validateFieldAndId(field, id)
    try {
      const cliente = clientForTransact ?? this.#cliente
      const result = await cliente.query(`DELETE FROM IMAGENES WHERE ${field} = ${id}`)
      return result.rowCount > 0
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al eliminar imagen')
      throw new RelationalDataError(e, `Error relacional al eliminar imagen, argumentos: id=${id}, field=${field}`)
    }
  }

  #validateFieldAndId (field, id) {
    if (!field || !id) throw new BadArgumentsError('No se suministraron argumentos necesarios para eliminar imagen')
    if (!ImageFieldNames[field]) throw new BadArgumentsError(`El campo ${field} no es un campo de imagenes`)
    if (typeof id !== 'number') throw new BadArgumentsError('Id debe ser un numero')
  }
}

import { CONSULTAS_IMAGEN } from '../consultas.js'
import pkg from 'pg'
import IEntity from '../interfaces/models/IEntity.js'
import { BadArgumentsError, ConnectionError } from '../middlewares/error/errorClasses.js'
const { Pool } = pkg

export default class ImagenModel extends IEntity {
  /**
   *
   * @param {{cliente: Pool}} param0
   */
  constructor ({ cliente }) {
    super()
    this.Cliente = cliente
  }

  getByUserId = async (usuarioId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.OBTENER_POR_USUARIO, [usuarioId])
      if (result.rowCount > 0) return result.rows[0]
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener id Usuario')
    }
  }

  getById = async (imagenId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.OBTENER, [imagenId])
      if (result.rowCount > 0) return result.rows[0]
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener imagen')
    }
  }

  /**
   *
   * @param {object} param0
   * @returns {Promise<Number>}
   */
  add = async ({ imagenData, usuarioId = null, productoId = null, nombre, mimeType }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.AGREGAR, [imagenData, usuarioId, productoId, nombre, mimeType])
      const { imagenid } = result.rows[0]
      return imagenid
    } catch (e) {
      throw new ConnectionError(e, 'Error al agregar imagen')
    }
  }

  update = async ({ imagenId, imagenData, nombre, mimeType }) => {
    if (!imagenId) throw new BadArgumentsError('Error al tratar de actualizar imagen, no se encuentra propiedad imagenId')
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.ACTUALIZAR, [imagenId, imagenData, nombre, mimeType])
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar imagen')
    }
  }

  updateByProducto = async ({ imagenData, productoId, nombre, mimeType }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.ACTUALIZAR_X_PRODUCTO, [productoId, imagenData, nombre, mimeType])
      return result
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar imagen de producto')
    }
  }

  updateByUsuario = async ({ imagenData, usuarioId, nombre, mimeType }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.ACTUALIZAR_X_USUARIO, [usuarioId, imagenData, nombre, mimeType])
      return result
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar imagen de usuario')
    }
  }

  getAll = () => {
    // const result = await Cliente.query(CONSULTAS_IMAGEN.OBTENER)
    return []
  }

  countImagesByProducto = async (productoId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.CONTAR_X_PRODUCTO, [productoId])
      const { count } = result.rows[0]
      return Number.parseInt(count)
    } catch (e) {
      throw new ConnectionError(e, 'Error al contar imagenes por producto')
    }
  }

  countImagesByUsuario = async (usuarioId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.CONTAR_X_USUARIO, [usuarioId])
      const { count } = result.rows[0]
      return Number.parseInt(count)
    } catch (e) {
      throw new ConnectionError(e, 'Error al contar imagenes por usuario')
    }
  }

  getIdByUsuario = async (usuarioId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.OBTENER_ID_X_USUARIO, [usuarioId])
      if (result.rowCount > 0) {
        const { imagenid } = result.rows[0]
        return imagenid
      }
      return -1
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener imagen por usuario')
    }
  }

  getIdByProducto = async (productoId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_IMAGEN.OBTENER_ID_X_PRODUCTO, [productoId])
      if (result.rowCount > 0) {
        const { imagenid } = result.rows[0]
        return imagenid
      }
      return -1
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener imagen por Producto')
    }
  }
}

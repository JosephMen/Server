import CONSULTAS_USUARIO from '../consultas.js'
import IEntity from '../interfaces/models/IEntity.js'
import { ConnectionError } from '../middlewares/error/errorClasses.js'
import { mapEntityToUsuario } from '../utils/mapper.js'
/**
 * @typedef Usuario
 * @property {Number} id the Id
 * @property {string} nombre Nombre
 * @property {string} imagenUrl la direccion de la imagen
 */
export default class UsuarioModel extends IEntity {
  constructor ({ cliente }) {
    super()
    this.Cliente = cliente
  }

  /**
   *
   * @returns {Promise<Array<Usuario>>}
   */
  getAll = async ({ offset = 0 }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_USUARIO.OBTENER_TODOS, [offset])
      if (result.rowCount === 0) return []
      return result.rows.map(us => mapEntityToUsuario(us))
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener usuarios')
    }
  }

  /**
   *
   * @param {number} usuarioId
   * @returns {Promise<Usuario>}
   */
  getById = async (usuarioId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_USUARIO.OBTENER, [usuarioId])
      if (result.rowCount > 0) return mapEntityToUsuario(result.rows[0])
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener un usuario')
    }
  }

  /**
   *
   * @param {{nombre: String}} param0 Nombre del usuario
   * @returns
   */
  add = async ({ nombre }) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_USUARIO.AGREGAR, [nombre])
      const { usuarioid } = result.rows[0]
      return usuarioid
    } catch (e) {
      throw new ConnectionError(e, 'Error al insertar nuevo usuario')
    }
  }

  /**
   *
   * @param {Number} usuarioId
   * @returns {Promise<Boolean>}
   */
  delete = async (usuarioId) => {
    try {
      const result = await this.Cliente.query(CONSULTAS_USUARIO.OBTENER, [usuarioId])
      if (result.rowCount > 0) {
        await this.Cliente.query(CONSULTAS_USUARIO.ELIMINAR, [usuarioId])
        return true
      }
      return false
    } catch (e) {
      throw new ConnectionError(e, 'Error al eliminar usuario')
    }
  }

  /**
   *
   * @param {Usuario} param0
   * @returns {Promise<Boolean>}
   */
  update = async ({ id, nombre, imagenUrl }) => {
    try {
      const usuario = await this.Cliente.query(CONSULTAS_USUARIO.OBTENER, [id])
      if (usuario.rowCount > 0) {
        const result = await this.Cliente.query(CONSULTAS_USUARIO.ACTUALIZAR, [id, nombre, imagenUrl])
        return result.rowCount > 0
      }
      return false
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar usuario')
    }
  }
}

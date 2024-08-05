import CONSULTAS_USUARIO from '../consultas.js'
import IEntity from '../interfaces/models/IEntity.js'
import { BadArgumentsError, ConnectionError } from '../middlewares/error/errorClasses.js'
import { validatePartialUsuarioToStore, validateUsuarioToStore } from '../schema/usuarioSchema.js'
import { mapEntityToUsuario } from '../utils/mapper.js'
import queryBuilder from '../utils/queryBuilder.js'
const { createInsertQuery, createUpdateQuery } = queryBuilder
/**
 * @typedef Usuario
 * @property {Number | undefined} id the Id
 * @property {string} nombre Nombre
 * @property {string | undefined} imagenUrl la direccion de la imagen
 * @property {string} password la direccion de la imagen
 * @property {string} permiso la direccion de la imagen
 */
export default class UsuarioModel extends IEntity {
  #table
  #cliente
  /**
   *
   * @param {Object} param0
   * @param {import('pg').PoolClient} param0.cliente
   */
  constructor ({ cliente }) {
    super()
    this.#cliente = cliente
    this.#table = 'usuarios'
  }

  /**
   *
   * @returns {Promise<Array<Usuario>>}
   */
  getAll = async ({ offset } = { offset: 0 }) => {
    try {
      const result = await this.#cliente.query(CONSULTAS_USUARIO.OBTENER_TODOS, [offset])
      if (result.rowCount === 0) return []
      return result.rows.map(us => mapEntityToUsuario(us))
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener usuarios')
    }
  }

  /**
   *
   * @param {number} id
   * @returns {Promise<Usuario | null>}
   */
  getById = async (id) => {
    if (typeof id !== 'number') throw new BadArgumentsError('Id debe ser un entero')
    try {
      const result = await this.#cliente.query(CONSULTAS_USUARIO.OBTENER, [id])
      if (result.rowCount > 0) return mapEntityToUsuario(result.rows[0])
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener un usuario')
    }
  }

  /**
   *
   * @param {string} name
   */
  getByName = async (name) => {
    if (typeof name !== 'string') throw new BadArgumentsError('name debe ser una cadena no vacia')
    if (name.trim().length === 0) throw new BadArgumentsError('name no puede ser una cadena solo compuesta de espacios')
    try {
      const result = await this.#cliente.query(CONSULTAS_USUARIO.OBTENER_X_NOMBRE, [name])
      if (result.rowCount > 0) return mapEntityToUsuario(result.rows[0])
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener un usuario')
    }
  }

  /**
   * @param {Usuario} usuario
   * @param {Usuario} param0
   * @returns {Promise<Number>}
   */
  add = async (usuario) => {
    const data = validateUsuarioToStore(usuario)
    const [query, values] = createInsertQuery({ table: this.#table, data })
    try {
      const result = await this.#cliente.query(query, values)
      return result.rows[0].id
    } catch (e) {
      console.log('Error detectado en el modelo', e)
      throw new ConnectionError(e, 'Error al insertar nuevo usuario')
    }
  }

  /**
   *
   * @param {Number} id
   * @returns {Promise<Boolean>}
   */
  delete = async (id) => {
    if (typeof id !== 'number') throw new BadArgumentsError('Id debe ser un entero')
    try {
      const result = await this.#cliente.query(CONSULTAS_USUARIO.ELIMINAR, [id])
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al eliminar usuario')
    }
  }

  /**
   *
   * @param {Usuario} usuario
   * @returns {Promise<Boolean>}
   */
  update = async (usuario) => {
    const data = validatePartialUsuarioToStore(usuario)
    const [query, values] = createUpdateQuery({ table: this.#table, data, id: data.id })
    try {
      const result = await this.#cliente.query(query, values)
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar usuario')
    }
  }
}

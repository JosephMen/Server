import CONSULTAS_USUARIO from '../queries.js'
import { BadArgumentsError, ConnectionError, RelationalDataError } from '../../Common/errors/errorClasses.js'
import { validatePartialUsuarioToStore, validateUsuarioToStore } from '../Schemas/usuarioToStoreSchema.js'
import { mapEntityToUsuario } from '../utils/mapper.js'
import queryBuilder from '../../Common/utils/queryBuilder.js'
const { createInsertQuery, createUpdateQuery } = queryBuilder
/**
 * @typedef Usuario
 * @property {Number | undefined} id the Id
 * @property {string} nombre Nombre
 * @property {string} username Nombre de usuario unico
 * @property {string | undefined} imagenUrl la direccion de la imagen
 * @property {string} password la direccion de la imagen
 * @property {string} permiso la direccion de la imagen
 */
export default class UsuarioModel {
  #table
  #cliente
  #recordsPerPage
  /**
   *
   * @param {Object} param0
   * @param {import('pg').Pool} param0.cliente
   */
  constructor ({ cliente }) {
    this.#cliente = cliente
    this.#table = 'usuarios'
    this.#recordsPerPage = 10
  }

  /**
   *
   * @returns {Promise<import('pg').PoolClient>}
   */
  getClientForTransact = async () => await this.#cliente.connect()

  /**
   *
   * @returns {Promise<Array<Usuario>>}
   */
  getAll = async ({ page = 0 } = { page: 0 }) => {
    try {
      const offset = page * this.#recordsPerPage
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
   * @param {import('pg').PoolClient} clienteForTransact
   */
  getById = async (id, clienteForTransact = null) => {
    if (typeof id !== 'number') throw new BadArgumentsError('Id debe ser un entero')
    const cliente = clienteForTransact ?? this.#cliente
    try {
      const result = await cliente.query(CONSULTAS_USUARIO.OBTENER, [id])
      if (result.rowCount > 0) return mapEntityToUsuario(result.rows[0])
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener un usuario por id')
    }
  }

  /**
   *
   * @param {string} name
   * @param {import('pg').PoolClient}
   */
  getByUserName = async (name, clienteForTransact) => {
    const cliente = clienteForTransact ?? this.#cliente
    if (typeof name !== 'string') throw new BadArgumentsError('name debe ser una cadena no vacia')
    if (name.trim().length === 0) throw new BadArgumentsError('name no puede ser una cadena solo compuesta de espacios')
    try {
      const result = await cliente.query(CONSULTAS_USUARIO.OBTENER_X_NOMBRE, [name])
      if (result.rowCount > 0) return mapEntityToUsuario(result.rows[0])
      return null
    } catch (e) {
      throw new ConnectionError(e, 'Error al obtener un usuario por nombre')
    }
  }

  /**
   * @param {Usuario} usuario
   * @param {import('pg').PoolClient} clienteForTransact
   * @returns {Promise<Number>}
   */
  add = async (usuario, clienteForTransact = null) => {
    const cliente = clienteForTransact ?? this.#cliente
    const data = validateUsuarioToStore(usuario)
    const [query, values] = createInsertQuery({ table: this.#table, data })
    try {
      const result = await cliente.query(query, values)
      return result.rows[0].id
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al insertar nuevo usuario')
      throw new RelationalDataError(e, 'Error al agregar un nuevo usuario')
    }
  }

  /**
   *
   * @param {Number} id
   * @param {import('pg').PoolClient} clientForTransact
   * @returns {Promise<Boolean>}
   */
  delete = async (id, clientForTransact) => {
    if (typeof id !== 'number') throw new BadArgumentsError('Id debe ser un entero')
    const cliente = clientForTransact ?? this.#cliente
    try {
      const result = await cliente.query(CONSULTAS_USUARIO.ELIMINAR, [id])
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al eliminar usuario')
    }
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {import('pg').PoolClient} clienteForTransact
   * @returns {Promise<Boolean>}
   */
  update = async (usuario, clienteForTransact) => {
    const cliente = clienteForTransact ?? this.#cliente
    const data = validatePartialUsuarioToStore(usuario)
    const [query, values] = createUpdateQuery({ table: this.#table, data, id: data.id })
    if (!query) return true
    try {
      const result = await cliente.query(query, values)
      return result.rowCount > 0
    } catch (e) {
      throw new ConnectionError(e, 'Error al actualizar usuario')
    }
  }

  /**
   * @return {Promise<Number>}
   */
  countAll = async () => {
    try {
      const result = await this.#cliente.query(CONSULTAS_USUARIO.CONTAR_TODOS)
      return result.rows[0].total
    } catch (e) {
      throw new ConnectionError(e, 'Error al contar la cantidad total de usuarios')
    }
  }
}

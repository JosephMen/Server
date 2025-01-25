import UnexpectedError, { BadArgumentsError, BadRequestError } from '../../Common/errors/errorClasses.js'
import bcrypt from 'bcryptjs'
import { SALT } from '../../config.js'
/**
* @typedef Usuario
* @property {Number} id the Id
* @property {string} nombre Nombre
* @property {string} imagenUrl la direccion de la imagen
* @property {string} password la direccion de la imagen
* @property {string} permiso la direccion de la imagen
*/
export default class UsuarioService {
  #usuarioModel
  #imagenService

  /**
   *
   * @param {import('../Model/usuario.js').default} usuarioModel
   * @param {import('../../Imagen/Services/imagenService.js').default} imagenService
   */
  constructor (usuarioModel, imagenService) {
    this.#usuarioModel = usuarioModel
    this.#imagenService = imagenService
  }

  #doTransact = async (fun, params) => {
    if (!params) throw new BadArgumentsError('El argumento params no esta definido')
    if (typeof params !== 'object') throw new BadArgumentsError('El argumento para la transaccion debe ser un objeto')
    const cliente = await this.#usuarioModel.getClientForTransact()
    params.clientForTransact = cliente
    try {
      await cliente.query('BEGIN')
      const result = await fun(params)
      await cliente.query('COMMIT')
      return result
    } catch (e) {
      await cliente.query('ROLLBACK')
      throw e
    } finally {
      cliente.release()
    }
  }

  add = async (usuario, imagen) => {
    return await this.#doTransact(this.#add, { usuario, imagen })
  }

  /**
   * @param {object} param0
   * @param {Usuario} param0.usuario
   * @param {import('pg').PoolClient} param0.clientForTransact
   * @param {*} param0.imagen
   * @returns
   */
  #add = async ({ usuario, imagen, clientForTransact }) => {
    const usuarioPrev = await this.#usuarioModel.getByUserName(usuario.nombre)
    if (usuarioPrev) throw new BadRequestError('Ya existe un usuario con ese nombre')
    usuario.password = bcrypt.hashSync(usuario.password, SALT)
    usuario.id = await this.#usuarioModel.add(usuario, clientForTransact)
    if (imagen) {
      usuario.imagenUrl = await this.#imagenService.attachImageToUsuario({ imagen, id: usuario.id, clientForTransact })
      const { id, imagenUrl } = usuario
      await this.#usuarioModel.update({ id, imagenUrl }, clientForTransact)
    }
    return usuario
  }

  update = async (usuario, imagen) => {
    return await this.#doTransact(this.#update, { usuario, imagen })
  }

  /**
   * @param {Object} param
   * @param {Usuario} param.usuario
   * @param {*} param.imagen
   * @param {import('pg').PoolClient} param.clienteForTransact
   * @returns {Promise<Usuario>}
   */
  #update = async ({ usuario, imagen, clienteForTransact }) => {
    const usuarioBD = await this.#usuarioModel.getById(usuario.id, clienteForTransact)
    if (!usuarioBD) throw new BadRequestError('Usuario no existe')
    if (imagen) usuario.imagenUrl = await this.#imagenService.attachImageToUsuario({ imagen, id: usuario.id, clienteForTransact })
    await this.#usuarioModel.update(usuario, clienteForTransact)
    return await this.#usuarioModel.getById(usuario.id, clienteForTransact)
  }

  /**
   *
   * @param {number} id
   * @returns {Promise<Boolean>}
   */
  delete = async (id) => {
    return await this.#doTransact(this.#delete, { id })
  }

  /**
   *
   * @param {Number} usuarioId
   */
  getById = async (usuarioId) => {
    return await this.#usuarioModel.getById(usuarioId)
  }

  /**
   *
   * @param {String} username
   */
  getByUsername = async (username) => {
    return await this.#usuarioModel.getByUserName(username)
  }

  /**
   *
   * @returns {Promise<Array<Usuario>>}
   */
  getAll = async ({ page = 0 } = { page: 0 }) => {
    return await this.#usuarioModel.getAll({ page })
  }

  /**
   *
   * @param {objet} param
   * @param {number} param.id
   * @param {import('pg').PoolClient} param.clientForTransact
   * @returns
   */
  #delete = async ({ id, clientForTransact }) => {
    const user = await this.#usuarioModel.getById(id)
    if (!user) throw new BadRequestError('Usuario no encontrado')
    const isImageDeleted = await this.#imagenService.deleteImageFromUsuario({ id, clientForTransact })
    if (!isImageDeleted) throw new UnexpectedError('Inesperadamente no se ha eliminado la imagen del usuario con id:  ' + id)
    return await this.#usuarioModel.delete(id, clientForTransact)
  }

  /**
   *
   * @param {object} passwordData
   * @param {string} passwordData.prevPassword
   * @param {string} passwordData.newPassword
   */
  changePassword = async (passwordData) => {
    const userFromDB = await this.#usuarioModel.getById(passwordData.id)
    const isTheSame = await bcrypt.compare(passwordData.prevPassword, userFromDB.password)
    if (!isTheSame) throw new BadRequestError('La contraseña no es correcta')
    const hashedPass = bcrypt.hashSync(passwordData.newPassword, SALT)
    return await this.#usuarioModel.update({ password: hashedPass, id: passwordData.id })
  }

  countAll = async () => {
    return await this.#usuarioModel.countAll()
  }
}

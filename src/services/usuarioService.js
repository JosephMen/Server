import { BadArgumentsError } from '../middlewares/error/errorClasses.js'
import ImagenService from './imagenService.js'
import UsuarioModel from '../models/usuario.js'
import bcrypt from 'bcryptjs'
import { SALT } from '../config.js'

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
   * @param {UsuarioModel} usuarioModel
   * @param {ImagenService} imagenService
   */
  constructor (usuarioModel, imagenService) {
    this.#usuarioModel = usuarioModel
    this.#imagenService = imagenService
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {*} imagen
   * @returns
   */
  add = async (usuario, imagen) => {
    usuario.password = bcrypt.hashSync(usuario.password, SALT)
    usuario.id = await this.#usuarioModel.add(usuario)
    if (imagen) {
      usuario.imagenUrl = await this.#imagenService.attachImageToUsuario(imagen, usuario.id)
      await this.#usuarioModel.update(usuario)
    }
    return await this.#usuarioModel.getById(usuario.id)
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
   * @param {String} nombre
   */
  getByName = async (nombre) => {
    return await this.#usuarioModel.getByName(nombre)
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {ArrayBuffer} imagen
   * @returns {Promise<Usuario>}
   */
  update = async (usuario, imagen) => {
    const usuarioBD = await this.#usuarioModel.getById(usuario.id)
    if (!usuarioBD) throw new BadArgumentsError('Usuario no encontrado')
    if (imagen) usuario.imagenUrl = await this.#imagenService.attachImageToUsuario(imagen, usuario.id)
    await this.#usuarioModel.update({ ...usuarioBD, ...usuario })
    return await this.#usuarioModel.getById(usuario.id)
  }

  /**
   *
   * @returns {Promise<Array<Usuario>>}
   */
  getAll = async ({ offset }) => {
    return await this.#usuarioModel.getAll({ offset })
  }

  delete = async (id) => {
    const esEliminado = await this.#usuarioModel.delete(id)
    // const imagenEliminada = await this.#imagenService.deleteImagenRelacion('usuario', )
    if (!esEliminado) throw new BadArgumentsError('No se encontro el usuario')
  }
}

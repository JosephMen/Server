import { BadArgumentsError } from '../middlewares/error/errorClasses.js'
import ImagenService from './imagenService.js'
import UsuarioModel from '../models/usuario.js'
/**
 * @typedef Usuario
 * @property {Number} id the Id
 * @property {string} nombre Nombre
 * @property {string} imagenUrl la direccion de la imagen
 */
export default class UsuarioService {
  constructor (usuarioModel, imagenService) {
    /**
     * @type {UsuarioModel}
     */
    this.usuarioModel = usuarioModel
    /**
     * @type {ImagenService}
     */
    this.imagenService = imagenService
  }

  add = async (usuario, imagen) => {
    usuario.id = await this.usuarioModel.add(usuario)
    if (imagen) {
      usuario.imagenUrl = await this.imagenService.attachImageToUsuario(imagen, usuario.id)
      await this.usuarioModel.update(usuario)
    }
    return await this.usuarioModel.getById(usuario.id)
  }

  getById = async (usuarioId) => {
    return await this.usuarioModel.getById(usuarioId)
  }

  update = async (usuario, imagen) => {
    const usuarioBD = await this.usuarioModel.getById(usuario.id)
    if (usuarioBD === null) throw new BadArgumentsError('Usuario no encontrado')
    if (imagen) usuario.imagenUrl = await this.imagenService.attachImageToUsuario(imagen, usuario.id)
    await this.usuarioModel.update({ ...usuarioBD, ...usuario })
    return await this.usuarioModel.getById(usuario.id)
  }

  /**
   *
   * @returns {Promise<Array<Usuario>>}
   */
  getAll = async ({ offset }) => {
    return await this.usuarioModel.getAll({ offset })
  }

  delete = async (usuarioId) => {
    const esEliminado = await this.usuarioModel.delete({ usuarioId })
    if (!esEliminado) throw new BadArgumentsError('No se encontro el usuario')
  }
}

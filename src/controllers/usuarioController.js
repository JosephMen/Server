import { messageSuccessCreator } from '../utils/messageCreator.js'
import IController from '../interfaces/controllers/IController.js'
import { BadArgumentsError } from '../middlewares/error/errorClasses.js'
import AppError from '../middlewares/error/AppError.js'
import UsuarioService from '../services/usuarioService.js'

export default class UsuarioController extends IController {
  /**
   * @param {{usuarioService: UsuarioService}} param0
   */
  constructor ({ usuarioService }) {
    super()
    this.usuarioService = usuarioService
  }

  getAll = async (req, res, next) => {
    try {
      const offset = req.query?.offset
      const param = {}
      if (offset) param.offset = offset
      const usuarios = await this.usuarioService.getAll(param)
      const messages = messageSuccessCreator({ cantidad: usuarios.length, data: usuarios })
      return res.json(messages)
    } catch (e) {
      return next(new AppError(e, 'Error al obtener usuarios'))
    }
  }

  get = async (req, res, next) => {
    try {
      const { skip, id } = req.body
      if (skip) return next()
      const usuario = await this.usuarioService.getById(id)
      if (usuario === null) throw new BadArgumentsError('Usuario no encontrado')
      const message = messageSuccessCreator({ data: usuario })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error en obtener un usuario'))
    }
  }

  add = async (req, res, next) => {
    try {
      const imagen = req?.files?.imagen
      const { user } = req.body
      const usuario = await this.usuarioService.add(user, imagen)
      const message = messageSuccessCreator({
        mensaje: 'Usuario creado',
        data: usuario
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar usuario'))
    }
  }

  delete = async (req, res, next) => {
    const { skip, id } = req.body
    if (skip) return next()
    try {
      await this.usuarioService.delete(id)
      return res.json(messageSuccessCreator({ mensaje: 'Usuario eliminado exitosamente' }))
    } catch (e) {
      return next(new AppError(e, 'Error al eliminar usuario'))
    }
  }

  update = async (req, res, next) => {
    const { skip, user } = req.body
    if (skip) return next()
    const imagen = req.files?.imagen
    try {
      const usuarioActualizado = await this.usuarioService.update(user, imagen)
      const message = messageSuccessCreator({
        mensaje: 'Usuario actualizado',
        data: usuarioActualizado
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al actualizar usuario'))
    }
  }
}

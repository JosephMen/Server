import { messageSuccessCreator } from '../../utils/messageCreator.js'
import IController from '../../interfaces/controllers/IController.js'
import { BadArgumentsError } from '../../middlewares/error/errorClasses.js'
import AppError from '../../middlewares/error/AppError.js'
import UsuarioService from '../services/usuarioService.js'
import { mapBodyPartialToUsuario, mapBodyToUsuario } from '../../utils/mapper.js'

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
      const offset = req?.query?.offset
      const param = {}
      if (offset) param.offset = offset
      const usuarios = await this.usuarioService.getAll(param)
      const messages = messageSuccessCreator({ cantidad: usuarios.length, data: usuarios })
      return res.json(messages)
    } catch (e) {
      return next(new AppError(e, 'Error en obtener usuarios'))
    }
  }

  get = async (req, res, next) => {
    try {
      const usuarioId = req.params.id
      const usuario = await this.usuarioService.getById(usuarioId)
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
      const usuarioBody = mapBodyToUsuario(req.body)
      if (usuarioBody === null) throw new BadArgumentsError('Error en la peticion')
      const usuario = await this.usuarioService.add(usuarioBody, imagen)
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
    const usuarioId = req.params.id
    try {
      await this.usuarioService.delete(usuarioId)
      return res.json(messageSuccessCreator({ mensaje: 'Usuario eliminado exitosamente' }))
    } catch (e) {
      return next(new AppError(e, 'Error al eliminar usuario'))
    }
  }

  update = async (req, res, next) => {
    try {
      const imagen = req?.files?.imagen
      const usuarioBody = mapBodyPartialToUsuario(req.body)
      if (usuarioBody === null) throw new BadArgumentsError('Error en el cuerpo de peticion')
      usuarioBody.id = req.params.id
      const usuarioActualizado = await this.usuarioService.update(usuarioBody, imagen)
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

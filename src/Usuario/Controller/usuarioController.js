import { messageErrorCreator, messageSuccessCreator } from '../../Common/utils/messageCreator.js'
import { BadArgumentsError, AuthorizationError, BadRequestError } from '../../Common/errors/errorClasses.js'
import AppError from '../../Common/errors/AppError.js'
import PERMISOS from '../utils/permissions.js'
import INVALID_AUTH_CODES from '../../Common/errors/authCodes.js'
import { mapEntityUsuarioToShow } from '../utils/mapper.js'

/**
 * @typedef userAuth
 * @property {string} permiso
 * @property {Number} id
 * @property {string} nombre
 */
export default class UsuarioController {
  #usuarioService
  /**
   * @param {object} param
   * @param {import('../Services/usuarioService.js').default} param.usuarioService
   */
  constructor ({ usuarioService }) {
    this.#usuarioService = usuarioService
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  getAll = async (req, res, next) => {
    try {
      const offset = req.query?.offset
      const usuarios = (await this.#usuarioService.getAll({ offset })).map(us => mapEntityUsuarioToShow(us))
      const messages = messageSuccessCreator({ cantidad: usuarios.length, data: usuarios })
      return res.json(messages)
    } catch (e) {
      return next(new AppError(e, 'Error al obtener usuarios'))
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  get = async (req, res, next) => {
    try {
      const { skip, id } = req.body
      if (skip) return next()
      const usuario = mapEntityUsuarioToShow(await this.#usuarioService.getById(id))
      if (usuario === null) throw new BadArgumentsError('Usuario no encontrado')
      const message = messageSuccessCreator({ data: usuario })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error en obtener un usuario'))
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  add = async (req, res, next) => {
    try {
      const imagen = req?.files?.imagen
      const { user, userAuth } = req.body
      this.#validatePermission(user.permiso, userAuth.permiso)
      const usuario = mapEntityUsuarioToShow(await this.#usuarioService.add(user, imagen))
      const message = messageSuccessCreator({
        mensaje: 'Usuario creado',
        data: usuario
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar usuario'))
    }
  }

  #validatePermission (toSet, actual) {
    if (toSet === PERMISOS.ADMIN && actual !== PERMISOS.ADMIN) {
      throw new AuthorizationError(`No tiene privilegios para crear usuario con permiso '${toSet}'`, INVALID_AUTH_CODES.FORBIDDEN)
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  changePassword = async (req, res, next) => {
    if (req.body.skip) return next()
    const { pass, userAuth } = req.body
    try {
      this.#validatePasswordChangePermission(pass.id, userAuth)
      const isChanged = await this.#usuarioService.changePassword(pass)
      if (isChanged) return res.json(messageSuccessCreator({ mensaje: 'Contraseña cambiada' }))
      return res
        .status(INVALID_AUTH_CODES.USER_PASS_NOT_VALID)
        .json(messageErrorCreator({ mensaje: 'No se ha cambiado la contraseña' }))
    } catch (e) {
      return next(new AppError(e, 'Error al cambiar contraseña'))
    }
  }

  /**
   *
   * @param {number} id
   * @param {userAuth} userAuth
   */
  #validatePasswordChangePermission (id, userAuth) {
    if (id !== userAuth.id) throw new BadRequestError('No puedes actualizar la contraseña de otro usuario')
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  delete = async (req, res, next) => {
    const { skip, id, userAuth } = req.body
    if (skip) return next()
    try {
      await this.#validatePermisionForDelete(userAuth, id)
      const isDelete = await this.#usuarioService.delete(id)
      const mensaje = isDelete ? 'Usuario eliminado exitosamente' : 'Usuario no pudo ser eliminado'
      if (isDelete) return res.json(messageSuccessCreator({ mensaje }))
      return res.status(500).json(messageErrorCreator({ mensaje }))
    } catch (e) {
      return next(new AppError(e, 'Error al eliminar usuario'))
    }
  }

  /**
   *
   * @param {userAuth} userWhoDeletes
   * @param {number} idToDelete
   */
  #validatePermisionForDelete = async (userWhoDeletes, idToDelete) => {
    if (userWhoDeletes.id !== idToDelete && userWhoDeletes.permiso !== PERMISOS.ADMIN) throw new AuthorizationError('No puedes modificar o eliminar otro usuario')
    const userToDelete = await this.#usuarioService.getById(idToDelete)
    if (userWhoDeletes.permiso === userToDelete.permiso) throw new AuthorizationError('No puedes borrar a otro usuario con el mismo permiso')
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  update = async (req, res, next) => {
    const { skip, user, userAuth } = req.body
    if (skip) return next()
    const imagen = req.files?.imagen
    try {
      this.#validatePermissionForUpdate(userAuth, user)
      const usuarioActualizado = mapEntityUsuarioToShow(await this.#usuarioService.update(user, imagen))
      const message = messageSuccessCreator({
        mensaje: 'Usuario actualizado',
        data: usuarioActualizado
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al actualizar usuario'))
    }
  }

  /**
   *
   * @param {userAuth} userAuth usuario extraido del token credencial
   * @param {object} user objeto usuario con las propiedades a ser actualizadas
   */
  #validatePermissionForUpdate = (userAuth, user) => {
    if (userAuth.permiso === PERMISOS.GUESS) throw new AuthorizationError('No posee privilegios para actualizar usuario')
    if (userAuth.id !== user.id && userAuth.permiso !== PERMISOS.ADMIN) throw new AuthorizationError('No puedes modificar un usuario diferente al tuyo', INVALID_AUTH_CODES.NOT_AUTHORIZED)
    if (userAuth.permiso !== PERMISOS.ADMIN && user.permiso === PERMISOS.ADMIN) throw new AuthorizationError('No tiene privilegios para cambiar de permiso')
  }
}

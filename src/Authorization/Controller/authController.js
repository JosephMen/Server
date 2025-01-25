import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import AppError from '../../Common/errors/AppError.js'
import { LLAVE_SECRETA } from '../../config.js'
import { AuthorizationError, BadArgumentsError, BadRequestError } from '../../Common/errors/errorClasses.js'
import PERMISOS from '../../Usuario/utils/permissions.js'
import IAuthCtrl from '../../Interfaces/Controllers/IAuthCtrl.js'
const { compare } = bcrypt
export default class AuthenticationController extends IAuthCtrl {
  #usuarioService
  /**
   *
   * @param {Object} param0
   * @param {import('../../Usuario/Services/usuarioService.js').default} param0.usuarioService
   */
  constructor ({ usuarioService }) {
    super()
    this.#usuarioService = usuarioService
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  login = async (req, res, next) => {
    try {
      const { user } = req.body
      const userBD = await this.#usuarioService.getByUsername(user.username)
      if (!userBD) throw new AuthorizationError('Usuario o contraseña no valida')
      const match = await compare(user.password, userBD.password)
      if (!match) throw new AuthorizationError('Usuario o contraseña no')
      const token = jwt.sign({ username: userBD.username, permiso: userBD.permiso, id: userBD.id }, LLAVE_SECRETA, { expiresIn: '1d' })
      return res.json({ ok: true, token })
    } catch (e) {
      return next(new AppError(e, 'Error para autorizar usuario con token JWT'))
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  checkPermission = async (req, res, next) => {
    const { skip, userAuth } = req.body
    if (skip) return next()
    try {
      if (!userAuth) throw new BadArgumentsError('No existe "userAuth" en el cuerpo de peticion')
      const { id, permiso } = userAuth
      if (permiso === PERMISOS.GUESS) return next()
      const userDB = await this.#usuarioService.getById(id)
      if (!userDB) throw new BadRequestError('Ejecutante de acción ya no está registrado, permiso invalido')
      if (userDB.permiso !== permiso) throw new BadRequestError('Permiso desactualizado')
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error al revisar permisos de autenticacion de usuarios'))
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  static validate = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization
      let token = null
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.split(' ')[1]
      }
      if (!token) {
        req.body.userAuth = { username: 'Invitado', permiso: PERMISOS.GUESS }
        return next()
      }
      const validPayload = this.#verifyToken(token)
      req.body.userAuth = validPayload
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error al validar token'))
    }
  }

  static #verifyToken = (token) => {
    try {
      const payload = jwt.verify(token, LLAVE_SECRETA)
      return payload
    } catch (e) {
      throw new BadRequestError('Token de autorizacion no valido')
    }
  }
}

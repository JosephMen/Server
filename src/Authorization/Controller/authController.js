import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import AppError from '../../Common/errors/AppError.js'
import { LLAVE_SECRETA } from '../../config.js'
import { AuthorizationError, BadRequestError } from '../../Common/errors/errorClasses.js'
import INVALID_AUTH_CODES from '../../Common/errors/authCodes.js'
import PERMISOS from '../../Usuario/utils/permissions.js'
const { compare } = bcrypt
export default class AuthenticationController {
  #usuarioService
  /**
   *
   * @param {Object} param0
   * @param {import('../../Usuario/Services/usuarioService.js').default} param0.usuarioService
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
  login = async (req, res, next) => {
    try {
      const { user } = req.body
      const userBD = await this.#usuarioService.getByName(user.nombre)
      if (!userBD) throw new AuthorizationError('Usuario o contraseña no valida')
      const match = await compare(user.password, userBD.password)
      if (!match) throw new AuthorizationError('Usuario o contraseña no valida')
      const token = jwt.sign({ nombre: user.nombre, permiso: userBD.permiso, id: userBD.id }, LLAVE_SECRETA, { expiresIn: '1d' })
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
   * @returns
   */
  validate = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization
      let token = null
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.split(' ')[1]
      }
      if (!token) {
        req.body.userAuth = { nombre: 'Invitado', permiso: PERMISOS.GUESS }
        return next()
      }
      const validPayload = this.#verifyToken(token)
      req.body.userAuth = validPayload
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error al validar token'))
    }
  }

  #verifyToken = (token) => {
    try {
      const payload = jwt.verify(token, process.env.LLAVE_SECRETA)
      return payload
    } catch (e) {
      throw new BadRequestError('Token de autorizacion no valido')
    }
  }
}

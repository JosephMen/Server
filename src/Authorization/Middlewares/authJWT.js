import jwt from 'jsonwebtoken'
import { LLAVE_SECRETA } from '../../config.js'
import { AuthorizationError } from './error/errorClasses.js'
import AppError from './error/AppError.js'

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
export const auth = (req, res, next) => {
  try {
    const { user, pass } = req.body.authPayload
    if (!user || !pass) throw new AuthorizationError('Usuario o Password no validos para autenticar')
    const token = jwt.sign({ user }, LLAVE_SECRETA)
    return res.json({
      user, token
    })
  } catch (e) {
    next(new AppError(e, 'Usuario o Password no validos'))
  }
}
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
export const login = (req, res, next) => {
  try {
    const token = req.headers.get('authorization')
    if (!token) {
      req.user = 'anonimo'
      return next()
    }
    const validPayload = jwt.verify(token, LLAVE_SECRETA)
    req.user = validPayload.user
    return next()
  } catch (e) {
    console.log(e)
    return res.status(401).json({ ok: false, message: 'Token no valido' })
  }
}

export default auth

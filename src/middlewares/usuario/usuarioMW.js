import { validatePartialUsuarioToAdd, validateUsuarioToAuth, validateUsuarioToAdd } from '../../schema/usuarioSchema.js'
import AppError from '../error/AppError.js'
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
export default async function validateBodyForAuthUsuario (req, res, next) {
  try {
    const data = validateUsuarioToAuth(req.body)
    req.body.user = data
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error en los parametros del body requeridos para autenticar usuario'))
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
export async function validateBodyForAddUsuario (req, res, next) {
  try {
    const data = validateUsuarioToAdd(req.body)
    req.body.user = data
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error en los parametros del body para agregar usuario'))
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
export async function validateBodyForUpdateUsuario (req, res, next) {
  try {
    if (req.body.skip) return next()
    const user = validatePartialUsuarioToAdd(req.body)
    req.body.user = user
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error en los parametros del body para actualizar usuario'))
  }
}

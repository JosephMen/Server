import { validatePartialUsuarioToAdd, validateUsuarioToAdd } from '../Schemas/usuarioToAddSchema.js'
import { validateUsuarioToAuth } from '../Schemas/usuarioToAuthSchema.js'
import AppError from '../../Common/errors/AppError.js'
import { BadArgumentsFromClientError } from '../../Common/errors/errorClasses.js'
import { validateNewPasswordSchema } from '../Schemas/newPasswordSchema.js'
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
export default async function MwValidateBodyForAuthUsuarioMw (req, res, next) {
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
export async function MwValidateBodyForAddUsuario (req, res, next) {
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
export async function MwValidateBodyForUpdateUsuario (req, res, next) {
  try {
    if (req.body.skip) return next()
    const user = validatePartialUsuarioToAdd(req.body)
    delete user.password
    req.body.user = user
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error en los parametros del body para actualizar usuario'))
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function MwValidateNewPassword (req, res, next) {
  if (req.body.skip) return next()
  try {
    const { prevPassword, newPassword } = req.body
    if (!prevPassword || !newPassword) {
      throw new BadArgumentsFromClientError(
        'No se encontro argumentos necesarios para cambiar contraseña',
        'se esperaba encontrar argumentos prevPassword y newPassword',
        `Se encontro: prevPassword: ${prevPassword} y newPassword: ${newPassword}`)
    }
    const data = validateNewPasswordSchema({ prevPassword, newPassword, id: req.body.id })
    req.body.passwordData = data
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error al validar argumentos para cambiar contraseña'))
  }
}

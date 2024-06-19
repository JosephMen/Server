import { validateUsuarioAuth } from '../../schema/usuarioSchema.js'
import { mapBodyToUsuario } from '../../utils/mapper.js'
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
export default function validateBodyForAuthUsuario (req, res, next) {
  try {
    const data = validateUsuarioAuth(req.body)
    req.user = data
    return next()
  } catch (e) {
    return res.status(401).json({ ok: false, message: 'user or pass not valid' })
  }
}

export function validateBodyForAddUsuario (req, res, next) {
  try {
    const data = mapBodyToUsuario(req.body)
    req.user = data
    return next()
  } catch (e) {
    return res.status(401).json({ ok: false, message: 'user or pass not valid' })
  }
}

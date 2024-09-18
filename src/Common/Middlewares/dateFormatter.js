import dateFormat from '../utils/dateFormat.js'
import AppError from './error/AppError.js'
import { BadArgumentsError } from './error/errorClasses.js'

const dateFormatter = (req, res, next) => {
  try {
    if (req.body.fechaentrada) req.body.fechaentrada = dateFormat(req.body.fechaentrada)
    if (req.body.fechamodificacion) req.body.fechamodificacion = dateFormat(req.body.fechamodificacion)
    return next()
  } catch (e) {
    const error = new BadArgumentsError('Error en formato fecha: ' + e.message)
    return next(new AppError(error, 'Error al formatear fecha'))
  }
}

export const dateFormatterCustom = (propertieName) => {
  if (typeof propertieName !== 'string') throw new Error('La propiedad debe ser un string')
  if (propertieName.trim() === '') throw new Error('La propiedad debe ser una cadena string no vacio')
  return (req, res, next) => {
    try {
      if (req.body[propertieName]) req.body[propertieName] = dateFormat(req.body[propertieName])
      return next()
    } catch (e) {
      const error = new BadArgumentsError('Error en formato fecha: ' + e.message)
      return next(new AppError(error, 'Error al formatear fecha'))
    }
  }
}

export default dateFormatter

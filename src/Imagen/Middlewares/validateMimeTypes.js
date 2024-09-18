import AppError from '../../Common/errors/AppError.js'
import { fileTypeFromBuffer } from 'file-type'
import { BadRequestError } from '../../Common/errors/errorClasses.js'
import { getMimeTypeFromName, isAllowedImageMimeType, isAllowedImageNameExtension } from '../Utils/ImageMimeTypes.js'
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function MwValidateImageType (req, res, next) {
  try {
    const imagen = req?.files?.imagen

    if (!imagen) return next()

    if (Array.isArray(imagen)) throw new BadRequestError('Se esperaba una unica imagen, enviadas: ' + imagen.length)

    const { mimetype: mimeType, name: nombre } = imagen

    if (isAllowedImageMimeType(mimeType)) {
      imagen.mimetype = mimeType
      return next()
    }

    if (isAllowedImageNameExtension(nombre)) {
      imagen.mimetype = getMimeTypeFromName(nombre)
      return next()
    }

    const type = await fileTypeFromBuffer(imagen.data)
    if (!type || !isAllowedImageMimeType(type.mime)) throw new BadRequestError('Campo "imagen" no contiene un formato de archivo permitido')

    imagen.mimetype = type.mime
    return next()
  } catch (e) {
    next(new AppError(e, 'Error al procesar imagen'))
  }
}

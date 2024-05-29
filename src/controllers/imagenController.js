import AppError from '../middlewares/error/AppError.js'
import ImagenModel from '../models/imagen.js'
import { messageErrorCreator } from '../utils/messageCreator.js'
export default class ImagenController {
  #imagenService
  /**
   *
   * @param {{imagenModel: ImagenModel}} param0
   */
  constructor ({ imagenModel, imagenService }) {
    this.ImagenModel = imagenModel
    this.#imagenService = imagenService
  }

  getImagen = async (req, res, next) => {
    const imagenId = req.params.id
    try {
      const result = await this.ImagenModel.getById(imagenId)
      if (result !== null) {
        res.contentType(result.mimetype)
        return res.send(result.imagen)
      }
      const message = messageErrorCreator({
        mensaje: 'No se encontro registro de la imagen',
        errorDes: 'Asegurese de obtener una url actualizada'
      })
      res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error en el metodo getImagen'))
    }
  }
}

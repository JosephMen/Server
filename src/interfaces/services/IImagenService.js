import UnexpectedError from '../../middlewares/error/errorClasses.js'

const error = new UnexpectedError('Metodo de interfaz no implementado')
export default class IImagenService {
  attachImageToProducto = (imagen, productoId) => {
    throw error
  }

  attachImageToUsuario = (imagen, usuarioId) => {
    throw error
  }
}

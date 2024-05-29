import cors from 'cors'
import express from 'express'
import pkg from 'body-parser'
import fileUpload from 'express-fileupload'
import createUsuariosRouter from '../routes/usuarios.js'
import createProductoRouter from '../routes/producto.js'
import createImagenRouter from '../routes/imagen.js'
import ImagenController from '../controllers/imagenController.js'
import ProductoController from '../controllers/productoController.js'
import UsuarioController from '../controllers/usuarioController.js'
const { json, urlencoded } = pkg
function AppBuilder () {
  this.ImagenController = null
  this.ProductoController = null
  this.UsuarioController = null
  this.errorHandler = null

  this.app = express()

  this.addImagenController = (ImagenController) => {
    this.ImagenController = ImagenController
    return this
  }
  this.addProductoController = (ProductoController) => {
    this.ProductoController = ProductoController
    return this
  }
  this.addUsuarioController = (UsuarioController) => {
    this.UsuarioController = UsuarioController
    return this
  }
  this.addController = (route, controller) => {
    this.app.use('route')
    return this
  }
  this.addErrorHandler = (errorHandler) => {
    this.errorHandler = errorHandler
    return this
  }

  this.build = () => {
    if (!(this.ImagenController instanceof ImagenController)) {
      throw new Error('Sin controlador para Imagen')
    }
    if (!(this.ProductoController instanceof ProductoController)) {
      throw new Error('Sin controlador para Producto')
    }
    if (!(this.UsuarioController instanceof UsuarioController)) {
      throw new Error('Sin controlador para usuario')
    }
    this.app.use(cors())
    this.app.use(json())
    this.app.use(fileUpload({ createParentPath: true }))
    this.app.use(urlencoded({ extended: true }))

    this.app.use('/usuarios', createUsuariosRouter({ usuarioController: this.UsuarioController }))
    this.app.use('/imagen', createImagenRouter({ imagenController: this.ImagenController }))
    this.app.use('/productos', createProductoRouter({ productoController: this.ProductoController }))
    this.app.use(this.errorHandler.handle)

    return this.app
  }
}
export default AppBuilder

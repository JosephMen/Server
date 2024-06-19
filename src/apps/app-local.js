import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import createUsuariosRouter from '../routes/usuarios.js'
import createProductoRouter from '../routes/producto.js'
import createImagenRouter from '../routes/imagen.js'
import ErrorAppHandler from '../middlewares/error/errorHandler.js'
import pkg from 'body-parser'
import UsuarioModel from '../models/usuario.js'
import ImagenModel from '../models/imagen.js'
import ProductoModel from '../models/producto.js'
import UsuarioController from '../controllers/usuarioController.js'
import ProductoController from '../controllers/productoController.js'
import ImagenController from '../controllers/imagenController.js'
import UsuarioService from '../services/usuarioService.js'
import ImagenService from '../services/imagenService.js'
import ProductoService from '../services/productoService.js'
import EtiquetaModel from '../models/etiqueta.js'
import EtiquetaService from '../services/EtiquetaService.js'
import Marca from '../models/marca.js'
import Proveedor from '../models/proveedor.js'
import Categoria from '../models/categoria.js'
import ImagenRelacion from '../models/imagen-relacion.js'
import cookieParser from 'cookie-parser'
import ExistenciaController from '../controllers/existenciaController.js'
import ExistenciaService from '../services/existenciaService.js'
import Existencia from '../models/existencia.js'
import createExistenciaRouter from '../routes/existencia.js'
import Venta from '../models/venta.js'
import VentaService from '../services/VentaService.js'
import VentaController from '../controllers/ventaController.js'
import createVentaRouter from '../routes/venta.js'
import auth from '../middlewares/authJWT.js'
import AuthenticationController from '../controllers/authController.js'
import createAuthRouter from '../routes/auth.js'

const { json, urlencoded } = pkg

const createApp = (cliente) => {
  const app = express()
  const errorHandler = new ErrorAppHandler()
  const usuarioModel = new UsuarioModel({ cliente })
  const imagenModel = new ImagenModel({ cliente })
  const productoModel = new ProductoModel({ cliente })
  const etiquetaModel = new EtiquetaModel({ cliente })
  const marcaModel = new Marca(cliente, console.log)
  const proveedorModel = new Proveedor(cliente, console.log)
  const categoriaModel = new Categoria(cliente, console.log)
  const imagenRelaciones = new ImagenRelacion({ cliente, logger: console.log })
  const existenciaModel = new Existencia({ cliente })
  const ventaModelo = new Venta({ cliente })

  const imagenService = new ImagenService(imagenModel, imagenRelaciones)
  const usuarioService = new UsuarioService(usuarioModel, imagenService)
  const productoService = new ProductoService({ imagenService, productoModel, marcaModel, proveedorModel, categoriaModel })
  const etiquetaService = new EtiquetaService(etiquetaModel)
  const existenciaService = new ExistenciaService({ existenciaModel })
  const ventaService = new VentaService({ ventaModelo })

  const usuarioController = new UsuarioController({ usuarioService })
  const productoController = new ProductoController({ productoService, etiquetaService })
  const imagenController = new ImagenController({ imagenModel })
  const existenciaController = new ExistenciaController({ existenciaService })
  const ventaController = new VentaController({ ventaService })
  const authenticationController = new AuthenticationController({ usuarioService })

  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(cookieParser())
  // app.use(login)

  app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 2 * 1024 * 1024 }
  }))
  app.use(authenticationController.validate)
  app.use(cors())
  app.post('/auth', createAuthRouter({ authenticationController }))
  app.use('/usuarios', createUsuariosRouter({ usuarioController }))
  app.use('/productos', createProductoRouter({ productoController }))
  app.use('/imagen', createImagenRouter({ imagenController }))
  app.use('/existencia', createExistenciaRouter({ existenciaController }))
  app.use('/venta', createVentaRouter({ ventaController }))
  app.use('*', (req, res, next) => {
    return res.status(404).json({
      message: 'Ruta no encontrada',
      data: []
    })
  })
  app.use(errorHandler.handle)
  return app
}

export default createApp

import e from 'express'
import pkg from 'body-parser'
import UsuarioController from '../../controllers/usuarioController.js'
import UsuarioService from '../../services/usuarioService.js'
import createUsuariosRouter from '../../routes/usuarios.js'
import ErrorHandler from '../../middlewares/error/errorHandler.js'

export function createUserEP ({
  usuarioModel,
  imagenService
}) {
  const errorHandler = new ErrorHandler()
  const usuarioService = new UsuarioService(usuarioModel, imagenService)
  const usuarioController = new UsuarioController({ usuarioService })
  const { json, urlencoded } = pkg
  const app = e()

  app.use(json())
  app.use(urlencoded({ extended: true }))

  app.get('/', async (req, res) => {
    return res.send('<h1>Hello World</h1>')
  })
  app.use('/usuarios', createUsuariosRouter({ usuarioController }))
  app.use('*', (req, res, next) => {
    return res.status(404).send('<h1> 404 Ruta no encontrada </h1>')
  })
  app.use(errorHandler.handle)

  return app
}

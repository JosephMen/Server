import AppDemo from './app1.js'
import config from '../../config.js'
import AFRoutes from '../AFRoutes.js'
import { clientWrapped as clientePostgres } from '../../connection.js'
import IFactoryEnum from '../../Interfaces/IFactoryEnum.js'
import ErrorHandler from '../../Common/Middlewares/ErrorHandler.js'
const app = new AppDemo({ ...config, PORT: config.APP_PORT })
const errorHandler = new ErrorHandler()
const appFactory = new AFRoutes({ clientePostgres })
const postgresRoutesFactory = appFactory.getFactory(IFactoryEnum.postgres)

const routes = postgresRoutesFactory.getRoutes()
routes.forEach(route => {
  app.addRoute(route)
})
app.setErrorHandler(errorHandler)
app.serve(() => {
  console.log('Connection succesfull')
})
